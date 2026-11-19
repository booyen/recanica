# Changesets

Every PR that changes a published package adds a changeset:

```bash
pnpm changeset
```

All Recanica packages share one version (`fixed` group), so tokens, ui, css, mcp and the CLI always match.
On merge to `main`, the Release workflow opens a "Version Packages" PR; merging it publishes to npm
(requires the `NPM_TOKEN` repository secret).
