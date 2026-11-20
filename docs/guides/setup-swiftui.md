# SwiftUI (iOS)


> **Your own font:** Geist is only the default. Load any calm sans with light/regular weights and tabular numerals, then set `--font-sans` / `--font-mono` to it.

Add [`packages/tokens/generated/ios/RecanicaTokens.swift`](../../packages/tokens/generated/ios/RecanicaTokens.swift) to your Xcode target
(or `npx recanica init --stack swiftui`). Add the Geist font files and list them under `UIAppFonts` in Info.plist.

```swift
Text("RM 4,820")
    .font(Recanica.Typography.metric)
    .foregroundStyle(Recanica.Colors.foreground)
    .padding(Recanica.Spacing.panel)
    .background(Recanica.Colors.card, in: RoundedRectangle(cornerRadius: Recanica.Radius.xxl))
    .overlay(RoundedRectangle(cornerRadius: Recanica.Radius.xxl).stroke(Recanica.Colors.border))
```

Colors switch with the system appearance automatically.
