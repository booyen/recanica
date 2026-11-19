import { Avatar, AvatarFallback } from "@recanica/ui/components/avatar";

export function Testimonial02() {
  return (
    <section className="px-gutter py-section-sm">
      <figure className="mx-auto max-w-narrow text-center">
        <p className="text-metric font-light text-brand">11 days → 3 days</p>
        <p className="mt-1 text-sm text-muted-foreground">average time to get paid</p>
        <blockquote className="mt-8 text-heading text-balance sm:text-title">
          “We used to chase every invoice on WhatsApp. Now customers pay from the link and I only look at the overdue list on Fridays.”
        </blockquote>
        <figcaption className="mt-8 flex items-center justify-center gap-3 text-sm">
          <Avatar><AvatarFallback>NA</AvatarFallback></Avatar>
          <span className="text-left">Nurul Aina<span className="block text-muted-foreground">Owner, Studio Aina, Kota Bharu</span></span>
        </figcaption>
      </figure>
    </section>
  );
}

export default Testimonial02;
