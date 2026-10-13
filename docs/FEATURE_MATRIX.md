# Feature matrix

The Android package and the iPhone home-screen app use the same screens. Nothing below was removed to make packaging easier.

| Feature | In the client | Mobile behavior |
| --- | --- | --- |
| Sign in and register | `App.tsx` | Needs the API. Token stays on the device. |
| Command center counts | `/` | Needs the API. |
| Grievances, projects, people, campaigns | saved workspace records | Needs the API. |
| News list, search, filters, sentiment, segments | `/news` | List comes from `GET /api/news`. Filters stay on the device. |
| Article dialog and original link | news modal | Original links open with `target="_blank"`. |
| Problems, analytics, departments, profile | under `/news/...` | Same routes. Charts use Recharts. |
| Loading, empty, and retry | existing news states | Unchanged. |
| Admin desk | `/@admin` | Still reachable by URL. Not added to the phone navigation. |
| Telugu text | Noto Sans Telugu plus the existing news font stack | Loaded from Google Fonts, so the first paint of Telugu needs a network. |
| WhatsApp chatbot | server webhook only | Not a screen in the app. |
| Offline shell | website service worker | Website only. The APK does not register the worker. Without a network the website can show `offline.html`. The APK opens its bundled shell and then fails the API calls. |
| Push notifications | not implemented | The worker file still has a push listener from before. Nothing subscribes the phone to push. |

Safe areas are padding on the login screen, the side menu, and the sticky headers. The Android activity uses `adjustResize` for the keyboard.
