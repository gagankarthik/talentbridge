"use client";

import { Button } from "@/components/ui/button";
import { IconPrinter } from "@/components/icons";

export function PrintButton() {
  return (
    <Button variant="dark" onClick={() => window.print()}>
      <IconPrinter size={16} />
      Print or save as PDF
    </Button>
  );
}
