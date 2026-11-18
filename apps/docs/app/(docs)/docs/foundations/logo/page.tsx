import { DocsPageHeader, H2, P } from "@/components/docs/page-header";
import { DoDont } from "@/components/docs/frame";
import { Pager } from "@/components/docs/pager";
import { KhatamMark, LOGO_CONCEPTS } from "@/components/docs/logo-marks";

export const metadata = { title: "Logo Concepts", description: "Aturanica Labs logo exploration rooted in Islamic geometric art." };

function Lockup({ Mark, inverted = false }: { Mark: (p: { size?: number }) => React.ReactNode; inverted?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-5 py-4 ${inverted ? "bg-white text-black" : "bg-black text-white"}`}>
      <Mark size={28} />
      <span className="text-base tracking-tight whitespace-nowrap">Aturanica <span className="opacity-60">Labs</span></span>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <DocsPageHeader
        eyebrow="Foundations · Exploration"
        title="Logo Concepts"
        description="Six directions for the Aturanica Labs mark, drawn from Islamic geometric art: star polygons, girih, Square Kufic, the mihrab arch, zellige and strapwork. All are monochrome, abstract and built on a 100-unit grid."
      />

      <H2 id="concepts">Concepts</H2>
      <div className="grid gap-4 md:grid-cols-2">
        {LOGO_CONCEPTS.map(({ id, name, Mark, origin, reads, fit }, i) => (
          <article key={id} className="overflow-hidden rounded-2xl border bg-panel">
            <div className="grid grid-cols-[1fr_auto]">
              <div className="flex aspect-[4/3] items-center justify-center border-r border-b text-foreground">
                <Mark size={132} />
              </div>
              <div className="flex flex-col items-center justify-around gap-3 border-b px-5 py-4 text-foreground">
                <Mark size={32} />
                <Mark size={20} />
                <Mark size={16} />
                <span data-finish="mesh" className="flex size-12 items-center justify-center rounded-xl bg-metallic"><Mark size={28} /></span>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg">{name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{origin}</p>
              <dl className="grid gap-1 text-sm">
                <div><dt className="inline text-muted-foreground">Reads as: </dt><dd className="inline">{reads}</dd></div>
                <div><dt className="inline text-muted-foreground">Fit: </dt><dd className="inline">{fit}</dd></div>
              </dl>
              <div className="grid gap-2 pt-1 2xl:grid-cols-2">
                <Lockup Mark={Mark} />
                <Lockup Mark={Mark} inverted />
              </div>
            </div>
          </article>
        ))}
      </div>

      <H2 id="recommendation">Recommendation</H2>
      <P>
        Lead with <strong className="font-medium text-foreground">Square Kufic A</strong> or <strong className="font-medium text-foreground">Khatam</strong>.
        Kufic A is the most ownable (it is the company's initial, and its grid matches Rekanica's 4px system); Khatam is the most
        recognisable and survives at 16px. A strong system: Kufic A as the primary mark, Khatam-derived tiling as the brand pattern.
      </P>
      <div className="mt-6 flex flex-wrap items-center gap-6 rounded-2xl border bg-panel p-6">
        <KhatamMark size={40} className="text-foreground" />
        <div className="grid flex-1 grid-cols-6 gap-1 text-muted-foreground/25 sm:grid-cols-10">
          {Array.from({ length: 20 }).map((_, i) => <KhatamMark key={i} size={36} />)}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Brand pattern: the khatam repeated as a quiet tile, used at 10–25% opacity on covers and empty states.</p>

      <H2 id="guidance">Respectful use</H2>
      <DoDont
        do={[
          "Use abstract geometry and letterforms; they carry the heritage without religious claims.",
          "Credit the source tradition in brand guidelines (girih, khatam, Square Kufic).",
          "Keep marks monochrome so they follow Rekanica's flat / mesh / chrome finish.",
        ]}
        dont={[
          "Use Qur'anic verses, the name of Allah or the Shahada in a commercial mark.",
          "Use the crescent and star: it reads as a national/political emblem, not a design language.",
          "Place marks where they may be stepped on or discarded (floor mats, disposable packaging).",
        ]}
      />
      <Pager href="/docs/foundations/logo" />
    </>
  );
}
