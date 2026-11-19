"use client";

import { Button } from "@recanica/ui/components/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@recanica/ui/components/sheet";
import { Field, FieldLabel } from "@recanica/ui/components/field";
import { Input } from "@recanica/ui/components/input";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Edit customer</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit customer</SheetTitle>
          <SheetDescription>Changes apply to future invoices.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <Field><FieldLabel htmlFor="sh-name">Name</FieldLabel><Input id="sh-name" defaultValue="Nadia Rahman" /></Field>
          <Field><FieldLabel htmlFor="sh-email">Email</FieldLabel><Input id="sh-email" defaultValue="nadia@example.com" /></Field>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
