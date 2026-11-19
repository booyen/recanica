import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { PageMenu } from "@/components/demo/page-menu";

export const metadata = { title: { default: "Sample website", template: "%s · Sample website" } };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <PageMenu />
    </>
  );
}
