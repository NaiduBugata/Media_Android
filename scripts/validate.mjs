import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function need(condition, message) {
  if (!condition) errors.push(message);
}

function read(relative) {
  const file = path.join(root, relative);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

const revision = read("frontend.revision").trim().split(/\s+/)[0];
need(/^[0-9a-f]{40}$/i.test(revision), "frontend.revision is not a full commit SHA");

const config = read("capacitor.config.ts");
need(config.includes('appId: "app.janavignanam.mobile"'), "application id drifted");
need(config.includes('webDir: "www"'), "webDir must be www");
need(config.includes('androidScheme: "https"'), "Android scheme must stay https");
need(config.includes("allowMixedContent: false"), "mixed content must stay off");
need(config.includes("CapacitorHttp"), "native HTTP must stay enabled");
need(!/localhost:5000|NEON_DATABASE_URL|GROQ_API_KEY|ADMIN_PASSWORD/.test(config), "capacitor config contains a forbidden value");

const gradle = read("android/app/build.gradle");
if (gradle) {
  need(gradle.includes('applicationId "app.janavignanam.mobile"'), "Gradle applicationId drifted");
  need(gradle.includes("versionName"), "versionName missing");
  need(!gradle.includes("storePassword \""), "a keystore password is hard-coded in Gradle");
}

const manifest = read("android/app/src/main/AndroidManifest.xml");
if (manifest) {
  need(manifest.includes('android:usesCleartextTraffic="false"'), "cleartext traffic must be disabled");
  need(manifest.includes("android.permission.INTERNET"), "INTERNET permission missing");
  need(manifest.includes('android:windowSoftInputMode="adjustResize"'), "keyboard resize mode missing");
}

const www = path.join(root, "www");
if (fs.existsSync(www)) {
  const index = read("www/index.html");
  const webManifest = read("www/site.webmanifest");
  const worker = read("www/sw.js");
  need(index.includes("viewport-fit=cover"), "viewport-fit=cover missing from the built page");
  need(index.includes("apple-mobile-web-app-capable"), "Apple web app meta missing");
  need(index.includes('rel="manifest"'), "manifest link missing");
  need(webManifest.includes('"display": "standalone"'), "manifest is not standalone");
  need(webManifest.includes('"name": "JanaVignanam"'), "manifest name drifted");
  need(worker.includes('pathname.startsWith("/api")'), "service worker must ignore /api");
  need(!/NEON_DATABASE_URL|GROQ_API_KEY|ADMIN_PASSWORD|BEGIN (RSA |OPENSSH )?PRIVATE KEY/.test(index + webManifest + worker), "built web assets contain a secret marker");

  for (const icon of ["www/icon/icon-192.png", "www/icon/icon-512.png", "www/icon/icon-maskable-192.png", "www/icon/icon-maskable-512.png", "www/offline.html"]) {
    const file = path.join(root, icon);
    need(fs.existsSync(file) && fs.statSync(file).size > 0, `${icon} is missing or empty`);
  }

  const assets = fs.readdirSync(path.join(www, "assets")).filter((name) => name.endsWith(".js"));
  const bundle = assets.map((name) => fs.readFileSync(path.join(www, "assets", name), "utf8")).join("\n");
  need(bundle.includes("https://janavignanam-production.up.railway.app"), "bundle is not pointed at the verified Railway API");
  need(!bundle.includes("localhost:5000"), "bundle contains the developer API port");
} else {
  console.log("www/ is absent. Run npm run sync before the PWA asset checks.");
}

const secretNames = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "www", "vendor", ".git", "build"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(keystore|jks|env)$/i.test(entry.name)) secretNames.push(path.relative(root, full));
  }
}
walk(root);
need(secretNames.length === 0, `secret-like files present: ${secretNames.join(", ")}`);

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Capacitor, PWA, and secret checks passed.");
