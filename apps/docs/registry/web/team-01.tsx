import { WebSectionTitle } from "@recanica/ui/components/web-section";
const team = [
  ["Nadia Rahman", "Co-founder, CEO"], ["Tan Wei Ming", "Co-founder, CTO"], ["Arjun Mehta", "Engineering"], ["Mei Kato", "Design"],
  ["Hana Lee", "Customer support"], ["Sam Ortiz", "Partnerships"], ["Chloe Martin", "Finance"], ["Leo Tan", "Engineering"],
];
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("").slice(0, 2);

export function Team01() {
  return (
    <section className="px-gutter py-section">
      <div className="mx-auto max-w-content">
        <div className="max-w-2xl">
          <WebSectionTitle>The team</WebSectionTitle>
          <p className="mt-4 text-muted-foreground">Twelve people in Kuala Lumpur and Penang. We answer support emails ourselves.</p>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {team.map(([name, role]) => (
            <li key={name}>
              <a href="/site/team/mei-kato" className="group block">
                <div className="flex aspect-square items-center justify-center rounded-2xl border bg-muted text-title font-light text-muted-foreground" role="img" aria-label={`Photo of ${name}`}>{initials(name)}</div>
                <p className="mt-3 group-hover:underline">{name}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Team01;
