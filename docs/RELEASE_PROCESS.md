# Release process

## Keep the key

Generate the release keystore once, on a machine you control, outside this repository:

```sh
keytool -genkeypair -v -keystore release.keystore -alias janavignanam -keyalg RSA -keysize 2048 -validity 10000
```

Store the file and both passwords in a password manager or an encrypted backup. Git ignores `*.keystore`. The next update has to be signed with this same key.

Create the GitHub secret value without printing the file:

```sh
base64 -w 0 release.keystore
```

On Windows, `certutil` or PowerShell can encode it. Put the result in `ANDROID_KEYSTORE_BASE64`. Set `ANDROID_KEY_ALIAS` to `janavignanam` and set the two password secrets. See [SECURITY.md](SECURITY.md).

## Ship

1. Move `frontend.revision` to the janavignanam commit you intend to package. That commit has to be on GitHub. `main` of the website does not have to move for an APK, but iPhone users only see client changes after Vercel deploys them.
2. Raise `versionCode` in `android/app/build.gradle` if anyone already installed the previous APK. Set `versionName` to the same number you tag.
3. Merge to `main` here.
4. Tag and push:

```sh
git tag v1.0.0
git push origin v1.0.0
```

5. The Signed release APK workflow verifies the signature and attaches `app-release.apk` to the GitHub Release. If a secret is missing, the workflow fails and does not publish an unsigned file.
6. Send people the release URL. Installation steps are in [APK_INSTALLATION.md](APK_INSTALLATION.md).

## Website deploy

PWA changes belong to `client/` in `NaiduBugata/janavignanam`. They are on branch `mobile/pwa-shell`. Merging that branch to `main` is the existing Vercel deploy. Railway is configured to redeploy when `main` moves, even for a client-only commit, because its watch paths are empty. Merge it when a short API restart is acceptable. `PIPELINE_CATCHUP_ON_START` and `REPORT_CATCHUP_ON_START` stay false, so that restart should not send mail or WhatsApp.

Do not point Vercel at this mobile repository.
