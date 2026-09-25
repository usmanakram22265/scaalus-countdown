"use client";

import { useEffect, useState } from "react";
import { greetingName } from "@/lib/validateName";
import s from "./gate.module.css";

// Launch: 10 October 2026, midnight US Eastern (15 days from 25 Sep 2026).
const TARGET = Date.parse("2026-10-10T00:00:00-04:00");

function parts(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(t / 86400),
    hours: Math.floor((t % 86400) / 3600),
    minutes: Math.floor((t % 3600) / 60),
    seconds: t % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ name, onReset }: { name?: string; onReset?: () => void }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    // Align ticks to the wall-clock second so digits flip together.
    let id: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      setNow(Date.now());
      id = setInterval(() => setNow(Date.now()), 1000);
    }, 1000 - (Date.now() % 1000));
    return () => { clearTimeout(start); clearInterval(id); };
  }, []);

  const remaining = now === null ? null : TARGET - now;
  const live = remaining !== null && remaining <= 0;
  const p = remaining === null ? null : parts(remaining);
  // Greet by the first real name, skipping initials and titles ("Syed Ali Raza" → "Ali").
  const first = name ? greetingName(name) : undefined;

  const units: [string, number | undefined][] = [
    ["Days", p?.days],
    ["Hours", p?.hours],
    ["Minutes", p?.minutes],
    ["Seconds", p?.seconds],
  ];

  return (
    <div className={s.reveal}>
      <p className={s.hello}>{first ? <>Hey {first} 👋</> : " "}</p>
      {live ? (
        <>
          <h1 className={s.bigTitle}>We&apos;re <span className={s.hl}>live.</span></h1>
          <p className={s.lead}>Scaalus is here. Come and see what&apos;s new.</p>
          <a className={s.cta} href="https://scaalus.com">Visit scaalus.com</a>
        </>
      ) : (
        <>
          <span className={s.eyebrow}>Launching soon</span>
          <h1 className={s.bigTitle}>Something big is <span className={s.hl}>almost here.</span></h1>
          <div className={s.tiles} role="timer" aria-live="off" aria-label="Time until launch">
            {units.map(([label, value]) => (
              <div className={s.tile} key={label}>
                <span className={s.num}>
                  <span key={value ?? "x"} className={s.digit}>
                    {value === undefined ? "--" : label === "Days" ? value : pad(value)}
                  </span>
                </span>
                <span className={s.unit}>{label}</span>
              </div>
            ))}
          </div>
          <p className={s.lead}>
            {first ? <>You&apos;re on the list, {first}. See you on launch day.</> : " "}
          </p>
        </>
      )}
      {first && onReset && (
        <button type="button" className={s.linkBtn} onClick={onReset}>Not {first}?</button>
      )}
    </div>
  );
}
