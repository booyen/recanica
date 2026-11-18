"use client";

import { FileTextIcon, XIcon } from "lucide-react";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle } from "@rekanica/ui/components/attachment";

export default function AttachmentDemo() {
  return (
    <AttachmentGroup className="w-full max-w-md">
      {[["invoice-0042.pdf", "PDF · 182 KB"], ["contract.pdf", "PDF · 1.2 MB"]].map(([name, meta]) => (
        <Attachment key={name}>
          <AttachmentMedia><FileTextIcon /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{name}</AttachmentTitle>
            <AttachmentDescription>{meta}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions><AttachmentAction aria-label="Remove"><XIcon /></AttachmentAction></AttachmentActions>
        </Attachment>
      ))}
    </AttachmentGroup>
  );
}
