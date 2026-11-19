"use client";

import { Spinner } from "@recanica/ui/components/spinner";
import { Button } from "@recanica/ui/components/button";

export default function SpinnerDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
      <Spinner className="size-6" />
      <Button disabled variant="outline"><Spinner /> Processing payment</Button>
    </div>
  );
}
