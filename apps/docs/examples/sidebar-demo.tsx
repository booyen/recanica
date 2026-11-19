"use client";

import { BoxIcon, LayoutGridIcon, SlidersHorizontalIcon, UsersIcon } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@recanica/ui/components/sidebar";

const items = [
  { title: "Overview", icon: LayoutGridIcon, active: true },
  { title: "Products", icon: BoxIcon },
  { title: "Customers", icon: UsersIcon, badge: "12" },
  { title: "Settings", icon: SlidersHorizontalIcon },
];

// Static preview of the sidebar menu primitives. See the App Sidebar pattern
// for the full responsive sidebar (collapses to a sheet on mobile).
export default function SidebarDemo() {
  return (
    <SidebarProvider className="min-h-0 w-auto">
      <div className="w-60 rounded-2xl border bg-sidebar p-2 text-left">
        <SidebarGroup>
          <SidebarGroupLabel>Acme Studio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((i) => (
                <SidebarMenuItem key={i.title}>
                  <SidebarMenuButton isActive={i.active}><i.icon /> {i.title}</SidebarMenuButton>
                  {i.badge && <SidebarMenuBadge>{i.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </SidebarProvider>
  );
}
