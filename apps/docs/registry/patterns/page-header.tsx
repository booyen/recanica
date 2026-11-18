"use client";

import { DownloadIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@rekanica/ui/components/breadcrumb";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@rekanica/ui/components/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@rekanica/ui/components/tabs";

export default function PageHeader() {
  return (
    <div className="mx-auto max-w-content px-gutter py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#">Products</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Catalogue</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-title">Catalogue</h1>
            <Badge variant="muted">24</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Products, prices and the benefits they grant.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:inline-flex"><DownloadIcon /> Export</Button>
          <Button className="flex-1 sm:flex-none"><PlusIcon /> New product</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More actions"><MoreHorizontalIcon /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="sm:hidden"><DownloadIcon /> Export</DropdownMenuItem>
              <DropdownMenuItem>Import CSV</DropdownMenuItem>
              <DropdownMenuItem>View archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="one-time">One-time</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
