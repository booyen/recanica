# Jetpack Compose (Android)


> **Your own font:** Geist is only the default. Load any calm sans with light/regular weights and tabular numerals, then set `--font-sans` / `--font-mono` to it.

Copy [`packages/tokens/generated/android/RecanicaTokens.kt`](../../packages/tokens/generated/android/RecanicaTokens.kt) into your app
module (package `com.aturanica.recanica`, rename if needed) or run `npx recanica init --stack compose`.

```kotlin
MaterialTheme(colorScheme = recanicaColorScheme(isSystemInDarkTheme())) {
    Surface(color = MaterialTheme.colorScheme.background) { App() }
}

Card(shape = RoundedCornerShape(RecanicaRadius.Xxl), border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) {
    Text("RM 4,820", fontSize = RecanicaTextSize.Metric, fontWeight = FontWeight.Light)
}
```
