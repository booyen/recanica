import { tokensCss } from "@/lib/llm";

export const dynamic = "force-static";

export function GET() {
  return new Response(tokensCss() + "\n", { headers: { "content-type": "text/css; charset=utf-8" } });
}
