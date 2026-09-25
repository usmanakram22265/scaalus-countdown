"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { saveVisitor } from "@/lib/sheet";
import { cleanName, titleCase, validateName } from "@/lib/validateName";
import Countdown from "./Countdown";
import s from "./gate.module.css";

const STORAGE_KEY = "scaalus-visitor";

function load(): string | null {
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (v && typeof v.name === "string" && !validateName(v.name)) return v.name;
  } catch {}
  return null;
}

export default function Gate() {
  const [visitor, setVisitor] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameId = useId();
  const errId = useId();
  const titleId = useId();

  useEffect(() => {
    setVisitor(load());
    setReady(true);
  }, []);

  const locked = ready && !visitor;

  // Required popup: lock page scroll and keep focus in the input.
  useEffect(() => {
    if (!locked) return;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [locked]);

  const error = validateName(name);
  const showError = touched && name.length > 0 ? error : null;

  function submit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (error) return;
    const n = titleCase(cleanName(name));
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: n })); } catch {}
    saveVisitor(n);
    setLeaving(true);
    setTimeout(() => { setVisitor(n); setLeaving(false); }, 380);
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setVisitor(null);
    setName("");
    setTouched(false);
  }

  return (
    <>
      <div className={`${s.stage} ${visitor ? "" : s.blurred}`} aria-hidden={!visitor} inert={!visitor}>
        <Countdown key={visitor ?? "anon"} name={visitor ?? undefined} onReset={reset} />
      </div>

      {locked && (
        <div className={`${s.overlay} ${leaving ? s.leaving : ""}`}>
          <form
            className={s.card}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onSubmit={submit}
            noValidate
          >
            <h2 id={titleId} className={s.title}>Before we reveal…</h2>

            <label className={s.label} htmlFor={nameId}>What&apos;s your name?</label>
            <input
              ref={inputRef}
              id={nameId}
              className={`${s.input} ${showError ? s.invalid : ""}`}
              type="text"
              autoComplete="name"
              placeholder="Type your name here"
              maxLength={40}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={!!showError}
              aria-describedby={errId}
            />
            <p id={errId} className={s.error} aria-live="polite">{showError ?? " "}</p>

            <button className={s.button} type="submit" disabled={!!error}>
              Reveal the countdown
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
