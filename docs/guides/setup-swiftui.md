# SwiftUI (iOS)

Add [`packages/tokens/generated/ios/RekanicaTokens.swift`](../../packages/tokens/generated/ios/RekanicaTokens.swift) to your Xcode target
(or `npx rekanica init --stack swiftui`). Add the Geist font files and list them under `UIAppFonts` in Info.plist.

```swift
Text("RM 4,820")
    .font(Rekanica.Typography.metric)
    .foregroundStyle(Rekanica.Colors.foreground)
    .padding(Rekanica.Spacing.panel)
    .background(Rekanica.Colors.card, in: RoundedRectangle(cornerRadius: Rekanica.Radius.xxl))
    .overlay(RoundedRectangle(cornerRadius: Rekanica.Radius.xxl).stroke(Rekanica.Colors.border))
```

Colors switch with the system appearance automatically.
