import { PortfolioBoard } from "@/components/portfolio/board";
import { getProjectsWithMedia } from "@/lib/portfolio";

export default async function Home() {
  const projects = await getProjectsWithMedia();

  return <PortfolioBoard projects={projects} />;
}
