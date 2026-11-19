# Contributing

1. **Tokens**: edit `packages/tokens/tokens/*.json`, run `pnpm tokens`, commit source + `generated/` together (CI checks drift).
2. **Components / patterns / blocks**: add the file, add an entry to `apps/docs/lib/catalog.json` (plus an example in `apps/docs/examples/` for components). Docs pages, search, registry, llms.txt and the MCP server pick it up.
3. **Rules**: edit `docs/ai/rules.template.md`; it feeds the docs AI page, MCP server and CLI.
4. **Before a PR**: `pnpm lint:design && pnpm lint:copy && pnpm build && pnpm typecheck && pnpm test && pnpm test:layout`. The coverage test fails until a new item appears in a demo (UI kit, patterns gallery or `/site/sections`). Update screenshots with `pnpm test:visual -- --update-snapshots` only for intended visual changes.
5. **Release**: add a changeset (`pnpm changeset`). Merging the "Version Packages" PR publishes to npm (needs `NPM_TOKEN` secret).

The full rules are in `docs/ai/rules.template.md`; how they're enforced is in [docs/GOVERNANCE.md](docs/GOVERNANCE.md).
