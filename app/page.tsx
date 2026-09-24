import Image from "next/image";
import Gate from "@/components/Gate";
import s from "./page.module.css";

export default function Home() {
  return (
    <main className={s.page}>
      <div className={s.orb} aria-hidden />
      <div className={s.orbInner} aria-hidden />

      <header className={s.header}>
        <Image src="/logo-white.png" alt="Scaalus" width={131} height={48} priority />
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
