import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const android = path.join(root, "android");
const gradle = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const args = process.argv.slice(2);
if (!args.length) {
  console.error("Usage: node scripts/gradle.mjs <gradle task>");
  process.exit(1);
}

if (process.platform !== "win32") {
  fs.chmodSync(path.join(android, "gradlew"), 0o755);
}

const result = spawnSync(gradle, args, {
  cwd: android,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
