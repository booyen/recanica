"use client";

import * as React from "react";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@recanica/ui/components/alert-dialog";
import { Button } from "@recanica/ui/components/button";
import { Field, FieldLabel } from "@recanica/ui/components/field";
import { Input } from "@recanica/ui/components/input";
import { Heading } from "@recanica/ui/components/page";

const NAME = "acme-studio";

function Row({ title, body, action }: { title: string; body: string; action: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-sm">{title}</p><p className="text-sm text-muted-foreground">{body}</p></div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

export default function DangerZone() {
  const [value, setValue] = React.useState("");
  return (
    <div className="mx-auto max-w-narrow space-y-4 px-gutter py-8">
      <Heading level={2}>Danger zone</Heading>
      <div className="divide-y rounded-2xl border border-destructive/40">
        <Row title="Transfer ownership" body="Move this organization to another member." action={<Button variant="outline">Transfer</Button>} />
        <Row
          title="Delete organization"
          body="Permanently delete all products, customers and data."
          action={
            <AlertDialog onOpenChange={() => setValue("")}>
              <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete organization?</AlertDialogTitle>
                  <AlertDialogDescription>This cannot be undone. Active subscriptions will be canceled immediately.</AlertDialogDescription>
                </AlertDialogHeader>
                <Field>
                  <FieldLabel htmlFor="confirm">Type <span className="font-mono text-foreground">{NAME}</span> to confirm</FieldLabel>
                  <Input id="confirm" value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" />
                </Field>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive" disabled={value !== NAME}>Delete organization</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          }
        />
      </div>
    </div>
  );
}
