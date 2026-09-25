"use client";

import { useEffect } from "react";
import s from "./theme.module.css";

type Theme = "dark" | "light";
const THEME_KEY = "scaalus-theme";

const current = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function saved(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

export default function ThemeToggle() {
  // Until the visitor picks one, keep following the device if it switches (e.g. auto dark at sunset).
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (!saved()) document.documentElement.dataset.theme = mq.matches ? "light" : "dark";
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  }

  // Which side is highlighted comes from CSS on [data-theme], so server and client HTML always match.
  return (
    <button type="button" className={s.toggle} onClick={toggle} aria-label="Switch between light and dark theme">
      <span className={s.thumb} aria-hidden />
      <span className={`${s.seg} ${s.light}`} aria-hidden>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
          <path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
        </svg>
        <span className={s.text}>Light</span>
      </span>
      <span className={`${s.seg} ${s.dark}`} aria-hidden>
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" fill="currentColor" />
        </svg>
        <span className={s.text}>Dark</span>
      </span>
    </button>
  );
}
