export const productionSiteUrl = "https://shudipta-portfolio.vercel.app";

export const ogImage = {
  path: "/preview-og.jpg",
  width: 1200,
  height: 630,
  alt: "Portfolio - Shudipta Dip",
  type: "image/jpeg" as const,
};

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_ENV === "production") {
    return productionSiteUrl;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
