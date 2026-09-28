// Rate and margin math shared by the Rate Desk and product previews.

export type Basis = "W2" | "C2C";

export interface BurdenBreakdown {
  fica: number;
  futaSuta: number;
  workersComp: number;
  benefits: number;
}

/** Default W2 statutory and benefits load, as % of pay. */
export const DEFAULT_W2_BURDEN: BurdenBreakdown = { fica: 7.65, futaSuta: 3.1, workersComp: 1.2, benefits: 6.0 };
/** C2C: vendor handles taxes; we carry only payment processing and insurance. */
export const C2C_BURDEN_PCT = 1.5;

export const burdenPct = (basis: Basis, b: BurdenBreakdown = DEFAULT_W2_BURDEN) =>
  basis === "C2C" ? C2C_BURDEN_PCT : b.fica + b.futaSuta + b.workersComp + b.benefits;

export interface RateModel {
  pay: number;
  loadedCost: number;
  bill: number;
  marginPerHour: number;
  marginPct: number;
  markupPct: number;
}

export function fromMargin(pay: number, basis: Basis, targetMarginPct: number, b?: BurdenBreakdown): RateModel {
  const loadedCost = pay * (1 + burdenPct(basis, b) / 100);
  const bill = loadedCost / (1 - targetMarginPct / 100);
  return build(pay, loadedCost, bill);
}

export function fromBill(pay: number, basis: Basis, bill: number, b?: BurdenBreakdown): RateModel {
  const loadedCost = pay * (1 + burdenPct(basis, b) / 100);
  return build(pay, loadedCost, bill);
}

function build(pay: number, loadedCost: number, bill: number): RateModel {
  const marginPerHour = bill - loadedCost;
  return {
    pay,
    loadedCost,
    bill,
    marginPerHour,
    marginPct: bill > 0 ? (marginPerHour / bill) * 100 : 0,
    markupPct: pay > 0 ? (bill / pay - 1) * 100 : 0,
  };
}
