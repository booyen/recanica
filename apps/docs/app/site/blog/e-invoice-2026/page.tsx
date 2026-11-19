import { PostHero01 } from "@/registry/web/post-hero-01";
import { SinglePost01 } from "@/registry/web/single-post-01";
import { Cta02 } from "@/registry/web/cta-02";

export const metadata = { title: "Blog post" };

export default function Page() {
  return (
    <>
      <PostHero01 />
      <SinglePost01 />
      <Cta02 />
    </>
  );
}
