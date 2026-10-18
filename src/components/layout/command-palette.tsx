"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconArrowRight, IconSearch } from "@/components/icons";
import { Kbd } from "@/components/ui/data-display";

/** One searchable entry. `keywords` widen matching (skills, domain, discipline). */
export interface PaletteEntry {
  id: string;
  label: string;
  /** Right-hand muted text (discipline, plan, shortcut) */
  meta?: string;
  /** Leading tabular code (TC-1141) */
  code?: string;
  href: string;
  keywords?: string[];
  icon?: React.ReactNode;
}

export interface PaletteGroup {
  heading: string;
  entries: PaletteEntry[];
}

const item =
  "group flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] text-ink-2 outline-none select-none data-[selected=true]:bg-well data-[selected=true]:text-ink";

/**
 * ⌘K / Ctrl+K command palette (also "/" when the page hasn't claimed that key).
 * Fuzzy-matches pages, actions and records via cmdk. When the query matches
 * nothing well, the `fallback` entry ("Search candidates for …") routes to the
 * full search page with ?q=.
 */
export function CommandPalette({
  open,
  onOpenChange,
  groups,
  fallback,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: PaletteGroup[];
  fallback?: { label: (q: string) => string; href: (q: string) => string };
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (href: string) => {
    onOpenChange(false);
    setQ("");
    router.push(href);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setQ("");
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="anim-fade fixed inset-0 z-[90] bg-ink/35 backdrop-blur-[3px]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="app anim-pop fixed top-[12dvh] left-1/2 z-[95] w-[calc(100%-24px)] max-w-[600px] -translate-x-1/2 overflow-hidden rounded-xl bg-surface shadow-overlay outline-none"
        >
          <Dialog.Title className="sr-only">Search and jump</Dialog.Title>
          <Command label="Search and jump" loop>
            <div className="flex h-12 items-center gap-2.5 border-b border-hair px-4">
              <IconSearch size={16} className="shrink-0 text-subtle" />
              <Command.Input
                value={q}
                onValueChange={setQ}
                placeholder="Search candidates, organizations, pages…"
                className="h-full min-w-0 flex-1 bg-transparent text-[14.5px] text-ink outline-none placeholder:text-faint focus-visible:outline-none!"
              />
              <Kbd>Esc</Kbd>
            </div>
            <Command.List className="scroll-thin max-h-[min(420px,60dvh)] overflow-y-auto p-1.5">
              <Command.Empty className="px-3 py-8 text-center text-[13px] text-subtle">No matches. Try a candidate code like TC-1141.</Command.Empty>
              {groups.map((g) =>
                g.entries.length ? (
                  <Command.Group
                    key={g.heading}
                    heading={g.heading}
                    className="[&_[cmdk-group-heading]]:eyebrow mb-1 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-faint"
                  >
                    {g.entries.map((e) => (
                      <Command.Item key={e.id} value={`${e.code ?? ""} ${e.label} ${e.id}`} keywords={e.keywords} onSelect={() => go(e.href)} className={item}>
                        {e.icon && <span className="shrink-0 text-subtle group-data-[selected=true]:text-cobalt">{e.icon}</span>}
                        {e.code && <span className="tnum w-[64px] shrink-0 text-[12.5px] font-semibold text-ink">{e.code}</span>}
                        <span className="min-w-0 flex-1 truncate">{e.label}</span>
                        {e.meta && <span className="shrink-0 truncate text-[12.5px] text-subtle">{e.meta}</span>}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ) : null,
              )}
              {fallback && q.trim().length > 1 && (
                <Command.Group heading="Search" className="[&_[cmdk-group-heading]]:eyebrow [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-faint">
                  <Command.Item value={`search-fallback ${q}`} forceMount onSelect={() => go(fallback.href(q.trim()))} className={item}>
                    <IconSearch size={15} className="shrink-0 text-subtle" />
                    <span className="min-w-0 flex-1 truncate">{fallback.label(q.trim())}</span>
                    <IconArrowRight size={14} className="shrink-0 text-faint" />
                  </Command.Item>
                </Command.Group>
              )}
            </Command.List>
            <div className="flex h-10 items-center gap-4 border-t border-hair px-4 text-[12px] text-subtle">
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> Navigate
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>↵</Kbd> Open
              </span>
              <span className="ml-auto hidden items-center gap-1.5 sm:flex">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd> Toggle
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
