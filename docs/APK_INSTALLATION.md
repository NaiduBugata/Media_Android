# Install the Android APK

This is a sideload. It does not appear in the Play Store.

1. On the phone, open the [Media_Android releases](https://github.com/NaiduBugata/Media_Android/releases) page, or the debug artifact from the Android APK workflow.
2. Download `app-release.apk` for a release, or `app-debug.apk` if you are testing a debug build.
3. If Android blocks the download, allow the browser to install unknown apps. The wording is under Settings, Apps, the browser, Install unknown apps.
4. Open the file and install it. The name on the launcher is JanaVignanam.
5. Open the app. The first screen is sign-in. News and saved records load only when the phone can reach Railway.

A debug APK and a release APK do not share a signature. Android will refuse to install one over the other. Uninstall first if you are switching from debug to release.

## Update

1. Download the newer APK.
2. Open it and choose Update, or install it again.

The new file must use application id `app.janavignanam.mobile`, a higher `versionCode`, and the same release key as the installed app. Saved sign-in data stays in the app's storage across that update. Uninstalling clears it.

## Remove

Uninstall JanaVignanam from the Android app list. That deletes the local session. It does not delete server records.
