# API integration

Base URL baked into the APK:

`https://janavignanam-production.up.railway.app`

Local web development is unchanged. An empty `VITE_API_BASE_URL` makes the client call `/api`, and Vite proxies that to `http://127.0.0.1:5000`. The APK never uses that proxy. Paths are prefixed once: `newsApiBase()` appends `/api` when the origin does not already end in `/api`, and callers request `/news` or `/api/workspace/login`.

The installed phone app calls only `GET /api/news`. That response is the article list already stored in Neon. The phone does not sign in, save records, start the news pipeline, or send WhatsApp. Search on the phone filters that downloaded list. Reload repeats the same read.

The website still uses the wider client. These are the calls that client can make:

| Client use | Method and path | Auth |
| --- | --- | --- |
| Sign in | `POST /api/workspace/login` | none |
| Create account | `POST /api/workspace/register` | none |
| Command center | `GET /api/workspace/summary` | Bearer token |
| Saved records | `GET /api/workspace/records?section=` | Bearer token |
| Add a record | `POST /api/workspace/records` | Bearer token |
| News list | `GET /api/news` | none |
| News totals | `GET /api/news/stats` | none |
| Channel panel | `GET /api/notifications/status` | none |
| Settings panel | `GET /api/health` | none |

There is no separate article-detail route. `GET /api/news` returns the articles, and the screen opens one in a dialog. Search, source, sentiment, and assembly-segment filters run in the browser on that list. The server still decides `assembly_segment`. The client does not invent an eighth segment. The seven names are Pedakurapadu, Chilakaluripet, Narasaraopet, Sattenapalle, Vinukonda, Gurazala, and Macherla.

The session is a Bearer token in `localStorage` under `janavignanam.session`. It is not a cookie. Logout removes that key.

Admin, pipeline, report-send, upload, birthday, and visit-admin routes are not linked from the mobile shell. Do not add them for ordinary installs.

The WhatsApp chatbot is an inbound webhook on the server (`/webhook`). The website has no chatbot screen, so the APK does not add one.

`GET /api/health` and `GET /api/news/stats` were read on 13 Oct 2026. Health was ok. Stats reported a live article total. No pipeline run was started.

If Railway is down, the shell still opens. Sign-in and news show the existing error text, and the news screen keeps its retry button. The service worker on the website does not cache `/api`.
