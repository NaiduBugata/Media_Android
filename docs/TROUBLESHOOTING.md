# Troubleshooting

## The APK opens and then every request fails

The phone must reach `https://janavignanam-production.up.railway.app`. `localhost:5000` inside an APK is the phone itself. Rebuild with `npm run sync` so `VITE_API_BASE_URL` is the Railway origin. `scripts/validate.mjs` rejects a bundle that still contains port 5000.

## The website works and the APK gets a network error

The WebView origin is `https://localhost`. Server CORS does not list that origin, on purpose. `CapacitorHttp` is enabled so the call is native. If a new client starts using a request style the native adapter mishandles, fix that call. Do not turn off certificate checks and do not allow cleartext.

## Android says the app was not installed

The signatures differ, usually a debug APK on top of a release APK, or a new keystore. Uninstall, then install. After a public release, keep the original key.

## Update is blocked as an older package

`versionCode` in `android/app/build.gradle` was not increased.

## A direct `/news` link is blank inside the app

The APK uses hash routes (`/#/news`) because the packaged server has no SPA fallback. The public website still uses `/news`.

## Back closes the app instead of the article

The dialog close button is `aria-label="Close"`. The native back handler clicks that control first. A dialog without that button will fall through to history.

## iPhone has no Add to Home Screen

Use Safari, and the page has to be the HTTPS site above. The APK is not an iPhone package.

## Add to Home Screen works but offline does nothing

The live Vercel deploy registers the worker only after `mobile/pwa-shell` is merged and deployed. Until then the manifest is installed and the worker file exists, but the page does not register it.

## Release workflow failed immediately

One of `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, or `ANDROID_KEY_PASSWORD` is empty. That failure is intentional. No unsigned APK was published.

## `npm run sync` cannot fetch the SHA

`frontend.revision` must be a full 40-character commit that exists on `https://github.com/NaiduBugata/janavignanam.git`. A local-only commit cannot be fetched by Actions.

## Gradle asks for a newer Java

Use JDK 21 for this Capacitor 8 / AGP 8.13 project. The workflow installs Temurin 21.
