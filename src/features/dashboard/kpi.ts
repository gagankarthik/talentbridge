/** KPI row: two compact tiles per row on phones, two on tablets, four on desktop (never more). */
export const kpiGrid = "grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 xl:gap-6";

/** Phone-compact KpiTile: 16px padding and a 24px value below `sm`, the spec's 20px / 28px above. */
export const kpiCompact = "p-4 sm:p-5 [&>span:nth-child(2)>span:first-child]:text-[24px] sm:[&>span:nth-child(2)>span:first-child]:text-[28px]";

/** "1 draft" / "3 drafts". Pass the plural form when it isn't just +s. */
export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
