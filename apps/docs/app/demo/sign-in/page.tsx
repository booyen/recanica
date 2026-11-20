"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@recanica/ui/components/button";
import { Field, FieldLabel } from "@recanica/ui/components/field";
import { Input } from "@recanica/ui/components/input";
import { Spinner } from "@recanica/ui/components/spinner";
import { useDemo } from "@/lib/demo/store";
import { Heading } from "@recanica/ui/components/page";
import { CenteredPage } from "@recanica/ui/components/layout";

export default function SignInPage() {
  const { state, dispatch } = useDemo();
  const router = useRouter();
  const [email, setEmail] = React.useState(state.user.email);
  const [busy, setBusy] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      dispatch({ type: "signIn", email });
      router.push("/demo/app");
    }, 700);
  };

  return (
    <CenteredPage>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="size-9 rounded-xl bg-brand text-brand-foreground" />
          <Heading level={1}>Sign in to Acme Studio</Heading>
          <p className="text-sm text-muted-foreground">Demo account. Any password works.</p>
        </div>
        <form className="grid gap-4" onSubmit={submit}>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" defaultValue="demo-password" autoComplete="off" />
          </Field>
          <Button type="submit" variant="brand" className="w-full" disabled={busy}>
            {busy && <Spinner />} {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground"><Link href="/demo" className="hover:text-foreground">← Demo home</Link></p>
      </div>
    </CenteredPage>
  );
}
