# Security

The APK and the PWA call the Railway HTTPS API. They do not receive `NEON_DATABASE_URL` or any other server secret. `VITE_API_BASE_URL` is a public origin and is visible inside the APK. That is expected.

## Never commit

- `server/.env` or `client/.env`
- Neon, Groq, admin, pipeline, WhatsApp, Resend, or SMTP secrets
- `*.keystore`, `*.jks`, and keystore passwords
- Apple signing material

`scripts/validate.mjs` fails the build if those markers show up in the Capacitor config or the built web files, and if a keystore is sitting in the tree.

## Android

- Application id `app.janavignanam.mobile`
- Cleartext traffic off, system trust anchors only
- `CapacitorHttp` so CORS is not opened up for `https://localhost`
- Release signing reads `ANDROID_KEYSTORE_PATH` and the passwords from the environment. Gradle does not contain a password.
- Debug APKs are signed with the Android debug key. They are not the release people should keep installed. An update must be signed with the same key as the app it replaces.

Back up the release keystore and its passwords outside git. Losing them means the next APK cannot update the installed app.

The keystore created for the first local release build is in the user profile on that PC: `%USERPROFILE%\.janavignanam\release.keystore`. The alias is `janavignanam`. The passwords are in `%USERPROFILE%\.janavignanam\signing.txt` beside it. Neither file is in this repository. Copy them into a password manager before relying on that PC. GitHub Actions needs these repository secrets, and only for the release workflows:

- `ANDROID_KEYSTORE_BASE64` — base64 of the keystore file, one line
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS` — `janavignanam` if you use the local backup created for this project
- `ANDROID_KEY_PASSWORD`

The workflow decodes the keystore into the runner temp directory and does not print the passwords. A tag push without those secrets fails before it creates a Release.

## Website

Helmet, validation, and the existing auth checks stay on the server. This work does not change CORS, the Railway Dockerfile, or the Neon schema.

The service worker caches the offline page and static assets with a network-first fetch. It returns immediately for `/api`, `/auth`, and `/webhook`. It does not precache the HTML shell, because Vite's hashed filenames change every publish.

## iPhone

The home-screen app is the website. It is not an IPA, it does not get a native push entitlement, and it does not run the pipeline in the background.
