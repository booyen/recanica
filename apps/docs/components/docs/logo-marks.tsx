/**
 * Aturanica Labs logo concepts drawn from Islamic geometric traditions.
 * All marks are monochrome (currentColor), built on a 100×100 grid, and abstract:
 * no sacred text, no religious emblems, only geometry.
 */
import * as React from "react";

type MarkProps = React.SVGProps<SVGSVGElement> & { size?: number };
const svg = (size: number, rest: React.SVGProps<SVGSVGElement>) => ({
  viewBox: "0 0 100 100", width: size, height: size, fill: "none", "aria-hidden": true as const, ...rest,
});
const pt = (r: number, deg: number, cx = 50, cy = 50) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};
const poly = (pts: (readonly [number, number])[]) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

/** 01 · Khatam — the eight-pointed star (two interlaced squares) with an octagonal "lab window". */
export function KhatamMark({ size = 64, ...rest }: MarkProps) {
  const R = 46, r = R * 0.7654;
  const star = Array.from({ length: 16 }, (_, i) => pt(i % 2 ? r : R, i * 22.5));
  const oct = Array.from({ length: 8 }, (_, i) => pt(17, i * 45 + 22.5));
  return (
    <svg {...svg(size, rest)}>
      <path d={`M${poly(star)}Z M${poly(oct)}Z`} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** 02 · Girih — a ten-pointed {10/3} star from the girih tile family, drawn as a single continuous line. */
export function GirihMark({ size = 64, ...rest }: MarkProps) {
  const v = Array.from({ length: 10 }, (_, i) => pt(44, i * 36));
  const order = Array.from({ length: 10 }, (_, i) => v[(i * 3) % 10]);
  return (
    <svg {...svg(size, rest)}>
      <polygon points={poly(order)} stroke="currentColor" strokeWidth={5} strokeLinejoin="round" />
      <circle cx={50} cy={50} r={9} fill="currentColor" />
    </svg>
  );
}

/** 03 · Square Kufic "A" — the initial built on a 7×7 grid, in the maze-like logic of Square Kufic. */
const KUFIC_A = [
  "..###..",
  ".##.##.",
  "##...##",
  "#######",
  "##...##",
  "##.#.##",
  "##.#.##",
];
export function KuficMark({ size = 64, ...rest }: MarkProps) {
  const c = 100 / 7;
  return (
    <svg {...svg(size, rest)} shapeRendering="crispEdges">
      {KUFIC_A.flatMap((row, y) =>
        [...row].map((ch, x) => (ch === "#" ? <rect key={`${x}-${y}`} x={x * c} y={y * c} width={c + 0.2} height={c + 0.2} fill="currentColor" /> : null))
      )}
    </svg>
  );
}

/** 04 · Mihrab "A" — a two-centred pointed arch whose crossbar turns the niche into the letter A. */
export function MihrabMark({ size = 64, ...rest }: MarkProps) {
  return (
    <svg {...svg(size, rest)}>
      <path
        d="M18 94 V52 C18 32 34 16 50 6 C66 16 82 32 82 52 V94 H64 V64 H36 V94 Z M36 50 H64 C64 38 58 30 50 24 C42 30 36 38 36 50 Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

/** 05 · Zellige rosette — eight kites around an open centre, the core of Moroccan / Andalusian tilework. */
export function ZelligeMark({ size = 64, ...rest }: MarkProps) {
  const kite = (deg: number) => poly([pt(14, deg), pt(30, deg - 16), pt(47, deg), pt(30, deg + 16)]);
  return (
    <svg {...svg(size, rest)}>
      {Array.from({ length: 8 }, (_, i) => <polygon key={i} points={kite(i * 45)} fill="currentColor" />)}
    </svg>
  );
}

/** 06 · Strapwork — the eight-fold star as an interlaced band, read as one continuous unbroken line (tawhid). */
export function StrapworkMark({ size = 64, ...rest }: MarkProps) {
  const sq = (rot: number) => poly(Array.from({ length: 4 }, (_, i) => pt(40, rot + i * 90)));
  return (
    <svg {...svg(size, rest)}>
      <polygon points={sq(0)} stroke="currentColor" strokeWidth={9} strokeLinejoin="miter" />
      <polygon points={sq(45)} stroke="currentColor" strokeWidth={9} strokeLinejoin="miter" />
      <polygon points={sq(0)} className="stroke-background" strokeWidth={3} strokeLinejoin="miter" />
      <polygon points={sq(45)} className="stroke-background" strokeWidth={3} strokeLinejoin="miter" />
    </svg>
  );
}

export const LOGO_CONCEPTS = [
  { id: "khatam", name: "Khatam", Mark: KhatamMark, origin: "Eight-pointed star of two interlaced squares (Rub el Hizb / khatam). Found from Umayyad Damascus to Mughal India.", reads: "Precision, balance, a window into the lab.", fit: "Strongest small-size legibility. Works as app icon and favicon." },
  { id: "girih", name: "Girih", Mark: GirihMark, origin: "Ten-fold star from the girih tile system (Darb-i Imam, Isfahan, 1453): quasi-crystalline geometry centuries ahead of its time.", reads: "Mathematics, research, infinite pattern.", fit: "Best for a research-led ‘Labs’ story. Needs ≥24px." },
  { id: "kufic", name: "Square Kufic A", Mark: KuficMark, origin: "Square (banna'i) Kufic: calligraphy laid on a brick grid, used on Timurid and Safavid buildings.", reads: "Built, structured, digital-native: a pixel grid with centuries of history.", fit: "Most ownable: it's literally the letter A. Pairs with the grid-based UI." },
  { id: "mihrab", name: "Mihrab A", Mark: MihrabMark, origin: "The pointed (two-centred) arch of the mihrab and iwan, from Samarra to Kuala Lumpur.", reads: "A doorway, direction, a place to begin.", fit: "Reads instantly as ‘A’. Simple enough to emboss or engrave." },
  { id: "zellige", name: "Zellige", Mark: ZelligeMark, origin: "Rosette of cut-tile (zellige) mosaics, Fez and the Alhambra.", reads: "Craft, many parts forming one whole.", fit: "Warm and decorative. Good for brand patterns; weaker as a favicon." },
  { id: "strapwork", name: "Strapwork", Mark: StrapworkMark, origin: "Interlaced band (strapwork) of mosque doors and minbars: one line that never ends.", reads: "Unity, continuity, systems that connect.", fit: "Elegant at large sizes; simplify to Khatam below 24px." },
] as const;
