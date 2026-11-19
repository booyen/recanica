import { ArrowUpRightIcon, CameraIcon, MailIcon, MessageCircleIcon } from "lucide-react";

const links = [
  { label: "Order online (delivery & pickup)", href: "#" },
  { label: "This week's menu", href: "#" },
  { label: "Book the back room for events", href: "#" },
  { label: "Our beans, roasted in Johor", href: "#" },
  { label: "Find us on Google Maps", href: "#" },
];

export function LinkPage01() {
  return (
    <div className="flex min-h-[720px] justify-center bg-sidebar px-gutter py-12">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full border bg-muted text-xl font-light" role="img" aria-label="Profile photo">KP</div>
          <h1 className="text-heading">Kedai Kopi Pak Mat</h1>
          <p className="text-sm text-muted-foreground">Kopi, kaya toast and nasi lemak since 1986. Jonker Walk, Melaka. Open 7am–3pm, closed Tuesdays.</p>
        </div>
        <ul className="space-y-3">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="group flex items-center justify-between rounded-full border bg-background px-5 py-3.5 text-sm transition-colors hover:bg-accent">
                {l.label}<ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex justify-center gap-2">
          {[[CameraIcon, "Instagram"], [MessageCircleIcon, "WhatsApp"], [MailIcon, "Email"]].map(([Icon, label]) => {
            const I = Icon as typeof MailIcon;
            return <a key={label as string} href="#" aria-label={label as string} className="flex size-10 items-center justify-center rounded-full border bg-background hover:bg-accent"><I className="size-4" /></a>;
          })}
        </div>
      </div>
    </div>
  );
}

export default LinkPage01;
