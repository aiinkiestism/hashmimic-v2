// Fetches the UnchainedX portfolio so this site stays in sync automatically
// when projects are added/edited upstream — no manual list to maintain.
//
// We read straight from Sanity (the CMS that backs unchainedx.io) via its
// public query API, rather than scraping unchainedx.io's React Router `.data`
// endpoint. That endpoint is an internal wire format (turbo-stream) that can
// change on any deploy, and unchainedx.io sits behind Cloudflare Bot Fight
// Mode, which challenges datacenter requests (e.g. Vercel) so a server-side
// fetch just came back empty. Sanity's `apicdn` host is the actual source of
// truth: a stable, CDN-cached, public read API that isn't behind that WAF.
//
// projectId/dataset are public identifiers (they ship in unchainedx.io's
// client bundle), so there's no secret to configure here.

const SANITY_PROJECT_ID = "vmng2w6s";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";
const REVALIDATE_SECONDS = 3600;

// GROQ: dereference the thumbnail image asset to its CDN url and flatten the
// slug so the shape matches PortfolioProject directly.
const PROJECTS_QUERY = `*[_type=="project"]|order(order asc){title,"slug":slug.current,description,status,"thumbnail":thumbnail.asset->url,url,order}`;

const PORTFOLIO_URL = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(PROJECTS_QUERY)}`;

export interface PortfolioProject {
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
  status?: string;
  order?: number;
}

interface SanityProject {
  title?: unknown;
  slug?: unknown;
  description?: unknown;
  status?: unknown;
  thumbnail?: unknown;
  url?: unknown;
  order?: unknown;
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function isHttpUrl(v: unknown): v is string {
  return typeof v === "string" && /^https?:\/\//i.test(v);
}

function normalize(projects: unknown): PortfolioProject[] {
  if (!Array.isArray(projects)) return [];

  const out: PortfolioProject[] = [];
  for (const raw of projects) {
    if (!raw || typeof raw !== "object") continue;
    const p = raw as SanityProject;

    const title = asString(p.title);
    if (!title) continue;

    // URL preference: explicit `url` (external project link) → fall back to
    // the upstream portfolio detail page derived from the Sanity slug.
    const slug = asString(p.slug);
    const fallbackUrl = slug ? `https://unchainedx.io/portfolio/${slug}` : null;
    const url = isHttpUrl(p.url) ? p.url : fallbackUrl;
    if (!url) continue;

    out.push({
      title,
      url,
      thumbnail: isHttpUrl(p.thumbnail) ? p.thumbnail : undefined,
      description: asString(p.description),
      status: asString(p.status),
      order: typeof p.order === "number" ? p.order : undefined,
    });
  }

  // Sanity already orders by `order asc`, but keep a stable client-side sort in
  // case any entry is missing the field.
  out.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
  return out;
}

export async function fetchUnchainedXProjects(): Promise<PortfolioProject[]> {
  try {
    const res = await fetch(PORTFOLIO_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      console.error(`[portfolio] sanity query failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const body = (await res.json()) as { result?: unknown };
    return normalize(body.result);
  } catch (err) {
    // Upstream hiccups must not break the page render; the static studio tiles
    // still appear and the dynamic list just stays empty — but log it so the
    // failure is visible in production instead of vanishing.
    console.error("[portfolio] sanity fetch/parse threw:", err);
    return [];
  }
}

// Routes a remote thumbnail through our same-origin proxy so the WebGL
// TextureLoader doesn't trip CORS. The proxy enforces an allowlist.
export function proxyThumbnail(url: string): string {
  return `/api/portfolio-image?u=${encodeURIComponent(url)}`;
}
