/**
 * Capture per-route OG images using a real headless Chromium so the WebGL hero
 * actually renders (Satori / next/og cannot execute WebGL).
 *
 * Output:
 *   public/og/<slug>.png      1200x630  (FB / X large / Slack / Discord)
 *   public/og/<slug>-sq.png   1200x1200 (X summary / iMessage / square)
 *
 * Slugs: "home" for "/", otherwise the path with "/" replaced by "-".
 */

import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as wait } from "node:timers/promises";
import net from "node:net";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public", "og");

const ROUTES = [
  { path: "/", slug: "home" },
  { path: "/portfolio", slug: "portfolio" },
  { path: "/music", slug: "music" },
  { path: "/who", slug: "who" },
];

const SIZES = [
  { name: "", width: 1200, height: 630 },
  { name: "-sq", width: 1200, height: 1200 },
];

const PORT = 3939;
const ORIGIN = `http://127.0.0.1:${PORT}`;

function waitForPort(port, timeoutMs = 60_000) {
  const start = Date.now();
  return new Promise((resolveP, rejectP) => {
    const tryOnce = () => {
      const socket = net.createConnection(port, "127.0.0.1");
      socket.once("connect", () => {
        socket.destroy();
        resolveP();
      });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) {
          rejectP(new Error(`Timeout waiting for :${port}`));
        } else {
          setTimeout(tryOnce, 300);
        }
      });
    };
    tryOnce();
  });
}

async function captureOnce(browser, url, size, slug, attempt = 1) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: 1,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
    await page.evaluate(() => document.fonts?.ready);
    // R3F kicks off texture / API fetches after first paint (e.g. portfolio
    // pulls thumbnails through /api/portfolio-image). Hold here so those
    // requests can fire, then wait for the network to settle a second time.
    await wait(4000);
    await page.waitForLoadState("networkidle", { timeout: 60_000 });
    // Hide the live WebGL cursor overlay so the blob doesn't appear over the
    // center of the frame in OG output. The wrapper uses zIndex: 99999.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("body *")) {
        const z = getComputedStyle(el).zIndex;
        if (z === "99999" || z === "99998") {
          el.style.display = "none";
        }
      }
    });
    await wait(3000);
    const file = resolve(OUT_DIR, `${slug}${size.name}.png`);
    await page.screenshot({ path: file, type: "png", fullPage: false });
  } catch (err) {
    if (attempt < 3) {
      console.warn(`    ⚠ attempt ${attempt} failed (${err.message}); retrying…`);
      await context.close();
      await wait(1500);
      return captureOnce(browser, url, size, slug, attempt + 1);
    }
    throw err;
  } finally {
    await context.close().catch(() => {});
  }
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  console.log("→ Starting next start on", PORT);
  const server = spawn("pnpm", ["exec", "next", "start", "-p", String(PORT)], {
    cwd: ROOT,
    stdio: ["ignore", "inherit", "inherit"],
    env: { ...process.env, NODE_ENV: "production" },
  });

  const cleanup = () => {
    if (!server.killed) server.kill("SIGTERM");
  };
  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(130);
  });

  try {
    await waitForPort(PORT);
    console.log("→ Server up. Launching Chromium…");

    const browser = await chromium.launch({
      // SwiftShader gives reliable WebGL in headless without a real GPU
      // and avoids "Unable to capture screenshot" / renderer crashes.
      args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
    });
    try {
      for (const route of ROUTES) {
        for (const size of SIZES) {
          const url = `${ORIGIN}${route.path}`;
          console.log(`  • ${route.slug}${size.name} (${size.width}x${size.height}) ${url}`);
          await captureOnce(browser, url, size, route.slug);
        }
      }
    } finally {
      await browser.close();
    }

    console.log("✓ OG images written to", OUT_DIR);
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
