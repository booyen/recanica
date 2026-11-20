import { DemoProvider } from "@/lib/demo/store";
import { PageMenu } from "@/components/demo/page-menu";
import { LoaderProvider } from "@recanica/ui/components/loader";

export const metadata = { title: { default: "Demo", template: "%s · Acme Studio demo" } };

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  // The demo company's logo becomes the default for every <Loader /> in the demo.
  return (
    <LoaderProvider logo={<span className="block aspect-square h-full rounded-[28%] bg-brand" /* recanica-ignore: the demo company's logo shape */ />}>
      <DemoProvider>{children}<PageMenu /></DemoProvider>
    </LoaderProvider>
  );
}
