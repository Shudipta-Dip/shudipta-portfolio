import type { Metadata, Viewport } from "next";
import { Nunito, Orbitron, Quicksand, Rajdhani, Share_Tech_Mono } from "next/font/google";
import Script from "next/script";

import { SiteHeader } from "@/components/layout/site-chrome";
import { Providers } from "@/components/providers";
import { ThemeScene } from "@/components/theme/theme-scene";
import { ThemedCursor } from "@/components/theme/themed-cursor";
import { getSiteUrl, ogImage, productionSiteUrl } from "@/lib/site";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { profile } from "../../content/profile";
import "./globals.css";
import "./themes/retrowave.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-rw-display",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rw-body",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rw-mono",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2f8ec8" },
    { media: "(prefers-color-scheme: dark)", color: "#060812" },
  ],
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="retrowave")document.documentElement.setAttribute("data-theme","retrowave");}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${nunito.variable} ${quicksand.variable} ${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Providers>
          <ThemedCursor />
          <ThemeScene />
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
