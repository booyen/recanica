import type { Page } from "@playwright/test";
// One rule set for this repo and every project that uses Recanica (`npx recanica audit`).
import { auditPage, auditSpec, UX_RULES, type Issue } from "../../../packages/cli/src/audit-browser.js";
import { COPY_RULES_SOURCE } from "../../../packages/cli/src/copy-rules.js";

export type { Issue };

/** Layout rules: overflow, clipped text, wrapped labels, overlap, table edges, surface padding, stretched rows. */
export async function auditLayout(page: Page): Promise<Issue[]> {
  return (await page.evaluate(auditPage)).filter((i) => !UX_RULES.includes(i.rule));
}

/** UX rules: unnamed controls, small touch targets, dead links, unlabelled fields, duplicate ids. */
export async function auditUx(page: Page): Promise<Issue[]> {
  return (await page.evaluate(auditPage)).filter((i) => UX_RULES.includes(i.rule));
}

/** Recanica spec + consistency: token colours only, no bold, pill buttons, radius scale, same component = same look, no AI-jargon copy. */
export async function auditRecanicaSpec(page: Page): Promise<Issue[]> {
  return page.evaluate(auditSpec, COPY_RULES_SOURCE);
}
