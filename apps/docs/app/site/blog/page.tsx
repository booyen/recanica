import { Blog01 } from "@/registry/web/blog-01";
import { Cta02 } from "@/registry/web/cta-02";

export const metadata = { title: "Blog" };

export default function Page() {
  return (
    <>
      <Blog01 />
      <Cta02 />
    </>
  );
}
