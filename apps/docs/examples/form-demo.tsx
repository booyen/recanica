"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@recanica/ui/components/button";
import { Input } from "@recanica/ui/components/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@recanica/ui/components/form";

const schema = z.object({ email: z.string().email("Enter a valid email.") });

export default function FormDemo() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => toast(`Invite sent to ${v.email}`))} className="w-full max-w-sm space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="name@company.example" {...field} /></FormControl>
              <FormDescription>We'll send an invite link.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Send invite</Button>
      </form>
    </Form>
  );
}
