import 'package:flutter/material.dart';
import 'theme/rekanica_tokens.dart';

void main() => runApp(const RekanicaApp());

class RekanicaApp extends StatelessWidget {
  const RekanicaApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'Rekanica',
        theme: rekanicaTheme(Brightness.light),
        darkTheme: rekanicaTheme(Brightness.dark),
        themeMode: ThemeMode.dark,
        home: const OverviewScreen(),
      );
}

class OverviewScreen extends StatelessWidget {
  const OverviewScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final c = Theme.of(context).brightness == Brightness.dark ? RekanicaColors.dark : RekanicaColors.light;
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(RekanicaSpacing.gutter),
          children: [
            Text('Overview', style: RekanicaText.title.copyWith(color: c.foreground)),
            const SizedBox(height: RekanicaSpacing.stack),
            _StatGroup(colors: c, stats: const [('Revenue', 'RM 4,820', 'November'), ('Activity', '14', 'events today'), ('Balance', 'RM 1,206', '')]),
            const SizedBox(height: RekanicaSpacing.stack),
            FilledButton(onPressed: () {}, child: const Text('New invoice')),
          ],
        ),
      ),
    );
  }
}

/// Rekanica's signature pattern: several stats in ONE bordered container split by hairlines.
class _StatGroup extends StatelessWidget {
  const _StatGroup({required this.colors, required this.stats});
  final RekanicaColors colors;
  final List<(String, String, String)> stats;
  @override
  Widget build(BuildContext context) => Container(
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: BorderRadius.circular(RekanicaRadius.xxl),
          border: Border.all(color: colors.border),
        ),
        child: Column(
          children: [
            for (var i = 0; i < stats.length; i++) ...[
              if (i > 0) Divider(height: 1, color: colors.border),
              Padding(
                padding: const EdgeInsets.all(RekanicaSpacing.panel),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(stats[i].$1, style: RekanicaText.sm.copyWith(color: colors.foreground)),
                  const SizedBox(height: 16),
                  Row(crossAxisAlignment: CrossAxisAlignment.baseline, textBaseline: TextBaseline.alphabetic, children: [
                    Text(stats[i].$2, style: RekanicaText.metric.copyWith(color: colors.foreground)),
                    const SizedBox(width: 12),
                    Text(stats[i].$3, style: RekanicaText.sm.copyWith(color: colors.mutedForeground)),
                  ]),
                ]),
              ),
            ],
          ],
        ),
      );
}
