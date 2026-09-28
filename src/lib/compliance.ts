import { daysBetween, DEMO_NOW, freshnessDays, FRESHNESS_WINDOW_DAYS, WORK_AUTH_LABEL } from "./format";
import type { Candidate } from "./types";

export interface ComplianceIssue {
  key: string;
  label: string;
  detail: string;
  severity: "flag" | "notice";
  /** Days until it becomes blocking, if time-bound. */
  dueInDays?: number;
}

/** Everything ops must clear before (or to keep) a candidate on the presentable bench. */
export function complianceIssues(c: Candidate): ComplianceIssue[] {
  if (c.benchStage === "Placed" || !c.isActive) return [];
  const out: ComplianceIssue[] = [];
  const x = c.compliance;
  if (c.benchStage !== "Onboarding" && !x.workAuthVerified)
    out.push({ key: "auth", label: "Work authorization unverified", detail: `${WORK_AUTH_LABEL[c.workAuthorization]} documents not yet matched to E-Verify.`, severity: "flag" });
  if (c.benchStage !== "Onboarding" && !x.i9Complete)
    out.push({ key: "i9", label: "I-9 incomplete", detail: "Section 2 employer review outstanding.", severity: "flag" });
  if (x.visaExpiry) {
    const d = daysBetween(DEMO_NOW, x.visaExpiry);
    if (d <= 90)
      out.push({ key: "visa", label: "Visa expiring", detail: `Status document expires in ${d} days. Request extension receipt or amended petition.`, severity: d <= 45 ? "flag" : "notice", dueInDays: d });
  }
  if (x.backgroundCheck === "In progress")
    out.push({ key: "bg", label: "Background check in progress", detail: "Criminal and employment verification pending with provider.", severity: "notice" });
  if (x.referencesCompleted < x.referencesRequired && c.benchStage !== "Onboarding")
    out.push({ key: "refs", label: "References outstanding", detail: `${x.referencesCompleted} of ${x.referencesRequired} references completed.`, severity: "notice" });
  if ((c.benchStage === "Available" || c.benchStage === "Interview") && freshnessDays(c.lastVerifiedAt) >= FRESHNESS_WINDOW_DAYS)
    out.push({ key: "fresh", label: "Availability stale", detail: `Last confirmed ${freshnessDays(c.lastVerifiedAt)} days ago; locks are blocked until the candidate re-confirms.`, severity: "flag" });
  return out;
}
