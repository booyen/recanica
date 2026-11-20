import * as React from "react"
import { cn } from "@recanica/ui/lib/utils"

/**
 * App shell: page-coloured sidebar next to an inset rounded panel that scrolls on its own (the Polar layout).
 *   <AppShell sidebar={<AppSidebar>…</AppSidebar>}><AppPanel>…page…</AppPanel></AppShell>
 * Sidebar pieces: AppSidebar (column), AppSidebarHeader (logo + actions row), NavItem (rows), AppSidebarSub (nested rows with a rule).
 */
function AppShell({ sidebar, className, children, ...props }: React.ComponentProps<"div"> & { sidebar?: React.ReactNode }) {
  return (
    <div data-slot="app-shell" className={cn("flex h-svh overflow-hidden bg-sidebar text-foreground", className)} {...props}>
      {sidebar}
      {children}
    </div>
  )
}

/** The inset content panel: its frame stays put, only the content scrolls. */
function AppPanel({ className, ...props }: React.ComponentProps<"main">) {
  return <main data-slot="app-panel" className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-2xl border bg-panel", className)} {...props} />
}

function AppSidebar({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="app-sidebar" className={cn("flex h-full flex-col gap-1 p-3", className)} {...props} />
}

function AppSidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="app-sidebar-header" className={cn("mb-4 flex items-center justify-between px-2 py-1", className)} {...props} />
}

function AppSidebarSub({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="app-sidebar-sub" className={cn("my-1 ml-5 flex flex-col border-l pl-3", className)} {...props} />
}

export { AppShell, AppPanel, AppSidebar, AppSidebarHeader, AppSidebarSub }
