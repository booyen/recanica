"use client";

import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@rekanica/ui/components/alert";

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-lg gap-3 text-left">
      <Alert><CheckCircle2Icon /><AlertTitle>Payout scheduled</AlertTitle><AlertDescription>$1,206 will arrive on 1 December.</AlertDescription></Alert>
      <Alert variant="destructive"><AlertCircleIcon /><AlertTitle>Payment failed</AlertTitle><AlertDescription>Update your card to keep your subscription active.</AlertDescription></Alert>
    </div>
  );
}
