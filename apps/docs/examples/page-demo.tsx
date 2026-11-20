"use client";

import { Button } from "@recanica/ui/components/button";
import { Page, PageHeader, ReferenceTable, Section, Stack } from "@recanica/ui/components/page";

export default function PageDemo() {
  return (
    <Page width="reading" className="w-full">
      <PageHeader eyebrow="Billing" title="Invoices" description="Bill customers and track what you're owed." actions={<Button>New invoice</Button>} />
      <Section title="Rhythm" description="The page owns spacing between blocks; nothing here sets its own margin.">
        <ReferenceTable
          head={["Role", "Token", "Used for"]}
          rows={[
            ["group", "--spacing-group", "Heading → its content, label → field"],
            ["flow", "--spacing-flow", "Between blocks in a column"],
            ["stack", "--spacing-stack", "Between sections"],
          ]}
        />
      </Section>
      <Section title="Stack" description="Rhythm for anything that isn't a page column.">
        <Stack gap="group">
          <div className="h-10 rounded-xl border bg-card" />
          <div className="h-10 rounded-xl border bg-card" />
        </Stack>
      </Section>
    </Page>
  );
}
