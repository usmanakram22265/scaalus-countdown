import Image from "next/image";
import Gate from "@/components/Gate";
import ThemeToggle from "@/components/ThemeToggle";
import type { CSSProperties } from "react";
import s from "./page.module.css";

// Dark theme background: "booked job" chips that appear and fade in a faint calendar grid of 76px cells.
// c = column offset from the centre, r = row, w = width in cells, d = seconds into the loop, t = booking time.
// Desktop and phone get separate sets, placed only where the (vertically centred) content never reaches:
// the side columns and the gap under the header.
type Booking = { c: number; r: number; w?: number; d: number; t: string };
const DESKTOP: Booking[] = [
  { c: -7, r: 2, d: 0, t: "9:00 AM" },
  { c: -7, r: 4, d: 3.4, t: "10:30 AM" },
  { c: -7, r: 6, d: 6.8, t: "2:15 PM" },
  { c: 6, r: 2, d: 5.1, t: "8:30 AM" },
  { c: 7, r: 3, d: 8.5, t: "11:00 AM" },
  { c: 7, r: 5, d: 2.6, t: "1:30 PM" },
  { c: 7, r: 7, d: 7.2, t: "3:45 PM" },
  { c: -6, r: 1, d: 1.7, t: "4:00 PM" },
  { c: -3, r: 1, d: 4.3, t: "9:30 AM" },
  { c: 2, r: 1, w: 2, d: 9.1, t: "12:00 PM" },
];
const PHONE: Booking[] = [
  { c: -1, r: 1, d: 0.6, t: "9:00 AM" },
  { c: 1, r: 1, d: 5.4, t: "11:30 AM" },
];

function Chip({ b, only }: { b: Booking; only: string }) {
  const style = { "--c": b.c, "--r": b.r, "--w": b.w ?? 1, animationDelay: `-${b.d}s` } as CSSProperties;
  return (
    <span className={`${s.booking} ${only}`} style={style}>
      <b>Booked</b>
      <i>{b.t}</i>
    </span>
  );
}

export default function Home() {
  return (
    <main className={s.page}>
      <div className={s.backdrop} aria-hidden>
        <div className={s.calendar}>
          {DESKTOP.map((b, i) => <Chip key={`d${i}`} b={b} only={s.desktop} />)}
          {PHONE.map((b, i) => <Chip key={`p${i}`} b={b} only={s.phone} />)}
        </div>
      </div>

      <header className={s.header}>
        <a href="https://scaalus.com" aria-label="Scaalus home">
          <Image className="logo-dark" src="/logo-white.png" alt="Scaalus" width={109} height={40} priority />
          <Image className="logo-light" src="/logo-color.webp" alt="Scaalus" width={104} height={40} />
        </a>
        <ThemeToggle />
      </header>

      <section className={s.center}>
        <Gate />
      </section>

      <footer className={s.footer}>
        <span>A calendar full of booked jobs. Not a phone full of missed calls.</span>
        <a href="https://scaalus.com">scaalus.com</a>
      </footer>
    </main>
  );
}
