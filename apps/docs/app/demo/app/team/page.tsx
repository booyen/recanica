"use client";

import * as React from "react";
import { MoreHorizontalIcon, UserPlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@rekanica/ui/components/avatar";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@rekanica/ui/components/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@rekanica/ui/components/dropdown-menu";
import { Field, FieldLabel } from "@rekanica/ui/components/field";
import { Input } from "@rekanica/ui/components/input";
import { NativeSelect, NativeSelectOption } from "@rekanica/ui/components/native-select";
import { PageHeader, Section } from "@/components/demo/ui";
import { initials } from "@/lib/demo/store";

type Role = "Owner" | "Admin" | "Finance" | "Viewer";
const ROLES: Record<Role, string> = {
  Owner: "Everything, including billing and deleting the organization.",
  Admin: "Manage products, customers, invoices and team. No billing.",
  Finance: "Invoices, payouts and reports. Can't change products.",
  Viewer: "Read-only access to everything.",
};

export default function TeamPage() {
  const [members, setMembers] = React.useState([
    { name: "Nadia Rahman", email: "nadia@acme.example", role: "Owner" as Role, status: "Active" },
    { name: "Tan Wei Ming", email: "weiming@acme.example", role: "Admin" as Role, status: "Active" },
    { name: "Hana Lee", email: "hana@acme.example", role: "Finance" as Role, status: "Active" },
    { name: "Arjun Mehta", email: "arjun@acme.example", role: "Viewer" as Role, status: "Invited" },
  ]);
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Role>("Viewer");
  return (
    <>
      <PageHeader title="Team" description={`${members.length} members`} actions={<Button onClick={() => setOpen(true)}><UserPlusIcon /> Invite</Button>} />
      <ul className="divide-y rounded-2xl border bg-card">
        {members.map((m, i) => (
          <li key={m.email} className="flex flex-wrap items-center gap-3 p-4">
            <Avatar><AvatarFallback>{initials(m.name)}</AvatarFallback></Avatar>
            <div className="min-w-0 flex-1 text-sm"><p className="truncate">{m.name}</p><p className="truncate text-muted-foreground">{m.email}</p></div>
            {m.status === "Invited" && <Badge variant="warning">Invited</Badge>}
            <NativeSelect aria-label={`Role for ${m.name}`} value={m.role} disabled={m.role === "Owner"} className="w-32" onChange={(e) => { setMembers((x) => x.map((y, j) => (j === i ? { ...y, role: e.target.value as Role } : y))); toast(`${m.name} is now ${e.target.value}`); }}>
              {(Object.keys(ROLES) as Role[]).map((r) => <NativeSelectOption key={r} value={r} disabled={r === "Owner"}>{r}</NativeSelectOption>)}
            </NativeSelect>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Member actions" disabled={m.role === "Owner"}><MoreHorizontalIcon /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {m.status === "Invited" && <DropdownMenuItem onSelect={() => toast("Invite resent")}>Resend invite</DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => { setMembers((x) => x.filter((_, j) => j !== i)); toast(`${m.name} removed`); }}>Remove</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
      <Section title="Roles">
        <dl className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
          {(Object.entries(ROLES) as [Role, string][]).map(([r, d]) => <div key={r} className="bg-card p-5"><dt>{r}</dt><dd className="mt-1 text-sm text-muted-foreground">{d}</dd></div>)}
        </dl>
      </Section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); setMembers((x) => [...x, { name: email.split("@")[0], email, role, status: "Invited" }]); toast.success("Invite sent", { description: email }); setEmail(""); setOpen(false); }}>
            <DialogHeader><DialogTitle>Invite a teammate</DialogTitle><DialogDescription>They get an email with a link that expires in 7 days.</DialogDescription></DialogHeader>
            <Field><FieldLabel htmlFor="inv-email">Email</FieldLabel><Input id="inv-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field><FieldLabel htmlFor="inv-role">Role</FieldLabel>
              <NativeSelect id="inv-role" className="w-full" value={role} onChange={(e) => setRole(e.target.value as Role)}>{(["Admin", "Finance", "Viewer"] as Role[]).map((r) => <NativeSelectOption key={r}>{r}</NativeSelectOption>)}</NativeSelect>
              <p className="text-xs text-muted-foreground">{ROLES[role]}</p>
            </Field>
            <DialogFooter><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Send invite</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
