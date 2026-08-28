import type { Metadata, Viewport } from "next";
import { Nunito, Quicksand } from "next/font/google";

import { AeroScene } from "@/components/aero/scene";
import { BubbleCursor } from "@/components/aero/bubble-cursor";
// Shelved: import { LiquidCursor } from "@/components/aero/shelved/liquid-cursor";
import { SiteHeader } from "@/components/layout/site-chrome";
import { Providers } from "@/components/providers";
import { getSiteUrl, ogImage, productionSiteUrl } from "@/lib/site";
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

const siteUrl = getSiteUrl();
const socialTitle = "Portfolio - Shudipta Dip";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: socialTitle,
    template: "%s · Shudipta Dip",
  },
  description: profile.headline,
  alternates: {
    canonical: productionSiteUrl,
  },
  openGraph: {
    title: socialTitle,
    description: profile.headline,
    url: productionSiteUrl,
    siteName: socialTitle,
    type: "website",
    images: [
      {
        url: ogImage.path,
        secureUrl: ogImage.path,
        width: ogImage.width,
        height: ogImage.height,
        type: ogImage.type,
        alt: ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: profile.headline,
    images: [
      {
        url: ogImage.path,
        width: ogImage.width,
        height: ogImage.height,
        alt: ogImage.alt,
      },
    ],
  },
  other: {
    "og:image:width": String(ogImage.width),
    "og:image:height": String(ogImage.height),
    "og:image:type": ogImage.type,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2f8ec8",
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
