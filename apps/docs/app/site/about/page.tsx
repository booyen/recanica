import { Timeline01 } from "@/registry/web/timeline-01";
import { Team01 } from "@/registry/web/team-01";
import { Gallery01 } from "@/registry/web/gallery-01";
import { Cta02 } from "@/registry/web/cta-02";

export const metadata = { title: "About" };

export default function Page() {
  return (
    <>
      <Timeline01 titleAs="h1" />
      <Team01 />
      <Gallery01 />
      <Cta02 />
    </>
  );
}
