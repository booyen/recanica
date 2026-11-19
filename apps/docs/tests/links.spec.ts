import { expect, test } from "@playwright/test";

/**
 * Link check: crawls the site from the home page and the demo, following every same-origin link.
 * Fails on links that 404 and on dead "#" links in real pages (pattern previews under /view are samples and exempt).
 */
test("no broken or dead internal links", async ({ page, request, baseURL, isMobile }) => {
  test.skip(!!isMobile, "one viewport is enough");
  test.setTimeout(600_000);
  await page.goto("/demo/sign-in");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/demo/app");

  const seen = new Set<string>();
  const queue = ["/", "/docs", "/site", "/demo", "/demo/app", "/demo/portal"];
  const broken: string[] = [];
  const dead: string[] = [];
  const status = new Map<string, number>();

  while (queue.length && seen.size < 600) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await page.goto(path, { waitUntil: "domcontentloaded" });
    if (!res || res.status() >= 400) { broken.push(`${path} → ${res?.status()}`); continue; }
    if (path.startsWith("/view/")) continue; // previews: don't crawl inside
    const links = await page.$$eval("a[href]", (as) => as.map((a) => ({ href: a.getAttribute("href")!, text: (a.textContent ?? "").trim().slice(0, 40) })));
    for (const { href, text } of links) {
      if (href === "#" || href === "") { dead.push(`${path}: "${text}"`); continue; }
      if (/^(mailto|tel|javascript):/.test(href) || href.startsWith("#")) continue;
      const url = new URL(href, baseURL + path);
      if (url.origin !== new URL(baseURL!).origin) continue;
      const p = url.pathname + url.search;
      if (/\.(txt|css|json|svg|png|xml)$/.test(url.pathname)) {
        if (!status.has(p)) status.set(p, (await request.get(p)).status());
        if (status.get(p)! >= 400) broken.push(`${path} → ${p} (${status.get(p)})`);
        continue;
      }
      if (!seen.has(p)) queue.push(p);
    }
  }
  console.log(`link check: ${seen.size} pages crawled`);
  expect.soft(broken, "broken links").toEqual([]);
  expect.soft([...new Set(dead)], 'dead "#" links').toEqual([]);
});
