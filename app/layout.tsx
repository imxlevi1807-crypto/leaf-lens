import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeafLens — Plant diagnosis from a photo",
  description:
    "Photograph a leaf and get a diagnosis, a step-by-step fix, and one thing to do today.",
  applicationName: "LeafLens",
  appleWebApp: { capable: true, title: "LeafLens", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#08170f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
