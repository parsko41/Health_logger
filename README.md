# Health_logger

Small phone-first logging apps, served from GitHub Pages and saved to Google Drive by Apps Script.

## Mood Logger (`mood/`)

One screen with five rows: Horny, Happy, Anxiety, Depression and Self-esteem. Each row has four buttons, 1 to 4, and none is selected at the start. Submit stays disabled until all five rows have a score. Each submit adds one row to the Google Sheet `App_data/Mood_log`: timestamp, the five scores, and the app version.

### Setup (all doable on a phone)

1. **Pages:** in the repo settings, under **Pages**, choose to deploy from branch `main`, folder `/ (root)`.
2. **Backend:** open `https://parsko41.github.io/Health_logger/mood/setup.html` on your phone and follow the steps there.
   The page copies the backend code to the clipboard and opens a new Apps Script project. You paste the code, then deploy it as a web app (Execute as: Me, Who has access: Anyone).
3. **Connect:** open the web app URL and tap **Connect Mood Logger**.
   The app opens with the backend URL saved, so there's no code to edit and nothing to commit.
   You can also tap the version label in the app to paste the URL by hand.
4. **Install:** in Chrome, use **⋮ → Add to Home screen**.

The first submit creates the `App_data` folder and the `Mood_log` sheet. Later submits append to that sheet, so logging twice in one day gives two rows.

### Behaviour notes

- After a successful save, the page shows "Saved", then calls `window.close()`. Installed web apps on Android often ignore that call. When that happens, a "Logged" screen appears and you swipe the app away.
- If a save fails (for example, when offline), the entry is kept on the phone and sent the next time the app opens. That avoids losing the entry and also prevents duplicates.
- **Versioning:** with every change, bump `VERSION` in `index.html` and `CACHE` in `sw.js` together. The version appears in the top-right corner.
- If you edit `Code.gs`, use **Deploy → Manage deployments → Edit → New version**. That keeps the same URL.
