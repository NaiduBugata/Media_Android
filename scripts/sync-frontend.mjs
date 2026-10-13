import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultApi = "https://janavignanam-production.up.railway.app";
const repoUrl = process.env.FRONTEND_REPO || "https://github.com/NaiduBugata/janavignanam.git";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args, cwd, env = process.env) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function capture(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || "");
    process.exit(result.status ?? 1);
  }
  return (result.stdout || "").trim();
}

const revision = fs.readFileSync(path.join(root, "frontend.revision"), "utf8").trim().split(/\s+/)[0];
if (!/^[0-9a-f]{40}$/i.test(revision)) {
  fail("frontend.revision must contain the full 40-character janavignanam commit SHA");
}

const apiBase = (process.env.VITE_API_BASE_URL || defaultApi).trim().replace(/\/$/, "");
if (!apiBase.startsWith("https://") || /localhost|127\.0\.0\.1/i.test(apiBase)) {
  fail("VITE_API_BASE_URL must be an https origin. localhost is the phone, not Railway.");
}

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const srcOverride = process.env.FRONTEND_SRC;
let clientDir;

if (srcOverride) {
  clientDir = path.resolve(srcOverride);
  if (!fs.existsSync(path.join(clientDir, "package.json"))) {
    fail(`FRONTEND_SRC does not look like the web client: ${clientDir}`);
  }
  console.log(`Local frontend override (GitHub Actions must not set this): ${clientDir}`);
} else {
  const work = path.join(root, "vendor", "frontend");
  fs.rmSync(work, { recursive: true, force: true });
  fs.mkdirSync(work, { recursive: true });
  run("git", ["init"], work);
  run("git", ["remote", "add", "origin", repoUrl], work);
  run("git", ["fetch", "--depth", "1", "origin", revision], work);
  run("git", ["checkout", "--detach", "FETCH_HEAD"], work);
  const head = capture("git", ["rev-parse", "HEAD"], work);
  if (head.toLowerCase() !== revision.toLowerCase()) {
    fail(`Checked out ${head}, expected ${revision}`);
  }
  clientDir = path.join(work, "client");
}

run(npm, ["ci"], clientDir);
run(npm, ["run", "lint"], clientDir);
run(npm, ["run", "build"], clientDir, {
  ...process.env,
  VITE_API_BASE_URL: apiBase,
  VITE_CAPACITOR: "true",
});

const dist = path.join(clientDir, "dist");
const www = path.join(root, "www");
fs.rmSync(www, { recursive: true, force: true });
fs.cpSync(dist, www, { recursive: true });

const builtJs = fs.readdirSync(path.join(www, "assets")).filter((name) => name.endsWith(".js"));
const bundle = builtJs.map((name) => fs.readFileSync(path.join(www, "assets", name), "utf8")).join("\n");
if (!bundle.includes(apiBase)) {
  fail(`Built bundle does not contain ${apiBase}. Refusing to package a build that would call the wrong API.`);
}
if (/localhost:5000|127\.0\.0\.1:5000/.test(bundle)) {
  fail("Built bundle still points at the local API port.");
}

const label = srcOverride ? `local-override (pin ${revision} was not used)` : revision;
fs.writeFileSync(path.join(www, "BUILD.txt"), `frontend ${label}\napi ${apiBase}\n`, "utf8");
console.log(`Synced frontend into www/ (${label})`);
