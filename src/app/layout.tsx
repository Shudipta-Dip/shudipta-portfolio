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

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.shortName}`,
  },
  description: profile.headline,
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
