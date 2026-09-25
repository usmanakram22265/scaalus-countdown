import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scaalus.com"),
  title: "Scaalus: Launching Soon",
  description: "A calendar full of booked jobs. Not a phone full of missed calls. Scaalus launches soon.",
  openGraph: {
    title: "Scaalus: Launching Soon",
    description: "A calendar full of booked jobs. Not a phone full of missed calls.",
    url: "https://scaalus.com",
    siteName: "Scaalus",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#081426" },
    { media: "(prefers-color-scheme: light)", color: "#EDF1F7" },
  ],
};

// Runs before paint: a saved choice wins, otherwise follow the device theme. No flash either way.
const themeScript = `(function(){var t;try{t=localStorage.getItem("scaalus-theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
