import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";

import { AeroScene } from "@/components/aero/scene";
import { BubbleCursor } from "@/components/aero/bubble-cursor";
// Shelved: import { LiquidCursor } from "@/components/aero/shelved/liquid-cursor";
import { SiteHeader } from "@/components/layout/site-chrome";
import { Providers } from "@/components/providers";
import { profile } from "../../content/profile";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Portfolio - Shudipta Dip",
    template: "%s · Shudipta Dip",
  },
  description: profile.headline,
  openGraph: {
    title: "Portfolio - Shudipta Dip",
    description: profile.headline,
    type: "website",
    images: [
      {
        url: "/preview-og.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio - Shudipta Dip",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio - Shudipta Dip",
    description: profile.headline,
    images: ["/preview-og.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${nunito.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <BubbleCursor />
          <AeroScene />
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
