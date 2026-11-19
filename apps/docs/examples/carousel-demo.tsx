"use client";

import { Card, CardContent } from "@recanica/ui/components/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@recanica/ui/components/carousel";

export default function CarouselDemo() {
  return (
    <Carousel className="mx-auto w-full max-w-[16rem] sm:max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, i) => (
          <CarouselItem key={i}>
            <Card><CardContent className="flex aspect-square items-center justify-center"><span className="text-metric font-light">{i + 1}</span></CardContent></Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
