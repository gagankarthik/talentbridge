// Company website content: services, practices, industries, audiences.

export type Accent = "cobalt" | "violet" | "sky" | "teal" | "indigo" | "cyan" | "plum" | "brand" | "coral";

/** Tailwind classes per accent, written in full so they survive purge. */
export const ACCENT: Record<Accent, { text: string; bg: string; ring: string; solid: string }> = {
  cobalt: { text: "text-acc-cobalt", bg: "bg-acc-cobalt-bg", ring: "ring-acc-cobalt/25", solid: "bg-acc-cobalt" },
  violet: { text: "text-acc-violet", bg: "bg-acc-violet-bg", ring: "ring-acc-violet/25", solid: "bg-acc-violet" },
  sky: { text: "text-acc-sky", bg: "bg-acc-sky-bg", ring: "ring-acc-sky/25", solid: "bg-acc-sky" },
  teal: { text: "text-acc-teal", bg: "bg-acc-teal-bg", ring: "ring-acc-teal/25", solid: "bg-acc-teal" },
  indigo: { text: "text-acc-indigo", bg: "bg-acc-indigo-bg", ring: "ring-acc-indigo/25", solid: "bg-acc-indigo" },
  cyan: { text: "text-acc-cyan", bg: "bg-acc-cyan-bg", ring: "ring-acc-cyan/25", solid: "bg-acc-cyan" },
  plum: { text: "text-acc-plum", bg: "bg-acc-plum-bg", ring: "ring-acc-plum/25", solid: "bg-acc-plum" },
  brand: { text: "text-brand", bg: "bg-brand-wash", ring: "ring-brand/25", solid: "bg-brand" },
  coral: { text: "text-coral", bg: "bg-coral-wash", ring: "ring-coral/25", solid: "bg-coral" },
};

export type ServiceSlug =
  | "contract-staffing"
  | "agency-bench-partnerships"
  | "contract-to-hire"
  | "dedicated-delivery-teams"
  | "compliance-and-onboarding"
  | "technical-vetting";

export interface Service {
  slug: ServiceSlug;
  name: string;
  accent: Accent;
  /** Photo in /public/images */
  image: string;
  audience: "Enterprises" | "Staffing agencies" | "Enterprises and agencies";
  summary: string;
  headline: string;
  lede: string;
  includes: { title: string; body: string }[];
  model: { label: string; value: string }[];
}

