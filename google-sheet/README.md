# Collect visitor names in a Google Sheet

Each time someone enters their name on the countdown page, a new row is added to your sheet:
**Time · Name · Visitor time zone · Page**.

This takes about 5 minutes, and you only do it once.

## 1. Create the sheet and add the script

1. Go to [sheets.new](https://sheets.new) to create a new Google Sheet. Name it something like "Scaalus visitors".
2. In the menu, click **Extensions → Apps Script**.
3. Delete the code that's already there, then paste in everything from [`Code.gs`](./Code.gs).
4. Click the **Save** icon (💾).

## 2. Publish it as a web app

1. Click **Deploy → New deployment** (top right).
2. Click the ⚙️ gear next to "Select type" and choose **Web app**.
3. Set these options:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**. Google asks you to authorise the script:
   **Authorize access → pick your account → Advanced → Go to (project name) (unsafe) → Allow**.
   The "unsafe" warning only appears because you wrote the script yourself and Google hasn't reviewed it.
5. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy.../exec`.

"Anyone" only means anyone can *send* a name to the script. Only you can see the sheet.

## 3. Connect the site

1. Open `lib/sheet.ts` and paste the URL between the quotes:
   ```ts
   export const SHEET_URL = "https://script.google.com/macros/s/AKfy.../exec";
   ```
2. Commit and push, then redeploy the site.

## 4. Test it

Open your web app URL (the one ending in `/exec`) in a normal browser tab. You should see something like:

```json
{"ok":true,"message":"Script is working. Names are saved in the sheet below.","sheet":"https://docs.google.com/spreadsheets/d/.../edit#gid=...","rows":0}
```

Open the `sheet` link to see the names. If you get a Google sign-in page or "Page not found" instead,
the deployment isn't set to **Who has access: Anyone** (see step 2). If you get `"ok":false`, the
`error` text says what went wrong.

Then test the site itself:

Open the site in a private/incognito window and enter a name. Within a few seconds a new row should
appear in the **Visitors** tab of the sheet.

## Good to know

- Each browser sends a name only once, when the name is entered. Refreshing the page doesn't send it
  again. If someone clicks "Not Usman?" and enters a different name, the new name is added as a new row.
- If you edit `Code.gs` later, go to **Deploy → Manage deployments → ✏️ Edit → Version: New version →
  Deploy**. This keeps the same URL, so you don't need to change the site.
- The URL isn't a password. Anyone who looks at the site's code can see it and could send fake rows.
  For a countdown page that's usually fine. If spam ever shows up, you can delete those rows in the sheet.
