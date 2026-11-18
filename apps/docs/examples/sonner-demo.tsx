"use client";

import { toast } from "sonner";
import { Button } from "@rekanica/ui/components/button";

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="outline" onClick={() => toast("Checkout link created", { description: "Copied to clipboard." })}>Default</Button>
      <Button variant="outline" onClick={() => toast.success("Payout sent")}>Success</Button>
      <Button variant="outline" onClick={() => toast.error("Payment failed")}>Error</Button>
      <Button variant="outline" onClick={() => toast("Product archived", { action: { label: "Undo", onClick: () => {} } })}>With action</Button>
    </div>
  );
}
