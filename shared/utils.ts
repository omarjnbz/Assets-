// Stand-in for shadcn's lib/utils, used only when building previews (no clsx / tailwind-merge needed).
export function cn(...a: unknown[]): string {
  return a.flat(Infinity).filter(Boolean).join(" ")
}
