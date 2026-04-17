import type { Metadata } from "next";
import { Cinzel, Inter_Tight, UnifrakturCook } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { AgeGate } from "@/components/providers/age-gate";
import { CookieBanner } from "@/components/providers/cookie-banner";
import { Concierge } from "@/components/chat/concierge";

const display = UnifrakturCook({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "700",
});

const serif = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Mari Belle Bones | MBB — Dark art tattoo",
    template: "%s | Mari Belle Bones",
  },
  description:
    "Mari Belle Bones — dark art tattoo. Book consultations and sessions with Square deposit. Saniderm aftercare, flash, tour dates, gift cards.",
  openGraph: {
    title: "Mari Belle Bones | MBB",
    description: "Dark art. Ritual ink. Book + deposit on-site.",
    type: "website",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: import("next").Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060606",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${sans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          <div className="grain" aria-hidden />
          <AgeGate />
          <CookieBanner />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Concierge />
        </SmoothScroll>
      </body>
    </html>
  );
}
