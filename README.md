# Health_logger

Small phone-first logging apps, served from GitHub Pages and saved to Google Drive by Apps Script.

## Mood Logger (`mood/`)

One screen with five rows: Horny, Happy, Anxiety, Depression and Self-esteem. Each row has four buttons, 1 to 4, and none is selected at the start. Submit stays disabled until all five rows have a score. Each submit adds one row to the Google Sheet `App_data/Mood_log`: timestamp, the five scores, and the app version.

### Setup

1. **Backend:** create a new project at https://script.google.com and paste in `apps_script/Code.gs`.
   Go to **Deploy → New deployment → Web app**, set *Execute as: Me* and *Who has access: Anyone*, then authorize it.
   Copy the web app URL. Opening it in a browser should show `{"ok":true,...}`.
2. **Frontend:** in `mood/index.html`, replace `PASTE_APPS_SCRIPT_URL_HERE` with that URL. Commit and push.
3. **Pages:** in the repo settings, under **Pages**, choose to deploy from branch `main`, folder `/ (root)`.
   The app will be at `https://parsko41.github.io/Health_logger/mood/`.
4. **Install:** open that URL in Chrome on Android, then use **⋮ → Add to Home screen / Install app**.

The first submit creates the `App_data` folder and the `Mood_log` sheet. Later submits append to that sheet, so logging twice in one day gives two rows.

### Behaviour notes

- After a successful save, the page shows "Saved", then calls `window.close()`. Installed web apps on Android often ignore that call. When that happens, a "Logged" screen appears and you swipe the app away.
- If a save fails (for example, when offline), the entry is kept on the phone and sent the next time the app opens. That avoids losing the entry and also prevents duplicates.
- **Versioning:** with every change, bump `VERSION` in `index.html` and `CACHE` in `sw.js` together. The version appears in the top-right corner.
- If you edit `Code.gs`, use **Deploy → Manage deployments → Edit → New version**. That keeps the same URL.
