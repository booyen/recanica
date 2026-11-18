"use client";

import { Button } from "@rekanica/ui/components/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@rekanica/ui/components/dialog";
import { Field, FieldLabel } from "@rekanica/ui/components/field";
import { Input } from "@rekanica/ui/components/input";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Invite teammate</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite teammate</DialogTitle>
          <DialogDescription>They'll get access to this organization.</DialogDescription>
        </DialogHeader>
        <Field><FieldLabel htmlFor="dlg-email">Email</FieldLabel><Input id="dlg-email" placeholder="name@company.example" /></Field>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
          <Button>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
