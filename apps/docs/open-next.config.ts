import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Next.js on Cloudflare Workers via OpenNext. The docs are prerendered at build time (they read token files and
// highlight code with Shiki, neither of which can run on a Worker), so pages are served from the static assets
// and never re-rendered at runtime.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
