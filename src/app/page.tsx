import { AboutBand, Hero } from "@/components/portfolio/hero";
import { PortfolioBoard } from "@/components/portfolio/board";
import { getProjectsWithMedia, getSiteMedia } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, siteMedia] = await Promise.all([
    getProjectsWithMedia(),
    getSiteMedia(),
  ]);

  return (
    <>
      <Hero portrait={siteMedia.portrait} />
      <PortfolioBoard projects={projects} />
      <AboutBand />
    </>
  );
}
