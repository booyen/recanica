export type Interval = "month" | "year";
export type ProductType = "recurring" | "one-time";

export type Address = { line1: string; line2?: string; postcode: string; city: string; state: string };

export type Org = {
  name: string;
  legalName: string;
  slug: string;
  email: string;
  phone: string;
  currency: "MYR";
  /** SSM registration number (new 12-digit format + old format in brackets) */
  brn: string;
  /** LHDN tax identification number */
  tin: string;
  /** SST registration number, empty if not registered */
  sstNo: string;
  /** Malaysia Standard Industrial Classification code + description (required for e-Invoice) */
  msic: string;
  msicDesc: string;
  address: Address;
  bank: { name: string; account: string; holder: string };
  duitnowId: string;
  /** Submit invoices to LHDN MyInvois when sent */
  einvoice: boolean;
  defaultTax: TaxCode;
  payoutConnected: boolean;
  notify: { orders: boolean; cancellations: boolean; weekly: boolean };
};

export type Product = {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  price: number;
  interval: Interval | null;
  benefits: string[];
  archived: boolean;
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  country: string;
  createdAt: string;
  kind?: "business" | "individual";
  /** LHDN TIN. Individuals without one use the general public TIN EI00000000010; foreign buyers EI00000000020. */
  tin?: string;
  /** SSM BRN for businesses, MyKad / passport number for individuals */
  regNo?: string;
  phone?: string;
  address?: Address;
};

export type Order = {
  id: string;
  customerId: string;
  productId: string;
  amount: number;
  status: "paid" | "refunded";
  linkId?: string;
  createdAt: string;
};

export type Subscription = {
  id: string;
  customerId: string;
  productId: string;
  status: "active" | "canceled";
  startedAt: string;
  renewsAt: string;
};

export type InvoiceItem = { description: string; qty: number; unit: number };
export type TaxCode = "none" | "service-8" | "sales-10" | "sales-5";
export type InvoiceStatus = "draft" | "open" | "partial" | "paid" | "void";

/** One step of a payment plan. Amounts are tax-inclusive. */
export type Installment = { id: string; label: string; amount: number; dueAt: string; paidAt?: string; method?: string };

/** LHDN MyInvois submission (simulated in the demo) */
export type EInvoice = { uuid: string; longId: string; status: "submitted" | "valid"; submittedAt: string; validatedAt?: string };

export type Invoice = {
  id: string;
  number: string;
  customerId: string;
  items: InvoiceItem[];
  tax: TaxCode;
  status: InvoiceStatus;
  createdAt: string;
  issuedAt?: string;
  dueAt: string;
  paidAt?: string;
  notes: string;
  /** Payment plan. When absent, the invoice is paid in one go. */
  plan?: Installment[];
  einvoice?: EInvoice;
  paidMethod?: string;
};

export type CheckoutLink = { id: string; label: string; productId: string; active: boolean; visits: number; createdAt: string };

export type EventType = "order" | "refund" | "customer" | "subscription_canceled" | "invoice_sent" | "invoice_paid" | "payout" | "product";
export type DemoEvent = { id: string; type: EventType; title: string; who?: string; at: string; href?: string };

export type Payout = { id: string; amount: number; status: "paid" | "in_transit"; at: string };

export type DemoState = {
  version: number;
  signedIn: boolean;
  user: { name: string; email: string };
  org: Org;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  links: CheckoutLink[];
  events: DemoEvent[];
  payouts: Payout[];
};
