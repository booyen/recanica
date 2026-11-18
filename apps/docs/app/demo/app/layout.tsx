import { DemoShell } from "@/components/demo/shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
