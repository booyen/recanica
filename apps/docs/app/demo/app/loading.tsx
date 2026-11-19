import { LoaderOverlay } from "@recanica/ui/components/loader";

// Shown while a dashboard page loads: the project's logo (set by LoaderProvider in app/demo/layout.tsx).
export default function Loading() {
  return <LoaderOverlay text="Loading" className="min-h-[50svh]" />;
}
