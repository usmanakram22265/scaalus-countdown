// Name filter for a mostly Pakistani audience typing names in Roman (English) letters.
// Any name is allowed unless a word is abusive or is very likely random typing (keyboard mash).

const words = (s: string) => s.trim().split(/\s+/);

/** Loose Roman-Urdu normalisation so Muhammad/Mohammad and Syed/Sayed compare equal. */
function norm(w: string): string {
  return w
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace(/ph/g, "f")
    .replace(/ee/g, "i")
    .replace(/oo|ou/g, "u")
    .replace(/(.)\1+/g, "$1")
    .replace(/([aeiou])h$/, "$1")
    .replace(/y$/, "i");
}

// Titles on their own don't count as a name.
const TITLES = new Set(
  words("mr mrs miss ms dr engr prof sahib advocate qari maulana mufti ch sahibzada nawabzada").map(norm),
);
// Prefixes skipped when choosing the name to greet by ("Syed Ali Raza" → "Ali").
const GREET_SKIP = new Set(
  words(
    "mr mrs miss ms dr engr prof sahib hafiz qari maulana mufti ch chaudhry chaudhary choudhry syed sayed sayyid " +
      "sheikh shaikh mian pir qazi rana raja malik mirza sardar nawab khawaja khwaja sahibzada nawabzada " +
      "muhammad mohammad mohammed muhammed mohamed mohd md",
  ).map(norm),
);

// Stored reversed so the source isn't a wall of abuse.
const rev = (w: string) => w.split("").reverse().join("");
// Blocked anywhere inside a word.
const BLOCKED_ANYWHERE = [
  "kcuf", "hctib", "elohssa", "toggaf", "reggin", "aggin", "erohw", "drater",
  "dohcneb", "dohcnehb", "dohcnahb", "dohcradam", "dohcredam", "ayituhc", "aituhc", "idsohb", "adazmarah", "rohkmarah",
  "irjnak", "ihtsag", "ayittuk",
].map(rev);
// Blocked only as a whole word, so names like Hassan, Hancock, Randhawa still pass.
const BLOCKED_EXACT = new Set(
  [
    "tihs", "tnuc", "kcid", "ssa", "tsab", "gaf", "tuls", "sinep", "anigav", "nrop", "xes", "kcoc", "yssup",
    "dnul", "nul", "iduhp", "iduf", "idnar", "dnaar", "udnag", "udnaag", "imarah", "rajnak", "ittuk", "raus",
    "ittat", "allad", "awrahb", "arjih", "arsuhk",
  ].map(rev),
);

const KEY_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

// Five keys in a row along one keyboard row ("asdfg", "poiuy"). No real name has one.
function hasKeyboardRun(w: string): boolean {
  return KEY_ROWS.some((row) => {
    const back = rev(row);
    for (let i = 0; i + 5 <= row.length; i++) {
      if (w.includes(row.slice(i, i + 5)) || w.includes(back.slice(i, i + 5))) return true;
    }
    return false;
  });
}

// Share of letter pairs that sit next to each other on a keyboard row ("sadfasd" → 4 of 6).
function neighbourKeyRatio(w: string): number {
  let hits = 0;
  for (let i = 0; i + 1 < w.length; i++) {
    const a = w[i], b = w[i + 1];
    if (KEY_ROWS.some((row) => {
      const x = row.indexOf(a), y = row.indexOf(b);
      return x >= 0 && y >= 0 && Math.abs(x - y) === 1;
    })) hits++;
  }
  return hits / Math.max(1, w.length - 1);
}

/** True only when a word is very likely random typing, so unusual real names still pass. */
function looksRandom(w: string): boolean {
  return (
    /(.)\1\1/.test(w) ||                                  // "aaa", "kkkk"
    (w.length >= 4 && !/[aeiouy]/.test(w)) ||             // "bcdfg"
    /[bcdfghjklmnpqrstvwxz]{5,}/.test(w) ||               // "rtkjlm"
    /[aeiou]{4,}/.test(w) ||                              // "aeiou"
    hasKeyboardRun(w) ||                                  // "qwert"
    (w.length >= 6 && neighbourKeyRatio(w) >= 0.8) ||     // "sdfsdfs"
    (w.length >= 6 && /^(.{1,3})\1{2,}$/.test(w))         // "hahaha", "abcabcabc"
  );
}

export function cleanName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function titleCase(name: string): string {
  return name.toLowerCase().replace(/(^|[\s\-'’])([a-z])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

/** The word to greet someone by: skips initials and titles ("Ch M Usman Akram" → "Usman"). */
export function greetingName(name: string): string {
  const parts = name.split(" ");
  return parts.find((p) => norm(p).length > 2 && !GREET_SKIP.has(norm(p))) ?? parts.find((p) => norm(p).length > 2) ?? parts[0];
}

const NOT_REAL = "That doesn't look like a real name. Please try again.";

/** Returns an error message, or null when the name looks real. */
export function validateName(raw: string): string | null {
  const name = cleanName(raw);
  if (!name) return "Please tell us your name.";
  if (name.length < 2) return "That's a bit short. What's your full name?";
  if (name.length > 40) return "That's a bit long. First and last name is plenty.";
  if (/\d/.test(name)) return "Names don't have numbers in them.";
  if (/[^\x00-\x7F]/.test(name)) return "Please type your name in English letters, e.g. Usman Akram.";

  const parts = name.split(" ");
  if (parts.length > 5) return "Just your first and last name, please.";

  let realWords = 0;
  for (const word of parts) {
    if (!/^[A-Za-z]+(?:['-][A-Za-z]+)*\.?$/.test(word)) return "Please use letters only.";

    const w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (BLOCKED_EXACT.has(w) || BLOCKED_ANYWHERE.some((b) => w.includes(b))) {
      return "Let's keep it friendly. Please enter your real name.";
    }
    if (looksRandom(w)) return NOT_REAL;
    if (w.length > 2 && !TITLES.has(norm(word))) realWords++;
  }

  if (realWords === 0) {
    return parts.some((p) => TITLES.has(norm(p)))
      ? "Please add your name after the title."
      : "That's a bit short. What's your full name?";
  }
  if (parts.length > 1 && new Set(parts.map(norm)).size === 1) return NOT_REAL;
  return null;
}
