# Flutter

Copy [`packages/tokens/generated/flutter/rekanica_tokens.dart`](../../packages/tokens/generated/flutter/rekanica_tokens.dart) into `lib/theme/`
(or run `npx rekanica init --stack flutter` in the project root).

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
import 'theme/rekanica_tokens.dart';

MaterialApp(
  theme: rekanicaTheme(Brightness.light),
  darkTheme: rekanicaTheme(Brightness.dark),
  themeMode: ThemeMode.dark,
);

// Direct access
final c = Theme.of(context).brightness == Brightness.dark ? RekanicaColors.dark : RekanicaColors.light;
Text('RM 4,820', style: RekanicaText.metric.copyWith(color: c.foreground));
Padding(padding: const EdgeInsets.all(RekanicaSpacing.panel), child: …);
```
