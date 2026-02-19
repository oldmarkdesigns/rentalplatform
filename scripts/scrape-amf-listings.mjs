#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_URL = "https://www.amffastigheter.se/kontor/";
const USER_AGENT = "OfficeRentalBot/0.1 (+contact: you@example.com)";
const now = new Date();

const args = new Set(process.argv.slice(2));
const targetUrl = [...args].find((a) => a.startsWith("http")) || DEFAULT_URL;
const headed = args.has("--headed");
const ignoreRobots = args.has("--ignore-robots");

function parseOrigin(url) {
  return new URL(url).origin;
}

function parsePath(url) {
  const parsed = new URL(url);
  return `${parsed.pathname}${parsed.search}`;
}

function robotsDisallows(robotsTxt, pathname, userAgent = "*") {
  const lines = robotsTxt
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  const blocks = [];
  let current = { userAgents: [], disallow: [] };

  for (const rawLine of lines) {
    const [keyRaw, ...rest] = rawLine.split(":");
    if (!keyRaw || rest.length === 0) continue;

    const key = keyRaw.trim().toLowerCase();
    const value = rest.join(":").trim();

    if (key === "user-agent") {
      if (current.userAgents.length > 0 || current.disallow.length > 0) {
        blocks.push(current);
      }
      current = { userAgents: [value.toLowerCase()], disallow: [] };
      continue;
    }

    if (key === "disallow") {
      current.disallow.push(value);
    }
  }

  if (current.userAgents.length > 0 || current.disallow.length > 0) {
    blocks.push(current);
  }

  const ua = userAgent.toLowerCase();
  const applicable = blocks.filter(
    (b) => b.userAgents.includes("*") || b.userAgents.includes(ua),
  );

  for (const block of applicable) {
    for (const disallowPath of block.disallow) {
      if (!disallowPath) continue;
      if (pathname.startsWith(disallowPath)) return true;
    }
  }

  return false;
}

async function fetchRobotsTxt(url) {
  const robotsUrl = `${parseOrigin(url)}/robots.txt`;
  const response = await fetch(robotsUrl, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    return { found: false, text: "" };
  }

  return { found: true, text: await response.text() };
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch (error) {
    const message = String(error?.message || error);
    throw new Error(
      [
        "Could not load Playwright.",
        "Install it with: npm install -D playwright",
        `Original error: ${message}`,
      ].join("\n"),
    );
  }
}

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function isoStamp(date) {
  return date.toISOString().replace(/[:.]/g, "-");
}

async function main() {
  if (!ignoreRobots) {
    const robots = await fetchRobotsTxt(targetUrl);
    if (robots.found) {
      const pathToCheck = parsePath(targetUrl);
      const blocked = robotsDisallows(robots.text, pathToCheck, "*");
      if (blocked) {
        console.error(
          `Blocked by robots.txt for path "${pathToCheck}". Re-run with --ignore-robots only if you have legal permission.`,
        );
        process.exit(1);
      }
    }
  }

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ headless: !headed });
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();

  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

  const listings = await page.evaluate(() => {
    const selectors = [
      "article",
      ".listing",
      ".property-card",
      ".teaser",
      "[class*='card']",
      "[class*='listing']",
      "li",
    ];

    const picked = [];
    const seen = new Set();

    for (const selector of selectors) {
      const nodes = Array.from(document.querySelectorAll(selector));
      for (const node of nodes) {
        const anchor = node.querySelector("a[href]");
        if (!anchor) continue;
        const href = anchor.getAttribute("href") || "";
        const title =
          anchor.textContent ||
          node.querySelector("h1,h2,h3,h4")?.textContent ||
          "";
        const text = node.textContent || "";
        const normalizedText = text.replace(/\s+/g, " ").trim();

        if (!href || normalizedText.length < 20) continue;

        const key = `${href}::${title.trim()}`;
        if (seen.has(key)) continue;
        seen.add(key);

        picked.push({
          title: title.trim(),
          url: new URL(href, location.origin).toString(),
          snippet: normalizedText.slice(0, 350),
          rawText: normalizedText,
        });
      }
    }

    return picked;
  });

  await browser.close();

  const filtered = listings
    .map((row) => ({
      title: cleanText(row.title),
      url: cleanText(row.url),
      snippet: cleanText(row.snippet),
      rawText: cleanText(row.rawText),
    }))
    .filter((row) => row.url && row.rawText.length > 30);

  const uniqueByUrl = Array.from(
    new Map(filtered.map((item) => [item.url, item])).values(),
  );

  const output = {
    source: targetUrl,
    scrapedAt: now.toISOString(),
    listingCount: uniqueByUrl.length,
    listings: uniqueByUrl,
  };

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outDir = path.resolve(__dirname, "../output/scraped");
  await fs.mkdir(outDir, { recursive: true });

  const outFile = path.join(outDir, `amf-kontor-${isoStamp(now)}.json`);
  await fs.writeFile(outFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(`Scraped ${uniqueByUrl.length} listings`);
  console.log(`Saved: ${outFile}`);
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
