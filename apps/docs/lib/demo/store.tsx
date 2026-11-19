"use client";

import * as React from "react";
import { TAX, fakeUuid } from "./my";
import { seed } from "./seed";
import type {
  CheckoutLink, Customer, DemoEvent, DemoState, Invoice, InvoiceItem, Org, Product,
} from "./types";

const KEY = "recanica-demo-v2";
export const FEE_RATE = 0.03;
export const FEE_FIXED = 1;

export const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 8)}`;
const now = () => new Date().toISOString();
const addDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * 864e5).toISOString();

type Action =
  | { type: "hydrate"; state: DemoState }
  | { type: "reset" }
  | { type: "signIn"; email: string }
  | { type: "signOut" }
  | { type: "updateOrg"; patch: Partial<Org> }
  | { type: "upsertProduct"; product: Product }
  | { type: "archiveProduct"; id: string; archived: boolean }
  | { type: "upsertLink"; link: CheckoutLink }
  | { type: "deleteLink"; id: string }
  | { type: "visitLink"; id: string }
  | { type: "checkout"; linkId?: string; productId: string; name: string; email: string; country: string; orderId: string }
  | { type: "refund"; orderId: string }
  | { type: "cancelSubscription"; id: string }
  | { type: "upsertInvoice"; invoice: Invoice }
  | { type: "sendInvoice"; id: string }
  | { type: "validateEinvoice"; id: string }
  | { type: "payInvoice"; id: string; method: string }
  | { type: "payInstallment"; id: string; installmentId: string; method: string }
  | { type: "voidInvoice"; id: string }
  | { type: "createCustomer"; customer: Customer }
  | { type: "payout"; amount: number };

function event(state: DemoState, e: Omit<DemoEvent, "id" | "at">): DemoEvent[] {
  return [{ id: uid("evt"), at: now(), ...e }, ...state.events].slice(0, 50);
}

function reducer(state: DemoState, a: Action): DemoState {
  switch (a.type) {
    case "hydrate":
      return a.state;
    case "reset":
      return { ...seed, signedIn: state.signedIn };
    case "signIn":
      return { ...state, signedIn: true, user: { ...state.user, email: a.email || state.user.email } };
    case "signOut":
      return { ...state, signedIn: false };
    case "updateOrg":
      return { ...state, org: { ...state.org, ...a.patch } };
    case "upsertProduct": {
      const exists = state.products.some((p) => p.id === a.product.id);
      return {
        ...state,
        products: exists ? state.products.map((p) => (p.id === a.product.id ? a.product : p)) : [a.product, ...state.products],
        events: exists ? state.events : event(state, { type: "product", title: `Product “${a.product.name}” created`, href: `/demo/app/products/${a.product.id}` }),
      };
    }
    case "archiveProduct":
      return { ...state, products: state.products.map((p) => (p.id === a.id ? { ...p, archived: a.archived } : p)) };
    case "upsertLink": {
      const exists = state.links.some((l) => l.id === a.link.id);
      return { ...state, links: exists ? state.links.map((l) => (l.id === a.link.id ? a.link : l)) : [a.link, ...state.links] };
    }
    case "deleteLink":
      return { ...state, links: state.links.filter((l) => l.id !== a.id) };
    case "visitLink":
      return { ...state, links: state.links.map((l) => (l.id === a.id ? { ...l, visits: l.visits + 1 } : l)) };
    case "checkout": {
      const product = state.products.find((p) => p.id === a.productId);
      if (!product) return state;
      let customer = state.customers.find((c) => c.email.toLowerCase() === a.email.toLowerCase());
      let customers = state.customers;
      let events = state.events;
      if (!customer) {
        customer = { id: uid("cus"), name: a.name, email: a.email, country: a.country, createdAt: now() };
        customers = [customer, ...customers];
        events = event({ ...state, events }, { type: "customer", title: "New customer", who: customer.name, href: `/demo/app/customers/${customer.id}` });
      }
      const order = { id: a.orderId, customerId: customer.id, productId: product.id, amount: product.price, status: "paid" as const, linkId: a.linkId, createdAt: now() };
      events = event({ ...state, events }, { type: "order", title: `Order paid · ${product.name}`, who: customer.name, href: `/demo/app/sales` });
      const subscriptions =
        product.type === "recurring"
          ? [{ id: uid("sub"), customerId: customer.id, productId: product.id, status: "active" as const, startedAt: now(), renewsAt: addDays(now(), product.interval === "year" ? 365 : 30) }, ...state.subscriptions]
          : state.subscriptions;
      return { ...state, customers, orders: [order, ...state.orders], subscriptions, events };
    }
    case "refund": {
      const o = state.orders.find((x) => x.id === a.orderId);
      const c = state.customers.find((x) => x.id === o?.customerId);
      return {
        ...state,
        orders: state.orders.map((x) => (x.id === a.orderId ? { ...x, status: "refunded" } : x)),
        events: event(state, { type: "refund", title: "Order refunded", who: c?.name }),
      };
    }
    case "cancelSubscription": {
      const s = state.subscriptions.find((x) => x.id === a.id);
      const c = state.customers.find((x) => x.id === s?.customerId);
      return {
        ...state,
        subscriptions: state.subscriptions.map((x) => (x.id === a.id ? { ...x, status: "canceled" } : x)),
        events: event(state, { type: "subscription_canceled", title: "Subscription canceled", who: c?.name }),
      };
    }
    case "upsertInvoice": {
      const exists = state.invoices.some((i) => i.id === a.invoice.id);
      return { ...state, invoices: exists ? state.invoices.map((i) => (i.id === a.invoice.id ? a.invoice : i)) : [a.invoice, ...state.invoices] };
    }
    case "sendInvoice": {
      const inv = state.invoices.find((i) => i.id === a.id);
      const c = state.customers.find((x) => x.id === inv?.customerId);
      const t = now();
      const einvoice = state.org.einvoice
        ? { uuid: fakeUuid(a.id + t), longId: fakeUuid(t + a.id, 6), status: "submitted" as const, submittedAt: t }
        : undefined;
      return {
        ...state,
        invoices: state.invoices.map((i) => (i.id === a.id ? { ...i, status: "open", issuedAt: t, einvoice } : i)),
        events: event(state, { type: "invoice_sent", title: `Invoice ${inv?.number} sent${einvoice ? " · submitted to MyInvois" : ""}`, who: c?.name, href: `/demo/app/invoices/${a.id}` }),
      };
    }
    case "validateEinvoice":
      return {
        ...state,
        invoices: state.invoices.map((i) =>
          i.id === a.id && i.einvoice?.status === "submitted" ? { ...i, einvoice: { ...i.einvoice, status: "valid", validatedAt: now() } } : i
        ),
      };
    case "payInvoice": {
      const inv = state.invoices.find((i) => i.id === a.id);
      const c = state.customers.find((x) => x.id === inv?.customerId);
      const t = now();
      return {
        ...state,
        invoices: state.invoices.map((i) =>
          i.id === a.id
            ? { ...i, status: "paid", paidAt: t, paidMethod: a.method, plan: i.plan?.map((p) => (p.paidAt ? p : { ...p, paidAt: t, method: a.method })) }
            : i
        ),
        events: event(state, { type: "invoice_paid", title: `Invoice ${inv?.number} paid in full`, who: c?.name, href: `/demo/app/invoices/${a.id}` }),
      };
    }
    case "payInstallment": {
      const inv = state.invoices.find((i) => i.id === a.id);
      if (!inv?.plan) return state;
      const c = state.customers.find((x) => x.id === inv.customerId);
      const t = now();
      const plan = inv.plan.map((p) => (p.id === a.installmentId ? { ...p, paidAt: t, method: a.method } : p));
      const done = plan.every((p) => p.paidAt);
      const label = inv.plan.find((p) => p.id === a.installmentId)?.label ?? "Instalment";
      return {
        ...state,
        invoices: state.invoices.map((i) => (i.id === a.id ? { ...i, plan, status: done ? "paid" : "partial", paidAt: done ? t : i.paidAt, paidMethod: done ? a.method : i.paidMethod } : i)),
        events: event(state, { type: "invoice_paid", title: `${label} of ${inv.number} paid`, who: c?.name, href: `/demo/app/invoices/${a.id}` }),
      };
    }
    case "voidInvoice":
      return { ...state, invoices: state.invoices.map((i) => (i.id === a.id ? { ...i, status: "void" } : i)) };
    case "createCustomer":
      return {
        ...state,
        customers: [a.customer, ...state.customers],
        events: event(state, { type: "customer", title: "New customer", who: a.customer.name, href: `/demo/app/customers/${a.customer.id}` }),
      };
    case "payout":
      return {
        ...state,
        payouts: [{ id: uid("po"), amount: a.amount, status: "in_transit", at: now() }, ...state.payouts],
        events: event(state, { type: "payout", title: `Payout of ${money(a.amount)} initiated` }),
      };
  }
}

/* ---------- context ---------- */

type Ctx = { state: DemoState; dispatch: React.Dispatch<Action> };
const DemoContext = React.createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, seed);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as DemoState;
        if (saved.version === seed.version) dispatch({ type: "hydrate", state: saved });
      }
    } catch {}
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state, ready]);

  // Keep multiple tabs (e.g. dashboard + checkout) in sync.
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try { dispatch({ type: "hydrate", state: JSON.parse(e.newValue) }); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-sidebar">
        <span className="size-8 animate-pulse rounded-xl bg-brand text-brand-foreground" />
      </div>
    );
  }
  return <DemoContext.Provider value={{ state, dispatch }}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = React.useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}

/* ---------- selectors ---------- */

/** Subtotal before SST */
export const invoiceTotal = (items: InvoiceItem[]) => items.reduce((s, i) => s + i.qty * i.unit, 0);
const round2 = (n: number) => Math.round(n * 100) / 100;
export const invoiceTax = (inv: Pick<Invoice, "items" | "tax">) => round2(invoiceTotal(inv.items) * TAX[inv.tax].rate);
/** Grand total including SST */
export const invoiceGrand = (inv: Pick<Invoice, "items" | "tax">) => round2(invoiceTotal(inv.items) + invoiceTax(inv));
export const invoicePaid = (inv: Invoice) =>
  inv.status === "paid" ? invoiceGrand(inv) : round2((inv.plan ?? []).filter((p) => p.paidAt).reduce((a, p) => a + p.amount, 0));
export const invoiceBalance = (inv: Invoice) => (inv.status === "void" ? 0 : round2(invoiceGrand(inv) - invoicePaid(inv)));
export const nextInstallment = (inv: Invoice) => inv.plan?.find((p) => !p.paidAt);

/** Due date that matters right now: the next unpaid instalment, or the invoice due date */
export const currentDue = (inv: Invoice) => nextInstallment(inv)?.dueAt ?? inv.dueAt;

export function isOverdue(inv: Invoice) {
  // Overdue only once the due *date* has passed (an instalment due today is not late yet).
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const due = new Date(currentDue(inv));
  due.setHours(0, 0, 0, 0);
  return (inv.status === "open" || inv.status === "partial") && due.getTime() < startOfToday.getTime();
}

export function metrics(s: DemoState) {
  const paidOrders = s.orders.filter((o) => o.status === "paid");
  const invoicePayments = s.invoices.flatMap((i) =>
    i.plan ? i.plan.filter((p) => p.paidAt).map((p) => ({ at: p.paidAt!, amount: p.amount })) : i.status === "paid" ? [{ at: i.paidAt ?? i.createdAt, amount: invoiceGrand(i) }] : []
  );
  const gross = paidOrders.reduce((a, o) => a + o.amount, 0) + invoicePayments.reduce((a, p) => a + p.amount, 0);
  const txCount = paidOrders.length + invoicePayments.length;
  const fees = gross * FEE_RATE + txCount * FEE_FIXED;
  const paidOut = s.payouts.reduce((a, p) => a + p.amount, 0);
  const balance = Math.max(0, gross - fees - paidOut);

  // last 6 months revenue
  const ref = new Date();
  const months = Array.from({ length: 6 }).map((_, i) => {
    const dt = new Date(ref.getFullYear(), ref.getMonth() - (5 - i), 1);
    return { key: `${dt.getFullYear()}-${dt.getMonth()}`, label: dt.toLocaleString("en-GB", { month: "short" }), value: 0 };
  });
  const bump = (iso: string, amt: number) => {
    const dt = new Date(iso);
    const m = months.find((x) => x.key === `${dt.getFullYear()}-${dt.getMonth()}`);
    if (m) m.value += amt;
  };
  paidOrders.forEach((o) => bump(o.createdAt, o.amount));
  invoicePayments.forEach((p) => bump(p.at, p.amount));

  const active = s.subscriptions.filter((x) => x.status === "active");
  const mrr = active.reduce((a, sub) => {
    const p = s.products.find((x) => x.id === sub.productId);
    if (!p) return a;
    return a + (p.interval === "year" ? p.price / 12 : p.price);
  }, 0);

  const outstanding = s.invoices.filter((i) => i.status === "open" || i.status === "partial").reduce((a, i) => a + invoiceBalance(i), 0);
  return { gross, fees, balance, months, mrr, activeSubs: active.length, outstanding, paidOut };
}

/* ---------- formatting (fixed locale so output is stable) ---------- */

/** Ringgit, e.g. RM1,290 (whole) or RM1,290.50 */
export const money = (n: number) =>
  new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 }).format(n);
export const money2 = (n: number) => new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", minimumFractionDigits: 2 }).format(n);
export const date = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");
/** Malaysian numeric date, e.g. 18/11/2026 */
export const dmy = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—");
export const shortDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—");

export function ago(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return shortDate(iso);
}

export const initials = (name: string) => name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
export const price = (p: Product) => `${money(p.price)}${p.interval ? ` / ${p.interval === "year" ? "yr" : "mo"}` : ""}`;
