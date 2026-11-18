/** Malaysia-specific constants and helpers for invoicing. */
import type { TaxCode } from "./types";

export const TAX: Record<TaxCode, { label: string; short: string; rate: number }> = {
  none: { label: "No SST", short: "—", rate: 0 },
  "service-8": { label: "Service tax 8%", short: "SST 8%", rate: 0.08 },
  "sales-10": { label: "Sales tax 10%", short: "Sales tax 10%", rate: 0.1 },
  "sales-5": { label: "Sales tax 5%", short: "Sales tax 5%", rate: 0.05 },
};

export const STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis", "Pulau Pinang",
  "Sabah", "Sarawak", "Selangor", "Terengganu", "W.P. Kuala Lumpur", "W.P. Labuan", "W.P. Putrajaya",
];

/** FPX participating banks (subset) */
export const FPX_BANKS = [
  "Maybank2u", "CIMB Clicks", "Public Bank", "RHB Now", "Hong Leong Connect", "AmBank", "Bank Islam",
  "Bank Rakyat", "BSN", "Affin Bank", "Alliance Bank", "OCBC", "UOB", "HSBC", "Standard Chartered",
];

/** General TINs LHDN allows when a buyer has none */
export const GENERAL_TIN = { individual: "EI00000000010", foreign: "EI00000000020" };

export const PLAN_TEMPLATES = [
  { id: "deposit-50", label: "50% deposit + 50% on delivery", parts: [{ label: "Deposit", pct: 50, days: 0 }, { label: "Balance", pct: 50, days: 30 }] },
  { id: "deposit-30", label: "30% deposit + 2 monthly", parts: [{ label: "Deposit", pct: 30, days: 0 }, { label: "Instalment 1", pct: 35, days: 30 }, { label: "Instalment 2", pct: 35, days: 60 }] },
  { id: "monthly-3", label: "3 monthly instalments", parts: [{ label: "Instalment 1", pct: 34, days: 0 }, { label: "Instalment 2", pct: 33, days: 30 }, { label: "Instalment 3", pct: 33, days: 60 }] },
  { id: "monthly-6", label: "6 monthly instalments", parts: Array.from({ length: 6 }, (_, i) => ({ label: `Instalment ${i + 1}`, pct: i < 4 ? 17 : 16, days: i * 30 })) },
] as const;

export const ringgit = (n: number) =>
  new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", minimumFractionDigits: 2 }).format(n);

/* ---------- Amount in words, Malaysian invoice style ---------- */

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function words(n: number): string {
  if (n === 0) return "Zero";
  const chunk = (x: number) => {
    const out: string[] = [];
    if (x >= 100) { out.push(`${ONES[Math.floor(x / 100)]} Hundred`); x %= 100; if (x) out.push("And"); }
    if (x >= 20) { out.push(TENS[Math.floor(x / 10)] + (x % 10 ? ` ${ONES[x % 10]}` : "")); }
    else if (x > 0) out.push(ONES[x]);
    return out.join(" ");
  };
  const scales: [number, string][] = [[1e9, "Billion"], [1e6, "Million"], [1e3, "Thousand"]];
  const parts: string[] = [];
  for (const [v, name] of scales) if (n >= v) { parts.push(`${chunk(Math.floor(n / v))} ${name}`); n %= v; }
  if (n) parts.push(chunk(n));
  return parts.join(" ");
}

/** e.g. 1296 → "Ringgit Malaysia One Thousand Two Hundred And Ninety Six Only" */
export function amountInWords(amount: number) {
  const rm = Math.floor(amount + 1e-9);
  const sen = Math.round((amount - rm) * 100);
  return `Ringgit Malaysia ${words(rm)}${sen ? ` And Sen ${words(sen)}` : ""} Only`;
}

/* ---------- Demo identifiers ---------- */

export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Deterministic pseudo-UUID in MyInvois' 26-char base32 style */
export function fakeUuid(seed: string, len = 26) {
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let h = hash(seed);
  let out = "";
  for (let i = 0; i < len; i++) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; out += alphabet[h % 32]; }
  return out;
}

/* ---------- Payment plan builder ---------- */

export type PlanPart = { label: string; pct: number; days: number };

/** Turn percentage parts into instalments; the last one absorbs rounding so the plan sums exactly to the total. */
export function buildPlan(total: number, parts: readonly PlanPart[], startIso: string, idPrefix: string) {
  const start = new Date(startIso).getTime();
  let allocated = 0;
  return parts.map((p, i) => {
    const amount = i === parts.length - 1 ? Math.round((total - allocated) * 100) / 100 : Math.round(total * p.pct) / 100;
    allocated += amount;
    return { id: `${idPrefix}_${i + 1}`, label: p.label, amount, dueAt: new Date(start + p.days * 864e5).toISOString() };
  });
}

export function customParts(depositPct: number, count: number): PlanPart[] {
  const rest = 100 - depositPct;
  const each = Math.floor((rest / count) * 100) / 100;
  return [
    ...(depositPct > 0 ? [{ label: "Deposit", pct: depositPct, days: 0 }] : []),
    ...Array.from({ length: count }, (_, i) => ({
      label: `Instalment ${i + 1}`,
      pct: i === count - 1 ? Math.round((rest - each * (count - 1)) * 100) / 100 : each,
      days: (depositPct > 0 ? i + 1 : i) * 30,
    })),
  ];
}
