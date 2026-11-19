"use client";

import { Button } from "@recanica/ui/components/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@recanica/ui/components/card";
import { Input } from "@recanica/ui/components/input";
import { Label } from "@recanica/ui/components/label";

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy a new project in one click.</CardDescription>
        <CardAction><Button variant="link" size="sm">Docs</Button></CardAction>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Label htmlFor="cd-name">Name</Label>
        <Input id="cd-name" placeholder="my-project" />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  );
}
