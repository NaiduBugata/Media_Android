import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const android = path.join(root, "android");
if (!fs.existsSync(android)) {
  console.log("android/ is not generated yet. Skipping branding.");
  process.exit(0);
}

const icon = path.join(root, "www", "icon", "icon-512.png");
const drawable = path.join(android, "app", "src", "main", "res", "drawable");
fs.mkdirSync(drawable, { recursive: true });
if (fs.existsSync(icon)) {
  fs.copyFileSync(icon, path.join(drawable, "ic_brand.png"));
}

const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/brand_navy"/>
    <foreground android:drawable="@drawable/ic_brand"/>
</adaptive-icon>
`;
const anydpi = path.join(android, "app", "src", "main", "res", "mipmap-anydpi-v26");
fs.mkdirSync(anydpi, { recursive: true });
fs.writeFileSync(path.join(anydpi, "ic_launcher.xml"), adaptive);
fs.writeFileSync(path.join(anydpi, "ic_launcher_round.xml"), adaptive);

for (const density of ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"]) {
  const dir = path.join(android, "app", "src", "main", "res", `mipmap-${density}`);
  if (!fs.existsSync(dir) || !fs.existsSync(icon)) continue;
  fs.copyFileSync(icon, path.join(dir, "ic_launcher.png"));
  fs.copyFileSync(icon, path.join(dir, "ic_launcher_round.png"));
  fs.copyFileSync(icon, path.join(dir, "ic_launcher_foreground.png"));
}

const colorsPath = path.join(android, "app", "src", "main", "res", "values", "colors.xml");
if (!fs.existsSync(colorsPath)) {
  fs.writeFileSync(
    colorsPath,
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#293B5F</color>
    <color name="colorPrimaryDark">#1C2942</color>
    <color name="colorAccent">#C4A35A</color>
    <color name="brand_navy">#293B5F</color>
    <color name="brand_background">#FAF9F7</color>
</resources>
`,
  );
}

const xmlDir = path.join(android, "app", "src", "main", "res", "xml");
fs.mkdirSync(xmlDir, { recursive: true });
fs.writeFileSync(
  path.join(xmlDir, "network_security_config.xml"),
  `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
`,
);

const manifestPath = path.join(android, "app", "src", "main", "AndroidManifest.xml");
let manifest = fs.readFileSync(manifestPath, "utf8");
if (!manifest.includes("android.permission.INTERNET")) {
  manifest = manifest.replace("<application", '<uses-permission android:name="android.permission.INTERNET" />\n    <application');
}
manifest = manifest.replace(/android:allowBackup="true"/, 'android:allowBackup="false"');
if (!manifest.includes("usesCleartextTraffic")) {
  manifest = manifest.replace("<application", '<application android:usesCleartextTraffic="false" android:networkSecurityConfig="@xml/network_security_config"');
}
if (!manifest.includes("windowSoftInputMode")) {
  manifest = manifest.replace("android:exported=\"true\"", 'android:exported="true" android:windowSoftInputMode="adjustResize"');
}
fs.writeFileSync(manifestPath, manifest);

const gradlePath = path.join(android, "app", "build.gradle");
let gradle = fs.readFileSync(gradlePath, "utf8");
gradle = gradle.replace('applicationId "com.getcapacitor.app"', 'applicationId "app.janavignanam.mobile"');
gradle = gradle.replace('namespace "com.getcapacitor.myapp"', 'namespace "app.janavignanam.mobile"');
gradle = gradle.replace('versionName "1.0"', 'versionName "1.0.0"');
if (!gradle.includes("signingConfigs")) {
  gradle = gradle.replace(
    "buildTypes {",
    `signingConfigs {
        release {
            def storePath = System.getenv("ANDROID_KEYSTORE_PATH")
            if (storePath) {
                storeFile file(storePath)
                storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
                keyAlias System.getenv("ANDROID_KEY_ALIAS")
                keyPassword System.getenv("ANDROID_KEY_PASSWORD")
            }
        }
    }
    buildTypes {`,
  );
  gradle = gradle.replace(
    "release {\n            minifyEnabled false",
    `release {
            minifyEnabled false
            def storePath = System.getenv("ANDROID_KEYSTORE_PATH")
            if (storePath) {
                signingConfig signingConfigs.release
            }`,
  );
}
fs.writeFileSync(gradlePath, gradle);

const stylesPath = path.join(android, "app", "src", "main", "res", "values", "styles.xml");
if (fs.existsSync(stylesPath)) {
  let styles = fs.readFileSync(stylesPath, "utf8");
  if (!styles.includes("windowSplashScreenBackground")) {
    styles = styles.replace(
      /<style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">[\s\S]*?<\/style>/,
      `<style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
        <item name="windowSplashScreenBackground">@color/brand_navy</item>
        <item name="windowSplashScreenAnimatedIcon">@drawable/ic_brand</item>
        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>
    </style>`,
    );
  }
  fs.writeFileSync(stylesPath, styles);
}

console.log("Android branding applied.");
