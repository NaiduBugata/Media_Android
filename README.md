# JanaVignanam for Android and iPhone

Android is a Capacitor app. iPhone users install the existing website from Safari. Neither path uses the Play Store or the App Store.

The React application stays in [janavignanam](https://github.com/NaiduBugata/janavignanam). This repository wraps a pinned revision of `client/` and publishes the APK. It does not contain the NestJS API, the news pipeline, or a second copy of the interface.

```
Android APK  ->  https://janavignanam-production.up.railway.app  ->  Neon
iPhone PWA   ->  https://janavignanam-three.vercel.app           ->  same API  ->  Neon
```

`https://janavignanam.vercel.app` is a different site. This client is the one served at `https://janavignanam-three.vercel.app`.

## What is free

- Installing the APK from GitHub Releases. No Play Console fee.
- Adding the website to an iPhone home screen. No App Store fee.
- GitHub-hosted Actions minutes on a **public** repository, for standard runners. Checked against GitHub's billing docs on 13 Oct 2026. Private repositories on the Free plan include 2,000 minutes and 500 MB of artifact storage a month. Larger runners are billed even for public repositories. This project uses `ubuntu-latest` only, and it has no scheduled workflows.

## Start here

| Task | Document |
| --- | --- |
| How the pieces fit | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| API calls the app makes | [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md) |
| Which screens ship | [docs/FEATURE_MATRIX.md](docs/FEATURE_MATRIX.md) |
| Build an APK | [docs/ANDROID_BUILD.md](docs/ANDROID_BUILD.md) |
| Install the APK | [docs/APK_INSTALLATION.md](docs/APK_INSTALLATION.md) |
| Install on iPhone | [docs/IOS_PWA_INSTALLATION.md](docs/IOS_PWA_INSTALLATION.md) |
| Actions | [docs/GITHUB_ACTIONS.md](docs/GITHUB_ACTIONS.md) |
| Signing and tags | [docs/RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md) |
| Secrets | [docs/SECURITY.md](docs/SECURITY.md) |
| When something fails | [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) |

Application id: `app.janavignanam.mobile`. Do not change it after the first release people install.

The pinned web commit is `frontend.revision`. News collection, Groq analysis, scheduling, WhatsApp, and Neon stay on Railway.
