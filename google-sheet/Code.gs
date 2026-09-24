// Google Apps Script that saves each name from the countdown page as a new row in this sheet.
// Setup steps: see google-sheet/README.md.

const SHEET_NAME = "Visitors";
const HEADERS = ["Time", "Name", "Visitor time zone", "Page"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // one write at a time, so rows never overwrite each other
  try {
    const data = JSON.parse(e.postData.contents);
    const name = String(data.name || "").trim().slice(0, 40);
    // Same basic rule as the site: letters, spaces, apostrophes, hyphens and dots only.
    if (!name || !/^[A-Za-z .'-]+$/.test(name)) return reply({ ok: false });

    sheet().appendRow([
      new Date(),
      name,
      String(data.timezone || "").slice(0, 60),
      String(data.page || "").slice(0, 200),
    ]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

function sheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let s = book.getSheetByName(SHEET_NAME);
  if (!s) {
    s = book.insertSheet(SHEET_NAME);
    s.appendRow(HEADERS);
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
