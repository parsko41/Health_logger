// Mood Logger backend. Appends one row per submit to a Google Sheet in Drive/App_data.
// Deploy: Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.

const FOLDER_NAME = 'App_data';
const SHEET_NAME = 'Mood_log';
const FIELDS = ['Horny', 'Happy', 'Anxiety', 'Depression', 'Self-esteem'];
const HEADERS = ['Timestamp'].concat(FIELDS, ['App version']);

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const entry = JSON.parse(e.postData.contents);
    const values = FIELDS.map(function (f) {
      const n = Number(entry[f]);
      if (!(n >= 1 && n <= 4 && Math.floor(n) === n)) throw new Error('Bad value for ' + f);
      return n;
    });
    const ts = entry.ts ? new Date(Number(entry.ts)) : new Date();
    getSheet_().appendRow([ts].concat(values, [entry.version || '']));
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

// Quick check that the deployment is live: open the web app URL in a browser.
function doGet() {
  return json_({ ok: true, app: 'Mood Logger' });
}

function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id).getSheets()[0]; } catch (err) { /* deleted: recreate */ }
  }
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);
  const files = folder.getFilesByName(SHEET_NAME);
  const ss = files.hasNext()
    ? SpreadsheetApp.open(files.next())
    : createSheet_(folder);
  props.setProperty('SHEET_ID', ss.getId());
  return ss.getSheets()[0];
}

function createSheet_(folder) {
  const ss = SpreadsheetApp.create(SHEET_NAME);
  const sheet = ss.getSheets()[0];
  sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
  DriveApp.getFileById(ss.getId()).moveTo(folder);
  return ss;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
