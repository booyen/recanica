/** URL/anchor slug: "Data display" → "data-display", "Announcement & Promo" → "announcement-promo". */
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** URL slug for a component category in the demo UI kit (/demo/app/ui/<slug>). */
export const kitSlug = slugify;
