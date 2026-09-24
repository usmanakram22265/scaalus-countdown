// Google Apps Script that saves each name from the countdown page as a new row in a Google Sheet.
// Setup steps: see google-sheet/README.md.
// Open the web app URL in a browser to check it works and get a link to the sheet.

const SHEET_NAME = "Visitors";
const HEADERS = ["Time", "Name", "Visitor time zone", "Page"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // one write at a time, so rows never overwrite each other
  try {
    const data = JSON.parse(e.postData.contents);
    const name = String(data.name || "").trim().slice(0, 40);
    // Same basic rule as the site: letters, spaces, apostrophes, hyphens and dots only.
    if (!name || !/^[A-Za-z .'-]+$/.test(name)) return reply({ ok: false, error: "invalid name" });

    sheet().appendRow([
      new Date(),
      name,
      String(data.timezone || "").slice(0, 60),
      String(data.page || "").slice(0, 200),
    ]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the URL in a browser shows whether the script works and where the names are saved.
function doGet() {
  try {
    const s = sheet();
    return reply({
      ok: true,
      message: "Script is working. Names are saved in the sheet below.",
      sheet: s.getParent().getUrl() + "#gid=" + s.getSheetId(),
      rows: Math.max(0, s.getLastRow() - 1),
    });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

// Uses the spreadsheet the script is attached to. If the script was created on its own
// (not from Extensions → Apps Script), it creates a "Scaalus visitors" spreadsheet once and reuses it.
function book() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty("SPREADSHEET_ID");
  if (id) return SpreadsheetApp.openById(id);
  const created = SpreadsheetApp.create("Scaalus visitors");
  props.setProperty("SPREADSHEET_ID", created.getId());
  return created;
}

function sheet() {
  const b = book();
  let s = b.getSheetByName(SHEET_NAME);
  if (!s) {
    s = b.insertSheet(SHEET_NAME);
    s.appendRow(HEADERS);
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
