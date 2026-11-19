"use client";

import * as React from "react";
import { Progress } from "@recanica/ui/components/progress";

export default function ProgressDemo() {
  const [value, setValue] = React.useState(20);
  React.useEffect(() => {
    const t = setTimeout(() => setValue(68), 500);
    return () => clearTimeout(t);
  }, []);
  return <Progress value={value} className="max-w-sm" />;
}
