"use client";

import * as React from "react";
import { FileIcon, FileSpreadsheetIcon, FileTextIcon, FolderIcon, ImageIcon, MoreHorizontalIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@recanica/ui/components/breadcrumb";
import { Button } from "@recanica/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@recanica/ui/components/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@recanica/ui/components/table";
import { PageHeader } from "@/components/demo/ui";

const tree: Record<string, { name: string; kind: "folder" | "pdf" | "sheet" | "image" | "doc"; size?: string; date: string }[]> = {
  "": [
    { name: "Contracts", kind: "folder", date: "15 Nov 2026" }, { name: "Tax 2026", kind: "folder", date: "12 Nov 2026" }, { name: "Brand assets", kind: "folder", date: "1 Oct 2026" },
    { name: "SST-02 Sep–Oct.pdf", kind: "pdf", size: "182 KB", date: "12 Nov 2026" }, { name: "Price list 2027.xlsx", kind: "sheet", size: "48 KB", date: "8 Nov 2026" },
  ],
  Contracts: [{ name: "Maju Jaya website.pdf", kind: "pdf", size: "1.2 MB", date: "1 Oct 2026" }, { name: "Lumen Labs MSA.pdf", kind: "pdf", size: "640 KB", date: "5 Sep 2026" }],
  "Tax 2026": [{ name: "e-Invoice setup notes.docx", kind: "doc", size: "36 KB", date: "14 Nov 2026" }],
  "Brand assets": [{ name: "logo-mark.png", kind: "image", size: "24 KB", date: "1 Oct 2026" }],
};
const icon = { folder: FolderIcon, pdf: FileTextIcon, sheet: FileSpreadsheetIcon, image: ImageIcon, doc: FileIcon };

export default function FilesPage() {
  const [dir, setDir] = React.useState("");
  return (
    <>
      <PageHeader title="Files" description="Contracts, tax documents and brand assets. 2.1 GB of 10 GB used." actions={<Button onClick={() => toast("Upload is simulated in the demo")}><UploadIcon /> Upload</Button>} />
      <Breadcrumb className="mb-4"><BreadcrumbList>
        <BreadcrumbItem>{dir ? <BreadcrumbLink asChild><button onClick={() => setDir("")}>All files</button></BreadcrumbLink> : <BreadcrumbPage>All files</BreadcrumbPage>}</BreadcrumbItem>
        {dir && <><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{dir}</BreadcrumbPage></BreadcrumbItem></>}
      </BreadcrumbList></Breadcrumb>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead className="hidden sm:table-cell">Size</TableHead><TableHead className="hidden md:table-cell">Modified</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
          <TableBody>
            {tree[dir].map((f) => {
              const I = icon[f.kind];
              return (
                <TableRow key={f.name} className={f.kind === "folder" ? "cursor-pointer" : undefined} onClick={() => f.kind === "folder" && setDir(f.name)}>
                  <TableCell><span className="flex items-center gap-3"><I className="size-4 text-muted-foreground" />{f.name}</span></TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">{f.size ?? "—"}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{f.date}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`Actions for ${f.name}`}><MoreHorizontalIcon /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end"><DropdownMenuItem>Download</DropdownMenuItem><DropdownMenuItem>Rename</DropdownMenuItem><DropdownMenuItem variant="destructive">Delete</DropdownMenuItem></DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
