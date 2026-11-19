export type Issue = { rule: string; detail: string };
export function auditPage(): Issue[];
export const LAYOUT_RULES: string[];
export const UX_RULES: string[];
export function auditSpec(copyRules?: [string, string, string, string][]): Issue[];
export const SPEC_RULES: string[];
