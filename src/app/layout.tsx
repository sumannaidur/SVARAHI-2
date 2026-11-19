import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { INDEXABLE, SITE_URL } from "@/lib/site";
import { WebVitals } from "@/components/site/web-vitals";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Svarahi — Jewellery straight from manufacturers · Jayanagar, Bengaluru", template: "%s · Svarahi" },
  description: "Temple, bridal and everyday gold jewellery at Svarahi's showroom in Jayanagar, Bengaluru. Explore the collections, build a trial tray and plan a visit.",
  applicationName: "Svarahi",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Svarahi", locale: "en_IN", url: "/" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
  // Development build: never index until the owner approves launch (src/lib/site.ts).
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#140608", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        {children}
        <WebVitals />
      </body>
    </html>
  );
}