export const SERVICES: Service[] = [
  {
    slug: "contract-staffing",
    name: "Contract Staffing",
    accent: "brand",
    image: "/images/technical-panel.jpg",
    audience: "Enterprises",
    summary: "Senior engineers on W2 or C2C contracts, deployed within 48 hours.",
    headline: "Senior contract engineers, on your team within 48 hours.",
    lede: "Fill project roles without a months-long search. Every consultant has passed a live technical screen, has verified work authorization, and has confirmed availability this week.",
    includes: [
      { title: "Shortlist in one business day", body: "Three to five matched profiles with verified stack depth, screen scores and rate." },
      { title: "W2 or corp-to-corp", body: "We handle payroll, benefits and insurance on W2, or contract through the consultant's corporation." },
      { title: "Replacement guarantee", body: "If a consultant isn't the right fit in the first two weeks, we replace them at no cost." },
    ],
    model: [
      { label: "Time to shortlist", value: "1 business day" },
      { label: "Time to start", value: "48 hours" },
      { label: "Typical term", value: "3–18 months" },
    ],
  },
  {
    slug: "agency-bench-partnerships",
    name: "Agency Bench Partnerships",
    accent: "violet",
    image: "/images/recruiter-discussion.jpg",
    audience: "Staffing agencies",
    summary: "Submit our pre-vetted bench to your clients under your own brand.",
    headline: "Extend your bench with engineers we've already vetted.",
    lede: "Staffing agencies submit our consultants to their enterprise clients under their own brand. Profiles arrive redacted and client-ready, and a 48-hour hold stops duplicate submissions.",
    includes: [
      { title: "Blind, co-branded profiles", body: "Surname and contact details are removed, and your agency header goes on every one-sheet." },
      { title: "48-hour client holds", body: "Place a hold on a consultant for a named end client. No other agency can submit them there while your hold is active." },
      { title: "Partner portal", body: "Search the live bench, compare candidates and track every submission in one place." },
    ],
    model: [
      { label: "Hold window", value: "48 hours" },
      { label: "Profiles", value: "Redacted by default" },
      { label: "Access", value: "Partner portal" },
    ],
  },
  {
    slug: "contract-to-hire",
    name: "Contract-to-Hire",
    accent: "coral",
    image: "/images/agreement.jpg",
    audience: "Enterprises",
    summary: "Evaluate engineers on real work before you extend a full-time offer.",
    headline: "See the work before you make the offer.",
    lede: "Start with a three- to six-month contract, then convert to full-time on terms agreed up front. You get proof of performance, and the consultant gets a clear path to a permanent role.",
    includes: [
      { title: "Conversion terms agreed at the start", body: "Fees and timing are fixed before day one, with no surprises at conversion." },
      { title: "Visa-aware planning", body: "For H-1B transfers and EAD holders, we plan the petition timeline with your immigration counsel." },
      { title: "Mid-point review", body: "A structured check-in with your hiring manager at the halfway mark." },
    ],
    model: [
      { label: "Contract period", value: "3–6 months" },
      { label: "Conversion", value: "Pre-agreed terms" },
      { label: "Work authorization", value: "Verified up front" },
    ],
  },
  {
    slug: "dedicated-delivery-teams",
    name: "Dedicated Delivery Teams",
    accent: "teal",
    image: "/images/planning-session.jpg",
    audience: "Enterprises",
    summary: "A ready-formed team of engineers with a delivery lead.",
    headline: "A ready-formed team for the project you can't staff.",
    lede: "Engage a pod of three to eight engineers with a delivery lead, built from consultants who have worked together on our bench. It suits migrations, platform builds and backlog burn-downs.",
    includes: [
      { title: "Delivery lead included", body: "A senior engineer who owns sprint planning, reporting and stakeholder updates." },
      { title: "Scale up or down", body: "Add or release engineers with two weeks' notice as the roadmap changes." },
      { title: "Outcome reporting", body: "Weekly status against milestones, not just hours billed." },
    ],
    model: [
      { label: "Team size", value: "3–8 engineers" },
      { label: "Ramp-up", value: "2 weeks" },
      { label: "Notice to scale", value: "2 weeks" },
    ],
  },
  {
    slug: "compliance-and-onboarding",
    name: "Compliance and Onboarding",
    accent: "indigo",
    image: "/images/client-briefing.jpg",
    audience: "Enterprises and agencies",
    summary: "Right-to-work, I-9, background and visa tracking handled for you.",
    headline: "Right-to-work and onboarding, done before day one.",
    lede: "We verify work authorization, complete I-9 review, run background and reference checks, and track visa expiry for every consultant, so onboarding never holds up a start date.",
    includes: [
      { title: "Verified before presentation", body: "No consultant is presented until work authorization and background checks have cleared." },
      { title: "Visa expiry tracking", body: "Extensions are flagged 90 days before expiry and escalated at 45." },
      { title: "Audit-ready records", body: "Documents are encrypted and shared only through links that expire in 15 minutes." },
    ],
    model: [
      { label: "Checks before presentation", value: "100%" },
      { label: "Visa lookahead", value: "90 days" },
      { label: "Document links", value: "15-minute expiry" },
    ],
  },
  {
    slug: "technical-vetting",
    name: "Technical Vetting",
    accent: "plum",
    image: "/images/engineer-lab.jpg",
    audience: "Enterprises and agencies",
    summary: "Live technical screens by senior engineers in the same discipline.",
    headline: "Every engineer screened by an engineer.",
    lede: "Each consultant completes a 90-minute live panel with a senior engineer from the same discipline, scored on system design, hands-on coding, domain depth and communication.",
    includes: [
      { title: "Four scored dimensions", body: "Detailed scores for each dimension, so you can see where a consultant is strongest." },
      { title: "Verified delivery history", body: "Architecture projects are confirmed with references, not taken from the resume." },
      { title: "Weekly availability checks", body: "Consultants re-confirm availability every seven days, so the bench you see is real." },
    ],
    model: [
      { label: "Panel length", value: "90 minutes" },
      { label: "Scored dimensions", value: "4" },
      { label: "Re-verification", value: "Every 7 days" },
    ],
  },
];

export const serviceBySlug = new Map(SERVICES.map((s) => [s.slug, s]));


export const INDUSTRIES = [
  { name: "Banking", query: "Banking", note: "Payments, KYC and regulatory reporting" },
  { name: "Capital Markets", query: "Capital Markets", note: "Trading, risk and market-data platforms" },
  { name: "Insurance", query: "Insurance", note: "Claims, policy administration and actuarial data" },
  { name: "Healthcare", query: "Healthcare", note: "HIPAA, FHIR and HL7 delivery" },
  { name: "Retail", query: "Retail", note: "Commerce, supply chain and store systems" },
  { name: "Public Sector", query: "Public Sector", note: "Cleared and public-trust engineers" },
];

export const AUDIENCES = [
  { id: "enterprises", name: "Enterprises", note: "Fill contract and contract-to-hire roles in days" },
  { id: "agencies", name: "Staffing agencies", note: "Submit our vetted bench to your clients" },
  { id: "consultants", name: "Consultants", note: "Join the bench and get matched to enterprise roles" },
];

export const COMPANY_LINKS = [
  { href: "/company", t: "About TalentBridge", d: "Who we are and how we work" },
  { href: "/company#vetting", t: "How we vet", d: "Our screening and compliance standard" },
  { href: "/careers", t: "Careers for consultants", d: "Join the bench and get matched" },
  { href: "/contact", t: "Contact us", d: "Talk to our client team" },
];

/** Company contact details, used in header, footer, contact page and structured data. */
export const CONTACT = {
  phone: "+1 (614) 844-6925",
  tel: "+16148446925",
  email: "hr@oceanbluecorp.com",
  hours: "Monday to Friday, 8:00 AM to 5:00 PM EST",
  office: "Powell, Ohio",
};
