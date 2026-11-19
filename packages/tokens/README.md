# @recanica/tokens

Recanica's design tokens. One source (`tokens/*.json`, W3C Design Tokens format) → every platform.

| Output | Import |
|---|---|
| Tailwind v4 (full theme) | `@import "@recanica/tokens/theme.css";` |
| Plain CSS variables | `@import "@recanica/tokens/variables.css";` |
| Tailwind v3 preset | `presets: [require("@recanica/tokens/tailwind-preset")]` + variables.css |
| JS / TS | `import { tokens } from "@recanica/tokens"` |
| JSON (resolved hex) | `@recanica/tokens/tokens.json` |
| Flutter | `generated/flutter/recanica_tokens.dart` → `recanicaTheme(Brightness.dark)` |
| SwiftUI | `generated/ios/RecanicaTokens.swift` → `Recanica.Colors.background` |
| Jetpack Compose | `generated/android/RecanicaTokens.kt` → `recanicaColorScheme(dark)` |
| Figma | `generated/figma/tokens-studio.json` (import with the Tokens Studio plugin) |

## Editing tokens

1. Edit `tokens/*.json`. Semantic colors put light in `$value` and dark in `$extensions["com.recanica"].dark`.
2. `pnpm --filter @recanica/tokens build`
3. Commit `tokens/` and `generated/` together. CI runs `check` and fails if they drift.

