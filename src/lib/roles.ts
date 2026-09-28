// Open roles for consultants. Client names are never published: roles
// describe the client by industry only, and rates are shared at intake.

export type Engagement = "Contract" | "Contract-to-hire" | "Delivery team";
export type Setting = "Remote" | "Hybrid" | "Onsite";

export interface OpenRole {
  slug: string;
  title: string;
  engagement: Engagement;
  setting: Setting;
  location: string;
  duration: string;
  industry: string;
  workAuth: string;
  skills: string[];
  summary: string;
  responsibilities: string[];
  posted: string; // ISO date
}

export const OPEN_ROLES: OpenRole[] = [
  {
    slug: "senior-data-engineer-payments",
    title: "Senior Data Engineer, payments platform",
    engagement: "Contract",
    setting: "Hybrid",
    location: "Columbus, OH",
    duration: "12 months",
    industry: "Banking",
    workAuth: "US Citizen or Green Card",
    skills: ["Python", "Spark", "Databricks", "Kafka"],
    summary: "Build streaming pipelines that score card transactions in real time for a national bank's fraud team.",
    responsibilities: ["Design and run Spark Structured Streaming jobs", "Model payment events in Delta Lake", "Partner with fraud analysts on feature pipelines"],
    posted: "2026-09-26",
  },
  {
    slug: "platform-engineer-kubernetes",
    title: "Platform Engineer, Kubernetes",
    engagement: "Contract-to-hire",
    setting: "Remote",
    location: "US, Central time overlap",
    duration: "6 months, then convert",
    industry: "Logistics",
    workAuth: "Any US work authorization",
    skills: ["Kubernetes", "Terraform", "ArgoCD", "AWS"],
    summary: "Own the internal developer platform for a freight network moving to a single EKS estate.",
    responsibilities: ["Run and upgrade EKS clusters", "Build GitOps delivery with ArgoCD", "Codify infrastructure in Terraform modules"],
    posted: "2026-09-25",
  },
  {
    slug: "full-stack-engineer-digital-banking",
    title: "Full-Stack Engineer, digital banking",
    engagement: "Contract",
    setting: "Remote",
    location: "US, Eastern time",
    duration: "9 months",
    industry: "Banking",
    workAuth: "Any US work authorization",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    summary: "Ship accessible account-opening and servicing journeys for a regional credit union.",
    responsibilities: ["Build React features to WCAG 2.1 AA", "Extend GraphQL services in Node.js", "Pair with design on journey improvements"],
    posted: "2026-09-24",
  },
  {
    slug: "site-reliability-engineer-trading",
    title: "Site Reliability Engineer, trading systems",
    engagement: "Contract",
    setting: "Hybrid",
    location: "Jersey City, NJ",
    duration: "12 months",
    industry: "Capital Markets",
    workAuth: "US Citizen or Green Card",
    skills: ["Linux", "Prometheus", "Go", "Incident response"],
    summary: "Keep low-latency trading services reliable, with ownership of SLOs and on-call rotations.",
    responsibilities: ["Define and track service SLOs", "Automate toil with Go tooling", "Lead incident reviews"],
    posted: "2026-09-22",
  },
  {
    slug: "java-engineer-claims",
    title: "Java Engineer, claims modernization",
    engagement: "Delivery team",
    setting: "Remote",
    location: "US",
    duration: "12 months or more",
    industry: "Insurance",
    workAuth: "Any US work authorization",
    skills: ["Java", "Spring Boot", "PostgreSQL", "Event-driven design"],
    summary: "Join a five-person delivery team replacing a legacy claims system with event-driven services.",
    responsibilities: ["Build Spring Boot microservices", "Migrate data from the legacy platform", "Contribute to sprint planning and demos"],
    posted: "2026-09-20",
  },
  {
    slug: "analytics-engineer-healthcare",
    title: "Analytics Engineer, provider data",
    engagement: "Contract-to-hire",
    setting: "Remote",
    location: "US",
    duration: "6 months, then convert",
    industry: "Healthcare",
    workAuth: "Any US work authorization",
    skills: ["SQL", "dbt", "Snowflake", "Data quality"],
    summary: "Model provider and scheduling data for a 40-hospital network's analytics team.",
    responsibilities: ["Build dbt models with tests", "Document lineage for reporting", "Work with clinical operations stakeholders"],
    posted: "2026-09-18",
  },
  {
    slug: "cloud-security-engineer-cleared",
    title: "Cloud Security Engineer (clearance required)",
    engagement: "Contract",
    setting: "Onsite",
    location: "Reston, VA",
    duration: "12 months",
    industry: "Public Sector",
    workAuth: "US Citizen with active Secret clearance",
    skills: ["Azure", "Policy as code", "Vault", "Zero trust"],
    summary: "Harden a government cloud environment and automate compliance evidence.",
    responsibilities: ["Implement policy-as-code guardrails", "Manage secrets with Vault", "Prepare audit evidence"],
    posted: "2026-09-15",
  },
  {
    slug: "frontend-engineer-retail",
    title: "Frontend Engineer, commerce",
    engagement: "Contract",
    setting: "Hybrid",
    location: "Dublin, OH",
    duration: "6 months",
    industry: "Retail",
    workAuth: "Any US work authorization",
    skills: ["React", "Next.js", "Performance", "Design systems"],
    summary: "Improve checkout speed and consistency for a national retailer's web storefront.",
    responsibilities: ["Build checkout features in Next.js", "Contribute to the shared design system", "Measure and improve Core Web Vitals"],
    posted: "2026-09-12",
  },
];

export const roleBySlug = new Map(OPEN_ROLES.map((r) => [r.slug, r]));
