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

export const viewport: Viewport = { themeColor: "#0D2847" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
