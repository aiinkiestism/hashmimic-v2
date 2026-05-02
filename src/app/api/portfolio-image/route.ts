import { NextRequest } from "next/server";

// Same-origin image proxy for UnchainedX portfolio thumbnails. Two reasons
// to proxy instead of `<img src=upstream>`:
//   1. Three.js TextureLoader fetches via <img> with crossOrigin=anonymous;
//      if the upstream CDN doesn't send permissive CORS headers, the
//      texture comes back as a tainted canvas and renders black.
//   2. We get a single edge cache layer in front of all clients.
//
// The allowlist is intentionally narrow so this can't be repurposed as an
// open image proxy.
const ALLOWED_HOSTS = new Set<string>([
  "unchainedx.io",
  "cdn.sanity.io",
]);

const REVALIDATE_SECONDS = 3600;

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("u");
  if (!target) return new Response("missing url", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response("invalid url", { status: 400 });
  }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return new Response("forbidden host", { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!upstream.ok || !upstream.body) {
    return new Response("upstream error", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "image/png",
      "access-control-allow-origin": "*",
      "cache-control": `public, max-age=${REVALIDATE_SECONDS}, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    },
  });
}
