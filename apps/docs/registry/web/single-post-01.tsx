"use client";

import { CopyIcon, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@rekanica/ui/components/button";

const toc = [["who", "Who needs to comply"], ["when", "Key dates"], ["how", "How validation works"], ["checklist", "A short checklist"]];

export function SinglePost01() {
  return (
    <article className="px-gutter py-section-sm">
      <div className="mx-auto grid max-w-content gap-10 lg:grid-cols-[1fr_minmax(0,40rem)_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-6 space-y-2 text-sm" aria-label="On this page">
            <p className="text-muted-foreground">On this page</p>
            {toc.map(([id, t]) => <a key={id} href={`#${id}`} className="block text-muted-foreground hover:text-foreground">{t}</a>)}
          </nav>
        </aside>
        <div className="space-y-6 leading-7 [&_h2]:scroll-mt-6 [&_h2]:pt-6 [&_h2]:text-heading [&_p]:text-muted-foreground">
          <p className="text-lg text-foreground">If you issue invoices in Malaysia, you&apos;ll need to send them through LHDN&apos;s MyInvois system. Here&apos;s what that means in practice.</p>
          <h2 id="who">Who needs to comply</h2>
          <p>All businesses are being phased in by annual turnover. Smaller businesses come last, but the requirements are the same: every invoice gets a unique ID and is validated before your customer sees it.</p>
          <h2 id="when">Key dates</h2>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Check your phase on the LHDN website using your turnover for the last audited year.</li>
            <li>Plan for a short test period before your deadline.</li>
          </ul>
          <h2 id="how">How validation works</h2>
          <p>When you send an invoice, it&apos;s submitted to MyInvois. LHDN checks the format and the tax IDs, then returns a UUID and a QR code that you print on the invoice.</p>
          <blockquote className="border-l-2 pl-4 text-foreground">If a validated invoice is wrong, cancel it within 72 hours or issue a credit note.</blockquote>
          <h2 id="checklist">A short checklist</h2>
          <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
            <li>Collect your customers&apos; TIN and registration numbers.</li>
            <li>Make sure your invoice software can submit to MyInvois.</li>
            <li>Tell customers the invoice will now include a QR code.</li>
          </ol>
          <div className="flex flex-wrap items-center gap-2 border-t pt-6">
            <span className="text-sm text-muted-foreground">Share</span>
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard?.writeText(location.href).catch(() => {}); toast("Link copied"); }}><LinkIcon /> Copy link</Button>
            <Button variant="ghost" size="sm"><CopyIcon /> Cite</Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default SinglePost01;
