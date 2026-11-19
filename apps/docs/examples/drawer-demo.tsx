"use client";

import { Button } from "@recanica/ui/components/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@recanica/ui/components/drawer";

export default function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Withdraw funds</DrawerTitle>
            <DrawerDescription>Available balance: $1,206.00</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 text-center text-metric font-light">$1,206</div>
          <DrawerFooter>
            <Button>Withdraw</Button>
            <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
