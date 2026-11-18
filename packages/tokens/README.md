# @rekanica/tokens

Rekanica's design tokens. One source (`tokens/*.json`, W3C Design Tokens format) → every platform.

| Output | Import |
|---|---|
| Tailwind v4 (full theme) | `@import "@rekanica/tokens/theme.css";` |
| Plain CSS variables | `@import "@rekanica/tokens/variables.css";` |
| Tailwind v3 preset | `presets: [require("@rekanica/tokens/tailwind-preset")]` + variables.css |
| JS / TS | `import { tokens } from "@rekanica/tokens"` |
| JSON (resolved hex) | `@rekanica/tokens/tokens.json` |
| Flutter | `generated/flutter/rekanica_tokens.dart` → `rekanicaTheme(Brightness.dark)` |
| SwiftUI | `generated/ios/RekanicaTokens.swift` → `Rekanica.Colors.background` |
| Jetpack Compose | `generated/android/RekanicaTokens.kt` → `rekanicaColorScheme(dark)` |
| Figma | `generated/figma/tokens-studio.json` (import with the Tokens Studio plugin) |

## Editing tokens

1. Edit `tokens/*.json`. Semantic colors put light in `$value` and dark in `$extensions["com.rekanica"].dark`.
2. `pnpm --filter @rekanica/tokens build`
3. Commit `tokens/` and `generated/` together. CI runs `check` and fails if they drift.

Brand finishes (mesh / chrome gradients) are CSS-only and live in `theme.css`.
