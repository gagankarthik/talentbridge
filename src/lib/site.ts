/** Public site origin used for canonical URLs, sitemap and Open Graph. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "TalentBridge";
export const SITE_DESCRIPTION =
  "IT staffing partner for enterprises and staffing firms. Technically screened, compliance-cleared engineers for contract, contract-to-hire and dedicated teams, ready to start in 48 hours.";
