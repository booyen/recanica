"use client";

import { Button } from "@rekanica/ui/components/button";
import { Checkbox } from "@rekanica/ui/components/checkbox";
import { Field, FieldLabel } from "@rekanica/ui/components/field";
import { Input } from "@rekanica/ui/components/input";
import { Label } from "@rekanica/ui/components/label";

export function Login01() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-sidebar p-10 lg:flex">
        <a href="#" className="flex items-center gap-2"><span className="size-6 rounded-md bg-metallic" /><span>Acme</span></a>
        <blockquote className="max-w-md space-y-3">
          <p className="text-heading">“The first billing tool our accountant didn&apos;t complain about.”</p>
          <footer className="text-sm text-muted-foreground">Tan Wei Ming, Northwind Trading</footer>
        </blockquote>
      </div>
      <div className="flex items-center justify-center px-gutter py-12">
        <form className="w-full max-w-sm space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <h1 className="text-title">Sign in</h1>
            <p className="text-sm text-muted-foreground">New here? <a href="#" className="text-foreground underline-offset-4 hover:underline">Create an account</a></p>
          </div>
          <Field><FieldLabel htmlFor="l-email">Email</FieldLabel><Input id="l-email" type="email" autoComplete="email" required /></Field>
          <Field>
            <div className="flex items-center justify-between"><FieldLabel htmlFor="l-pass">Password</FieldLabel><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Forgot password?</a></div>
            <Input id="l-pass" type="password" autoComplete="current-password" required />
          </Field>
          <div className="flex items-center gap-2"><Checkbox id="l-remember" /><Label htmlFor="l-remember" className="font-normal">Keep me signed in</Label></div>
          <Button type="submit" className="w-full">Sign in</Button>
          <Button type="button" variant="outline" className="w-full">Continue with Google</Button>
        </form>
      </div>
    </div>
  );
}

export default Login01;
