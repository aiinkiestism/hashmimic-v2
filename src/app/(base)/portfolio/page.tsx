import { fetchUnchainedXProjects } from "@/lib/unchainedx-portfolio";
import { PortfolioClient } from "./PortfolioClient";

// Re-render at most once per hour so newly-published UnchainedX projects
// surface here without a deploy. The fetch helper sets the same revalidate
// hint on its `fetch()` call, so the upstream payload is cached at the data
// layer too — this just bounds page-level staleness.
export const revalidate = 3600;

export default async function Portfolio() {
  const projects = await fetchUnchainedXProjects();
  return <PortfolioClient projects={projects} />;
}
