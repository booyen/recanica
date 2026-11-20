"use client";

import { Button } from "@recanica/ui/components/button";
import { Field, FieldLabel } from "@recanica/ui/components/field";
import { Input } from "@recanica/ui/components/input";
import { Separator } from "@recanica/ui/components/separator";
import { Heading } from "@recanica/ui/components/page";
import { CenteredPage } from "@recanica/ui/components/layout";

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function SignIn() {
  return (
    <CenteredPage>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="size-9 rounded-xl bg-brand text-brand-foreground" />
          <Heading level={1}>Welcome back</Heading>
          <p className="text-sm text-muted-foreground">Sign in to your Aturanica account.</p>
        </div>
        <div className="grid gap-2">
          <Button variant="outline" className="w-full"><GitHubMark /> Continue with GitHub</Button>
          <Button variant="outline" className="w-full">Continue with Google</Button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Separator className="flex-1" /> or <Separator className="flex-1" />
        </div>
        <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
          <Field><FieldLabel htmlFor="si-email">Email</FieldLabel><Input id="si-email" type="email" placeholder="name@company.example" autoComplete="email" /></Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="si-pass">Password</FieldLabel>
              <a href="/demo/sign-in" className="text-sm text-muted-foreground hover:text-foreground">Forgot?</a>
            </div>
            <Input id="si-pass" type="password" autoComplete="current-password" />
          </Field>
          <Button type="submit" variant="brand" className="w-full">Sign in</Button>
          <Button type="button" variant="ghost" className="w-full">Email me a sign-in link</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          No account? <a href="/demo/sign-in" className="text-foreground underline-offset-4 hover:underline">Create one</a>
        </p>
      </div>
    </CenteredPage>
  );
}
