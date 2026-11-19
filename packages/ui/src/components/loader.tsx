"use client"

import * as React from "react"
import { cn } from "@recanica/ui/lib/utils"

/**
 * Loader — shows the project's logo while something loads.
 *
 * Logo, in order of preference:
 *   1. the `logo` prop
 *   2. the project logo set once with <LoaderProvider logo={<YourLogo />}> at the app root
 *   3. the Recanica mark
 * Or `logo="shapes"` (or <LoaderProvider logo="shapes">) for a neutral filler of five shapes.
 *
 * Ten animations, all monochrome, transform/opacity only, and still under prefers-reduced-motion.
 */
export const LOADER_ANIMATIONS = ["pulse", "breathe", "spin", "orbit", "bounce", "flip", "reveal", "ring", "ripple", "sway"] as const
export type LoaderAnimation = (typeof LOADER_ANIMATIONS)[number]

type LoaderLogo = React.ReactNode | "shapes"
const LoaderContext = React.createContext<{ logo?: LoaderLogo; animation?: LoaderAnimation }>({})

function LoaderProvider({ logo, animation, children }: { logo?: LoaderLogo; animation?: LoaderAnimation; children: React.ReactNode }) {
  const value = React.useMemo(() => ({ logo, animation }), [logo, animation])
  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
}

/** Recanica mark: the default when a project hasn't set its own logo. */
function RecanicaMark(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 40 48" fill="none" aria-hidden {...props}>
      <rect x="2" y="2" width="36" height="44" rx="7" stroke="currentColor" strokeWidth="3" />
      <path d="M9.5 46V21a10.5 10.5 0 0 1 21 0v25" stroke="currentColor" strokeWidth="3" />
      <circle cx="20" cy="30.5" r="5" fill="currentColor" />
    </svg>
  )
}

/** Five neutral shapes: circle, square, triangle, diamond, pill. Animated as a staggered wave. */
function LoaderShapes({ animation }: { animation: LoaderAnimation }) {
  const shapes = [
    <circle key="c" cx="6" cy="6" r="5" />,
    <rect key="s" x="1" y="1" width="10" height="10" rx="2" />,
    <path key="t" d="M6 1.5 11 10.5H1Z" />,
    <path key="d" d="M6 .8 11.2 6 6 11.2.8 6Z" />,
    <rect key="p" x="1" y="3.5" width="10" height="5" rx="2.5" />,
  ]
  const anim = animation === "breathe" || animation === "pulse" || animation === "flip" || animation === "sway" ? animClass[animation] : "animate-loader-wave"
  return (
    <span className="flex items-center gap-[12%]">
      {shapes.map((s, i) => (
        <svg key={i} viewBox="0 0 12 12" fill="currentColor" aria-hidden data-loader-motion className={cn("size-[16%] shrink-0", anim)} style={{ animationDelay: `${i * 0.12}s` }}>
          {s}
        </svg>
      ))}
    </span>
  )
}

const animClass: Record<LoaderAnimation, string> = {
  pulse: "animate-loader-pulse",
  breathe: "animate-loader-breathe",
  spin: "animate-loader-spin",
  orbit: "",
  bounce: "animate-loader-bounce",
  flip: "animate-loader-flip",
  reveal: "animate-loader-reveal",
  ring: "",
  ripple: "",
  sway: "animate-loader-sway",
}

const sizes = { sm: "size-6", md: "size-10", lg: "size-16", xl: "size-24" } as const

function Loader({
  logo,
  animation,
  size = "md",
  label = "Loading",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  logo?: LoaderLogo
  animation?: LoaderAnimation
  size?: keyof typeof sizes
  /** Announced to screen readers. */
  label?: string
}) {
  const ctx = React.useContext(LoaderContext)
  const chosen = logo ?? ctx.logo
  const anim = animation ?? ctx.animation ?? "pulse"
  const isShapes = chosen === "shapes"
  const mark = isShapes ? null : chosen ?? <RecanicaMark className="h-full w-auto" />

  return (
    <div
      role="status"
      aria-live="polite"
      data-slot="loader"
      data-animation={anim}
      className={cn("relative inline-flex shrink-0 items-center justify-center text-foreground", sizes[size], className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {isShapes ? (
        <LoaderShapes animation={anim} />
      ) : (
        <>
          {anim === "ripple" && <span data-loader-motion className="absolute inset-0 animate-loader-ripple rounded-full border border-foreground/40" aria-hidden />}
          {anim === "ring" && (
            <svg viewBox="0 0 40 40" className="absolute inset-0 size-full -rotate-90" aria-hidden>
              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
              <circle data-loader-motion cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" pathLength={100} strokeDasharray="25 100" className="animate-loader-ring" />
            </svg>
          )}
          {anim === "orbit" && (
            <span data-loader-motion className="absolute inset-0 animate-loader-orbit" aria-hidden>
              <span className="absolute top-0 left-1/2 size-[12%] -translate-x-1/2 rounded-full bg-foreground" />
            </span>
          )}
          {/* Everything stays inside the loader's box: animations with an outer track shrink the mark instead of spilling out. */}
          <span data-loader-motion className={cn("flex items-center justify-center [&>*]:max-h-full [&>*]:max-w-full", anim === "ring" || anim === "orbit" || anim === "ripple" ? "size-[50%]" : "size-[70%]", animClass[anim])}>
            {mark}
          </span>
        </>
      )}
    </div>
  )
}

/** Full-area loading state: centred loader with an optional line of text. */
function LoaderOverlay({ text, className, ...props }: React.ComponentProps<typeof Loader> & { text?: string }) {
  return (
    <div data-slot="loader-overlay" className={cn("flex min-h-40 w-full flex-col items-center justify-center gap-4", className)}>
      <Loader size="lg" {...props} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export { Loader, LoaderOverlay, LoaderProvider }
