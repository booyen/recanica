# Flutter


> **Your own font:** Geist is only the default. Load any calm sans with light/regular weights and tabular numerals, then set `--font-sans` / `--font-mono` to it.

Copy [`packages/tokens/generated/flutter/recanica_tokens.dart`](../../packages/tokens/generated/flutter/recanica_tokens.dart) into `lib/theme/`
(or run `npx recanica init --stack flutter` in the project root).

Add Geist to `pubspec.yaml` (download from Google Fonts):

```yaml
flutter:
  fonts:
    - family: Geist
      fonts:
        - asset: assets/fonts/Geist-Light.ttf
          weight: 300
        - asset: assets/fonts/Geist-Regular.ttf
        - asset: assets/fonts/Geist-Medium.ttf
          weight: 500
```

```dart
import 'theme/recanica_tokens.dart';

MaterialApp(
  theme: recanicaTheme(Brightness.light),
  darkTheme: recanicaTheme(Brightness.dark),
  themeMode: ThemeMode.dark,
);

// Direct access
final c = Theme.of(context).brightness == Brightness.dark ? RecanicaColors.dark : RecanicaColors.light;
Text('RM 4,820', style: RecanicaText.metric.copyWith(color: c.foreground));
Padding(padding: const EdgeInsets.all(RecanicaSpacing.panel), child: …);
```
