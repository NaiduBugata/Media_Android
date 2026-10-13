# Architecture

## Selected shape

The website and the API already exist. This repository adds an Android shell around the same Vite build and leaves iPhone distribution to the Progressive Web App on Vercel.

| Piece | Where it lives | Role |
| --- | --- | --- |
| React 19, Router 7, Vite 8, Tailwind 4 | `client/` in `NaiduBugata/janavignanam` | The only user interface |
| NestJS 11 API, pipeline, Neon | `server/` in that same repo, hosted on Railway | Data, auth, news, WhatsApp |
| Capacitor 8 Android project | this repo, `android/` | Packages `www/` into an APK |
| PWA manifest and service worker | `client/public/` | Safari home-screen install |

`frontend.revision` is the full git SHA that `scripts/sync-frontend.mjs` fetches. GitHub Actions uses that SHA. A developer machine may set `FRONTEND_SRC` to a local `client/` directory, and the script prints that the pin was not used. Actions never sets `FRONTEND_SRC`.

The APK contains the compiled HTML, CSS, and JavaScript. Opening the app does not require Vercel to be up. News, sign-in, and saved records still require the Railway API.

## Verified production hosts

Checked on 13 Oct 2026:

- Website HTML at `https://janavignanam-three.vercel.app` matches this client's `index.html`.
- `GET https://janavignanam-production.up.railway.app/api/health` returned `{"status":"ok","mongo":true}`. The `mongo` field means Neon answered. The API does not use MongoDB as its database.
- `https://mediasphere-api.up.railway.app` returned 404 and is not the API.
- `https://janavignanam.vercel.app` is a different frontend.

The mobile build sets `VITE_API_BASE_URL` to the Railway origin and `VITE_CAPACITOR=true`. The Vercel project keeps its own `VITE_API_BASE_URL` and does not set `VITE_CAPACITOR`.

## Routing

Vercel and local `npm run dev` use `BrowserRouter`. The APK uses `HashRouter` because the Android WebView serves files from `https://localhost` and does not rewrite `/news` to `index.html`. Web URLs such as `/news` are unchanged.

## Networking

Capacitor's native HTTP adapter is enabled in `capacitor.config.ts`. Axios and `fetch` then leave the WebView, so the app can call Railway without adding `https://localhost` to `CORS_ORIGINS`. Certificate checks stay on. Cleartext HTTP is disabled.

## What this repo does not do

- It does not connect to Neon.
- It does not run the news pipeline or send WhatsApp.
- It does not replace the Vercel site.
- It does not produce an iPhone IPA. A normal iPhone cannot install an APK, and a public IPA still needs Apple signing.

## Compatibility

- React 19.2, React Router 7, Vite 8.3, and Tailwind CSS 4 stayed in place. The production web build completed with Vite 8.3.
- Capacitor 8.5.3 consumes the Vite `dist/` directory. It does not import Vite.
- The web production bundle does not include `@capacitor/app`. That import is compiled only when `VITE_CAPACITOR=true`.
- Android Gradle is the Capacitor 8 template: Android Gradle Plugin 8.13.0, Gradle 8.14.3, compile SDK 36, min SDK 24. CI uses Temurin 21. The local machine's JDK 25 is not the version the workflow uses.
