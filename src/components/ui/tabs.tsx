"use client";

import * as Tabs from "@radix-ui/react-tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { CountBadge } from "./data-display";

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
  count?: number;
  countTone?: "neutral" | "flag";
}

const trigger =
  "group relative -mb-px inline-flex h-11 shrink-0 items-center gap-1.5 border-b-2 border-transparent text-[13.5px] text-subtle transition-colors duration-150 ease-power3-out outline-none hover:text-ink focus-visible:text-ink data-[state=active]:border-ink data-[state=active]:text-ink aria-[current=page]:border-ink aria-[current=page]:text-ink";

/** Renders the label twice (one hidden at medium weight) so the width doesn't shift when active. */
function Label({ text }: { text: string }) {
  return (
    <span className="grid">
      <span className="col-start-1 row-start-1 group-data-[state=active]:font-medium group-aria-[current=page]:font-medium">{text}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 h-0 font-medium">
        {text}
      </span>
    </span>
  );
}

/**
 * Underline tabs (Radix): a hairline-bottomed strip of triggers, the active one
 * underlined in ink. Put <TabPanel value="…"> children inside. Usually passed to
 * PageHeader's `tabs` slot together with the panels below it, or used inline.
 */
export function UnderlineTabs<T extends string>({
  value,
  onValueChange,
  tabs,
  children,
  label,
  className,
  listClassName,
}: {
  value: T;
  onValueChange: (v: T) => void;
  tabs: TabItem<T>[];
  children?: React.ReactNode;
  label?: string;
  className?: string;
  listClassName?: string;
}) {
  return (
    <Tabs.Root value={value} onValueChange={(v) => onValueChange(v as T)} className={className}>
      <Tabs.List aria-label={label} className={cn("no-scrollbar flex items-center gap-5 overflow-x-auto border-b border-hair px-4 sm:px-6", listClassName)}>
        {tabs.map((t) => (
          <Tabs.Trigger key={t.value} value={t.value} className={trigger}>
            <Label text={t.label} />
            {t.count !== undefined && <CountBadge tone={t.countTone}>{t.count}</CountBadge>}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {children}
    </Tabs.Root>
  );
}

export const TabPanel = Tabs.Content;

/** Route-based underline tabs (settings sections, record sub-pages). Active = exact path match. */
export function TabLinks({ tabs, className }: { tabs: { href: string; label: string; count?: number }[]; className?: string }) {
  const pathname = usePathname();
  return (
    <nav className={cn("no-scrollbar flex items-center gap-5 overflow-x-auto border-b border-hair px-4 sm:px-6", className)}>
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} aria-current={pathname === t.href ? "page" : undefined} className={trigger}>
          <Label text={t.label} />
          {t.count !== undefined && <CountBadge>{t.count}</CountBadge>}
        </Link>
      ))}
    </nav>
  );
}
