# Android build

Toolchain used by GitHub Actions:

- Node.js 24
- Temurin 21
- Capacitor 8.5.3 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/app` 8.1.2)
- Android Gradle Plugin 8.13.0, Gradle 8.14.3, compile SDK 36, min SDK 24

A developer machine needs the same JDK 21 and Android SDK 36. JDK 25 is installed on the machine used for this work and is not what the workflow uses.

## Local commands

From this repository:

```sh
npm ci
npm run sync
npx cap sync android
node scripts/brand-android.mjs
node scripts/validate.mjs
```

`npm run sync` reads `frontend.revision`, fetches that commit of `https://github.com/NaiduBugata/janavignanam.git`, installs `client/` with `npm ci`, lints it, and builds it with:

```sh
VITE_API_BASE_URL=https://janavignanam-production.up.railway.app
VITE_CAPACITOR=true
```

To build the client you already have checked out, without fetching:

```sh
set FRONTEND_SRC=C:\path\to\janavignanam\client
npm run sync
```

The script will say the pin was not used. Do not set `FRONTEND_SRC` in Actions.

Debug APK, signed with the debug key:

```sh
cd android
gradlew.bat assembleDebug
```

The file is `android/app/build/outputs/apk/debug/app-debug.apk`.

Release APK, only when the keystore environment variables from [SECURITY.md](SECURITY.md) are set:

```sh
cd android
gradlew.bat assembleRelease
```

The file is `android/app/build/outputs/apk/release/app-release.apk`. Confirm the signature:

```sh
apksigner verify --print-certs app-release.apk
```

An Android App Bundle is optional and is not required for sideloading:

```sh
gradlew.bat bundleRelease
```

That writes an `.aab` under `android/app/build/outputs/bundle/release/`. Play Console is the usual consumer of an AAB. This project does not upload one.

## GitHub Actions

Actions, **Android APK**, run manually, variant `debug` or `release`. The release variant fails with a missing-secret error instead of uploading an unsigned file. See [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md).

## Version

`android/app/build.gradle` holds `versionName` and `versionCode`. Raise `versionCode` by one for every APK people should be able to install over the previous one. Keep `applicationId "app.janavignanam.mobile"`.
