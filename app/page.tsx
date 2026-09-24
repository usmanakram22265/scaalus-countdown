import Image from "next/image";
import Gate from "@/components/Gate";
import ThemeToggle from "@/components/ThemeToggle";
import s from "./page.module.css";

export default function Home() {
  return (
    <main className={s.page}>
      <div className={s.orb} aria-hidden />

      <header className={s.header}>
        <a href="https://scaalus.com" aria-label="Scaalus home">
          <Image className="logo-dark" src="/logo-white.png" alt="Scaalus" width={109} height={40} priority />
          <Image className="logo-light" src="/logo-color.webp" alt="Scaalus" width={104} height={40} />
        </a>
      </header>

      <section className={s.center}>
        <Gate />
      </section>

      <footer className={s.footer}>
        <span>A calendar full of booked jobs. Not a phone full of missed calls.</span>
        <a href="https://scaalus.com">scaalus.com</a>
      </footer>

      <ThemeToggle />
    </main>
  );
}
