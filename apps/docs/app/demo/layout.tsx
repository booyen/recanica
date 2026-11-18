import { DemoProvider } from "@/lib/demo/store";

export const metadata = { title: { default: "Demo", template: "%s · Acme Studio demo" } };

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <DemoProvider>{children}</DemoProvider>;
}
