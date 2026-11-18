# Jetpack Compose (Android)

Copy [`packages/tokens/generated/android/RekanicaTokens.kt`](../../packages/tokens/generated/android/RekanicaTokens.kt) into your app
module (package `com.aturanica.rekanica`, rename if needed) or run `npx rekanica init --stack compose`.

```kotlin
MaterialTheme(colorScheme = rekanicaColorScheme(isSystemInDarkTheme())) {
    Surface(color = MaterialTheme.colorScheme.background) { App() }
}

Card(shape = RoundedCornerShape(RekanicaRadius.Xxl), border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)) {
    Text("RM 4,820", fontSize = RekanicaTextSize.Metric, fontWeight = FontWeight.Light)
}
```
