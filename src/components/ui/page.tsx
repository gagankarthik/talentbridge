/* Workspace page helpers that sit alongside the shell's PageHeader / PageBody. */

/** White card: 1px border, 8px radius, no shadow. Use for panels that aren't a titled DetailSection. */
export const cardClass = "rounded-lg border border-hair bg-surface";

/** Filter field for a page or card toolbar: 36px, 6px radius, 3.1:1 control border, blue focus ring. */
export const fieldClass =
  "h-9 w-full rounded-md border border-control bg-surface pl-9 pr-3 text-[14px] text-ink placeholder:text-subtle transition-[border-color,box-shadow] duration-150 focus:border-cobalt focus:shadow-[0_0_0_3px_rgb(37_88_224/0.2)] focus:outline-none!";
