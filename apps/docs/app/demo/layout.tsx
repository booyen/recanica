import { DemoProvider } from "@/lib/demo/store";
import { PageMenu } from "@/components/demo/page-menu";

export const metadata = { title: { default: "Demo", template: "%s · Acme Studio demo" } };

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <DemoProvider>{children}<PageMenu /></DemoProvider>;
}
