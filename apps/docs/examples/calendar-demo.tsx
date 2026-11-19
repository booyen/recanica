"use client";

import * as React from "react";
import { Calendar } from "@recanica/ui/components/calendar";

export default function CalendarDemo() {
  // Fixed initial date keeps server and client renders identical.
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 10, 18));
  return <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} className="rounded-2xl border" />;
}
