// Name filter for a mostly Pakistani audience typing names in Roman (English) letters.
// A name must contain at least one recognised name word (spelling variants allowed),
// and may contain at most one unrecognised word (for rarer surnames).

import { COMMON_WORDS, NAMES } from "./names";

const words = (s: string) => s.trim().split(/\s+/);

/** Loose Roman-Urdu normalisation so Muhammad/Mohammad, Sameer/Samir, Aly/Ali line up. */
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
const skeleton = (w: string) => w.replace(/[aeiou]/g, "");

const KNOWN = new Set(words(NAMES).map(norm));
const KNOWN_LIST = [...KNOWN];
const COMMON = new Set(words(COMMON_WORDS).map(norm));

// Titles on their own don't count as a name.
const TITLES = new Set(
  words("mr mrs miss ms dr engr prof sahib advocate hafiz qari maulana mufti ch sahibzada nawabzada").map(norm),
);
// Prefixes skipped when choosing the name to greet by ("Syed Ali Raza" → "Ali").
const GREET_SKIP = new Set(
  words(
    "mr mrs miss ms dr engr prof sahib hafiz qari maulana mufti ch chaudhry chaudhary choudhry syed sayed sayyid " +
      "sheikh shaikh mian pir qazi rana raja malik mirza sardar nawab khawaja khwaja sahibzada nawabzada " +
      "muhammad mohammad mohammed muhammed mohamed mohd md",
  ).map(norm),
);

function lev(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, cur[j]);
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** Known name, allowing vowel-spelling variants (Usman/Osman) and, for longer names, one typo. */
function isKnown(n: string): boolean {
  if (KNOWN.has(n)) return true;
  if (n.length < 4) return false;
  const sk = skeleton(n);
  return KNOWN_LIST.some(
    (k) => (skeleton(k) === sk && lev(n, k, 2) <= 2) || (n.length >= 6 && lev(n, k, 1) <= 1),
  );
}

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

function hasKeyboardRun(w: string): boolean {
  return KEY_ROWS.some((row) => {
    const back = rev(row);
    for (let i = 0; i + 4 <= row.length; i++) {
      if (w.includes(row.slice(i, i + 4)) || w.includes(back.slice(i, i + 4))) return true;
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

function looksLikeMash(w: string): boolean {
  return (
    /(.)\1\1/.test(w) ||
    !/[aeiouy]/.test(w) ||
    /[bcdfghjklmnpqrstvwxz]{5,}/.test(w) ||
    /[aeiou]{4,}/.test(w) ||
    hasKeyboardRun(w) ||
    (w.length >= 5 && neighbourKeyRatio(w) >= 0.6) ||
    (w.length >= 4 && /^(.{1,2})\1+$/.test(w))
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

const NOT_REAL = "Please enter your real name, e.g. Ali Khan.";

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

  let knownNames = 0;
  let unknown = 0;
  for (const word of parts) {
    if (!/^[A-Za-z]+(?:['-][A-Za-z]+)*\.?$/.test(word)) return "Please use letters only.";

    const w = word.toLowerCase().replace(/[^a-z]/g, "");
    const n = norm(word);

    if (BLOCKED_EXACT.has(w) || BLOCKED_ANYWHERE.some((b) => w.includes(b))) {
      return "Let's keep it friendly. Please enter your real name.";
    }
    // Initials like "M" or "Ch" are fine inside a longer name.
    if (parts.length > 1 && w.length <= 2) continue;
    if (COMMON.has(n) && !KNOWN.has(n)) return NOT_REAL;
    if (looksLikeMash(w)) return "That doesn't look like a real name. Please try again.";

    if (isKnown(n)) {
      if (!TITLES.has(n)) knownNames++;
    } else {
      unknown++;
    }
  }

  if (knownNames === 0) {
    return parts.length === 1 && TITLES.has(norm(parts[0]))
      ? "Please add your name after the title."
      : "We don't recognise that name. " + NOT_REAL;
  }
  if (unknown > 1) return "We don't recognise some of those words. " + NOT_REAL;
  if (parts.length > 1 && new Set(parts.map(norm)).size === 1) return NOT_REAL;
  return null;
}
