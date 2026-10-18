// One map of the public site, shared by the top bar and the footer so the
// two always carry the same groups, labels and order.

export interface NavLink {
  href: string;
  t: string;
  d: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export const SITE_NAV: NavGroup[] = [
  {
    title: "Enterprises",
    links: [
      { href: "/services/contract-staffing", t: "Contract staffing", d: "Senior engineers for project roles" },
      { href: "/services/contract-to-hire", t: "Contract-to-hire", d: "Convert on terms agreed up front" },
      { href: "/services/dedicated-delivery-teams", t: "Delivery teams", d: "A screened team under one lead" },
      { href: "/contact?topic=requisition", t: "Send a requisition", d: "Shortlist within one business day" },
    ],
  },
  {
    title: "Staffing firms",
    links: [
      { href: "/services/agency-bench-partnerships", t: "Bench partnerships", d: "Present our engineers under your brand" },
      { href: "/services/technical-vetting", t: "Technical vetting", d: "Our 90-minute panel for your candidates" },
      { href: "/services/compliance-and-onboarding", t: "Compliance", d: "E-Verify, I-9 and background handled" },
      { href: "/login", t: "Partner sign in", d: "Search the bench and track holds" },
    ],
  },
  {
    title: "Consultants",
    links: [
      { href: "/careers#roles", t: "Open roles", d: "Contract roles with enterprise clients" },
      { href: "/careers#apply", t: "Join the bench", d: "One panel, never a fee" },
      { href: "/company#vetting", t: "How the panel works", d: "What we score and how" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company", t: "About us", d: "Who we are and how we work" },
      { href: "/#industries", t: "Industries", d: "Banking, insurance, healthcare and more" },
      { href: "/#faq", t: "Common questions", d: "Engagements, authorization, fees" },
      { href: "/contact", t: "Contact", d: "Head office in Powell, Ohio" },
    ],
  },
];
