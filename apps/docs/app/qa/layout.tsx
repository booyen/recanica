export const metadata = { title: { default: "Component QA", template: "%s · QA" }, robots: { index: false } };

export default function QALayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-background">{children}</div>;
}
