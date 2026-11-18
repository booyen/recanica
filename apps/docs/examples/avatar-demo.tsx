"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@rekanica/ui/components/avatar";

export default function AvatarDemo() {
  return (
    <div className="flex items-center gap-3">
      <Avatar><AvatarImage src="https://github.com/shadcn.png" alt="User" /><AvatarFallback>SC</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>AS</AvatarFallback></Avatar>
      <Avatar className="size-10"><AvatarFallback>NR</AvatarFallback></Avatar>
      <div className="flex -space-x-2">
        {["LT", "SO", "MK"].map((i) => <Avatar key={i} className="ring-2 ring-panel"><AvatarFallback>{i}</AvatarFallback></Avatar>)}
      </div>
    </div>
  );
}
