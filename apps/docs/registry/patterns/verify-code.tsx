"use client";

import * as React from "react";
import { MailIcon } from "lucide-react";
import { Button } from "@recanica/ui/components/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@recanica/ui/components/input-otp";

export default function VerifyCode() {
  const [code, setCode] = React.useState("");
  const [seconds, setSeconds] = React.useState(30);
  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-gutter py-12">
      <div className="w-full max-w-sm space-y-6 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full border bg-muted"><MailIcon className="size-5" /></span>
        <div className="space-y-1">
          <h1 className="text-title">Check your email</h1>
          <p className="text-sm text-muted-foreground">We sent a 6-digit code to <span className="text-foreground">nadia@example.com</span></p>
        </div>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode} autoFocus>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} className="size-11 text-base sm:size-12" />)}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button className="w-full" disabled={code.length < 6}>Verify</Button>
        <p className="text-sm text-muted-foreground">
          Didn't get it?{" "}
          {seconds > 0 ? (
            <span className="tabular-nums">Resend in {seconds}s</span>
          ) : (
            <button className="text-foreground underline-offset-4 hover:underline" onClick={() => setSeconds(30)}>Resend code</button>
          )}
        </p>
      </div>
    </div>
  );
}
