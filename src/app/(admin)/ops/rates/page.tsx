import type { Metadata } from "next";
import { candidates } from "@/lib/data";
import { DISCIPLINES } from "@/lib/bench";
import { PageHeader } from "@/components/layout/app-shell";
import { RateDesk, type RateCardRow } from "@/features/ops/rate-desk";

export const metadata: Metadata = { title: "Rate and margin" };

const BANDS: { band: string; min: number; max: number }[] = [
  { band: "Senior (4–9 yrs)", min: 0, max: 9 },
  { band: "Lead (10–13 yrs)", min: 10, max: 13 },
  { band: "Principal (14+ yrs)", min: 14, max: 99 },
];

const pct = (xs: number[], p: number) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0;
};

export default function RatesPage() {
  const rateCard: RateCardRow[] = DISCIPLINES.flatMap((d) =>
    BANDS.map(({ band, min, max }) => {
      const rates = candidates.filter((c) => c.discipline === d && c.yearsExperience >= min && c.yearsExperience <= max).map((c) => c.rateC2C);
      return { discipline: d, band, n: rates.length, p25: pct(rates, 0.25), p50: pct(rates, 0.5), p75: pct(rates, 0.75) };
    }),
  );

  return (
    <>
      <PageHeader
        title="Rates and margin"
      />
      <RateDesk rateCard={rateCard} />
    </>
  );
}
