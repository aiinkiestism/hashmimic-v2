// Fetches the UnchainedX portfolio so this site stays in sync automatically
// when projects are added/edited upstream — no manual list to maintain.
//
// UnchainedX is built on React Router 7, which exposes its loader data at
// `<route>.data` in the "turbo-stream" wire format. We hit the public
// endpoint, decode the pool-with-references format, and project the result
// down to the small shape (`title`, `url`, `thumbnail`) that the WebGL
// IconLink layer needs.

const PORTFOLIO_URL = "https://unchainedx.io/portfolio.data";
const REVALIDATE_SECONDS = 3600;

export interface PortfolioProject {
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
  status?: string;
  order?: number;
}

// Turbo-stream encodes data as a flat pool. Index 0 is the root. Strings,
// numbers and booleans are stored verbatim. Arrays become arrays of pool
// indices. Objects use `{ "_<keyIdx>": valueIdx }` where the property name is
// `pool[keyIdx]` and the value is `pool[valueIdx]`. Negative indices are
// sentinel slots (e.g. POSITIVE_INFINITY=-5 in turbo-stream's protocol);
// none of them carry a value we care about, so we treat all negatives as
// `undefined`. We resolve lazily with a memoising visitor to handle cycles.
function decodeTurboStream(payload: string): unknown {
  const pool = JSON.parse(payload) as unknown[];
  const cache = new Map<number, unknown>();

  const resolve = (idx: unknown): unknown => {
    if (typeof idx !== "number" || idx < 0) return undefined;
    if (cache.has(idx)) return cache.get(idx);
    const cell = pool[idx];

    if (Array.isArray(cell)) {
      const arr: unknown[] = [];
      cache.set(idx, arr);
      for (const ref of cell) arr.push(resolve(ref));
      return arr;
    }

    if (cell !== null && typeof cell === "object") {
      const obj: Record<string, unknown> = {};
      cache.set(idx, obj);
      for (const [encodedKey, valueRef] of Object.entries(cell as Record<string, unknown>)) {
        if (!encodedKey.startsWith("_")) continue;
        const keyIdx = Number.parseInt(encodedKey.slice(1), 10);
        if (Number.isNaN(keyIdx)) continue;
        const keyName = resolve(keyIdx);
        if (typeof keyName !== "string") continue;
        obj[keyName] = resolve(valueRef);
      }
      return obj;
    }

    cache.set(idx, cell);
    return cell;
  };

  return resolve(0);
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function isHttpUrl(v: unknown): v is string {
  return typeof v === "string" && /^https?:\/\//i.test(v);
}

function normalize(raw: unknown): PortfolioProject[] {
  const root = raw as Record<string, unknown> | null;
  const route = root?.["routes/portfolio"] as Record<string, unknown> | undefined;
  const data = route?.data as Record<string, unknown> | undefined;
  const projects = data?.projects;
  if (!Array.isArray(projects)) return [];

  const out: PortfolioProject[] = [];
  for (const raw of projects) {
    if (!raw || typeof raw !== "object") continue;
    const p = raw as Record<string, unknown>;

    const title = asString(p.title);
    if (!title) continue;

    // URL preference: explicit `url` (external project link) → fall back to
    // the upstream portfolio detail page derived from the Sanity slug.
    const slug = (p.slug as Record<string, unknown> | undefined)?.current;
    const fallbackUrl = typeof slug === "string" ? `https://unchainedx.io/portfolio/${slug}` : null;
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

  out.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
  return out;
}

export async function fetchUnchainedXProjects(): Promise<PortfolioProject[]> {
  try {
    const res = await fetch(PORTFOLIO_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { accept: "text/x-script, */*" },
    });
    if (!res.ok) return [];
    const text = await res.text();
    return normalize(decodeTurboStream(text));
  } catch {
    // Upstream hiccups must not break the page render; the static studio
    // tiles still appear and the dynamic list just stays empty.
    return [];
  }
}

// Routes a remote thumbnail through our same-origin proxy so the WebGL
// TextureLoader doesn't trip CORS. The proxy enforces an allowlist.
export function proxyThumbnail(url: string): string {
  return `/api/portfolio-image?u=${encodeURIComponent(url)}`;
}
