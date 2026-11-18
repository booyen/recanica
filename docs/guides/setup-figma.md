# Figma

1. Install the **Tokens Studio for Figma** plugin.
2. Load [`packages/tokens/generated/figma/tokens-studio.json`](../../packages/tokens/generated/figma/tokens-studio.json)
   (or sync the plugin to this GitHub repo, path `packages/tokens/generated/figma/tokens-studio.json`).
3. Themes **Light** and **Dark** are preconfigured. Export to Figma variables from the plugin.

Changes go the other way through `packages/tokens/tokens/*.json` → `pnpm --filter @rekanica/tokens build`.
