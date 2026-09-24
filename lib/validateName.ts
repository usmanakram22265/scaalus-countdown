// Client-side name filter: blocks keyboard mash, placeholders, numbers and profanity.

const PLACEHOLDERS = new Set([
  "test", "testing", "name", "myname", "asd", "asdf", "qwe", "qwerty", "abc", "abcd", "xyz",
  "admin", "user", "none", "null", "undefined", "anon", "anonymous", "idk", "nobody", "noname",
  "lol", "lmao", "haha", "hehe", "hi", "hello", "hey", "ok", "okay", "yes", "no", "blah", "bla",
  "fake", "random", "someone", "somebody", "me", "you", "who", "what", "nothing", "na", "nope",
]);

// Stored reversed so the source isn't a wall of slurs.
const rev = (w: string) => w.split("").reverse().join("");
// Blocked anywhere inside a word (no real names contain these).
const BLOCKED_ANYWHERE = ["kcuf", "hctib", "elohssa", "toggaf", "reggin", "aggin", "erohw", "drater"].map(rev);
// Blocked only as a whole word, so Hassan, Hancock, Dickens, Essex, Fagan still pass.
const BLOCKED_EXACT = new Set(
  ["tihs", "tnuc", "kcid", "ssa", "tsab", "gaf", "tuls", "sinep", "anigav", "nrop", "xes", "kcoc", "yssup", "drat"].map(rev),
);

const KEY_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890"];

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function hasKeyboardRun(word: string): boolean {
  for (const row of KEY_ROWS) {
    const back = rev(row);
    for (let i = 0; i + 4 <= row.length; i++) {
      if (word.includes(row.slice(i, i + 4)) || word.includes(back.slice(i, i + 4))) return true;
    }
  }
  return false;
}

export function cleanName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function titleCase(name: string): string {
  return name.replace(/(^|[\s\-'’])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

/** Returns an error message, or null when the name looks real. */
export function validateName(raw: string): string | null {
  const name = cleanName(raw);
  if (!name) return "Please tell us your name.";
  if (name.length < 2) return "That's a bit short. What's your full first name?";
  if (name.length > 40) return "That's a bit long. First and last name is plenty.";
  if (/\d/.test(name)) return "Names don't usually have numbers in them.";

  const words = name.split(" ");
  if (words.length > 4) return "Just your first and last name, please.";

  for (const word of words) {
    if (!/^\p{L}+(?:['’-]\p{L}+)*$/u.test(word)) return "Please use letters only.";

    const w = strip(word).replace(/['’-]/g, "");
    if (/(.)\1\1/u.test(w)) return "Hmm, that doesn't look like a real name.";
    if (PLACEHOLDERS.has(w)) return "We'd love your real name 🙂";
    if (BLOCKED_EXACT.has(w) || BLOCKED_ANYWHERE.some((b) => w.includes(b))) return "Let's keep it friendly. Please enter your real name.";

    // Latin-script-only heuristics; other scripts (Arabic, Urdu, CJK…) skip these.
    if (/^[a-z]+$/.test(w)) {
      if (!/[aeiouy]/.test(w)) return "Hmm, that doesn't look like a real name.";
      if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(w)) return "Hmm, that doesn't look like a real name.";
      if (/[aeiou]{4,}/.test(w)) return "Hmm, that doesn't look like a real name.";
      if (hasKeyboardRun(w)) return "Looks like keyboard mashing. What's your real name?";
      if (w.length >= 4 && /^(.{1,2})\1+$/.test(w)) return "Hmm, that doesn't look like a real name.";
    }
  }

  if (words.length > 1 && new Set(words.map(strip)).size === 1) return "Hmm, that doesn't look like a real name.";
  return null;
}
