import { cn } from "@recanica/ui/lib/utils";

/** Recanica mark: a framed doorway with a point of focus. currentColor, so it follows light/dark. */
export function RecanicaMark({ className, title = "Recanica" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 40 48" fill="none" role="img" aria-label={title} className={cn("h-6 w-auto shrink-0", className)}>
      <rect x="2" y="2" width="36" height="44" rx="7" stroke="currentColor" strokeWidth="3" />
      <path d="M9.5 46V21a10.5 10.5 0 0 1 21 0v25" stroke="currentColor" strokeWidth="3" />
      <circle cx="20" cy="30.5" r="5" fill="currentColor" />
    </svg>
  );
}

/** Horizontal lockup: mark + lowercase monospace wordmark. */
export function RecanicaLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <RecanicaMark className="h-6" title="" />
      <span className="font-mono text-[17px] leading-none tracking-tight">recanica</span>
      <span className="sr-only">Recanica</span>
    </span>
  );
}
