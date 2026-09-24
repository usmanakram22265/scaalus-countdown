// Sends each new visitor name to the Google Sheet. Setup: google-sheet/README.md.
// Paste your Apps Script "Web app URL" here (it ends in /exec). Leave empty to turn saving off.
export const SHEET_URL = "";

export function saveVisitor(name: string): void {
  if (!SHEET_URL) return;
  let timezone = "";
  try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch {}
  // text/plain + no-cors avoids the CORS preflight Apps Script can't answer; we don't need the reply.
  fetch(SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ name, timezone, page: location.href }),
    keepalive: true,
  }).catch(() => {});
}
