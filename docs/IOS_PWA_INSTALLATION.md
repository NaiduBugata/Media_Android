# Install on iPhone

This is a Safari home-screen shortcut to the website. It is not an App Store app and it is not an IPA. An iPhone cannot install the Android APK.

The site is:

https://janavignanam-three.vercel.app

The service-worker registration is in the web client on branch `mobile/pwa-shell` (`2917d4007823040896800815d11f37defdda84f1`). Vercel production updates only after that branch is merged to `main` and Vercel finishes its existing deploy. Until then, the live site already has the manifest, icons, and Apple meta tags, and the worker file is present, but the page does not register the worker.

## Steps in Safari

1. Open https://janavignanam-three.vercel.app in Safari. Chrome on iOS uses the same WebKit install path; Safari is the one to use if Add to Home Screen is missing.
2. Tap the Share button.
3. Tap Add to Home Screen.
4. Leave the name as JanaVignanam and tap Add.
5. Open JanaVignanam from the home screen. It should open without Safari's address bar (`display: standalone`).

You need a network to sign in and to load news. If the phone is offline, the registered worker can show the offline page for a navigation. API responses are not kept for offline reading.

iOS will not give this install native push, background fetch of the news pipeline, or a listing in the App Store. Those need an Apple Developer Program build, which this zero-cost plan does not include.

## Update

The home-screen icon loads the website. A new Vercel deploy is the update. The worker waits until the next visit to take over, instead of swapping files underneath an open session.
