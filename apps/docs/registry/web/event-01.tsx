import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@rekanica/ui/components/badge";
import { Button } from "@rekanica/ui/components/button";

const events = [
  { day: "04", month: "Dec", title: "e-Invoice clinic for small businesses", type: "Workshop", place: "Kuala Lumpur · In person", time: "2:00–4:30pm", seats: "12 seats left" },
  { day: "11", month: "Dec", title: "Pricing your services in 2027", type: "Webinar", place: "Online", time: "8:00–9:00pm", seats: "Free" },
  { day: "15", month: "Jan", title: "Acme meetup Penang", type: "Meetup", place: "Penang Hub, George Town", time: "7:00–9:30pm", seats: "Free, register" },
];

export function Event01() {
  return (
    <section className="px-gutter py-section-sm">
      <div className="mx-auto max-w-content">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-display-sm tracking-tight">Upcoming events</h2>
          <a href="#" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">Past events</a>
        </div>
        <ul className="mt-10 divide-y rounded-2xl border">
          {events.map((e) => (
            <li key={e.title} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl border bg-panel">
                <span className="text-2xl leading-none font-light">{e.day}</span>
                <span className="text-xs text-muted-foreground">{e.month}</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2"><h3>{e.title}</h3><Badge variant="outline">{e.type}</Badge></div>
                <p className="text-sm text-muted-foreground">{e.place} · {e.time}</p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <span className="text-xs text-muted-foreground">{e.seats}</span>
                <Button size="sm" variant="outline">Register <ArrowRightIcon /></Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Event01;
