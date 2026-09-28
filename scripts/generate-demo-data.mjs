// Deterministic demo-data generator -> src/data/demo.json.
// The same JSON can later seed the backend. Re-run with: npm run seed
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const NOW = new Date("2026-09-28T14:00:00Z");

// mulberry32 — small seeded PRNG so every run produces identical data
let seed = 0x7a1e_b21d;
function rand() {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const weighted = (entries) => {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [v, w] of entries) if ((r -= w) <= 0) return v;
  return entries[0][0];
};
const sample = (arr, n) => {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
};
const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(rand() * 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
const daysFromNow = (d) => new Date(NOW.getTime() + d * 86400000);
const isoDate = (d) => d.toISOString().slice(0, 10);

const FIRST = ["Aarav","Priya","Marcus","Elena","Tomasz","Ngozi","Diego","Hana","Rohan","Claire","Kwame","Yuki","Samir","Ingrid","Mateo","Leila","Owen","Sofia","Vikram","Adaeze","Lucas","Mei","Farid","Nadia","Jonah","Ana","Ravi","Grace","Emeka","Sven","Isabel","Arjun","Tessa","Omar","Lina","Kofi","Julia","Deepa","Nikolai","Rosa","Tariq","Ellen","Chen","Maya","Andrés","Freya","Sanjay","Imani","Pavel","Keiko"];
const LAST = ["Mehta","Okafor","Lindqvist","Ramírez","Nowak","Chen","Adeyemi","Sato","Iyer","Dubois","Mensah","Tanaka","Haddad","Berg","Rossi","Karimi","Walsh","Petrov","Nair","Eze","Moreau","Lin","Rahman","Kowalski","Brennan","Silva","Kapoor","Hughes","Obi","Larsen","Castillo","Reddy","Fischer","Aziz","Novak","Asante","Keller","Pillai","Volkov","Ortega","Qureshi","Doyle","Wu","Patel","Herrera","Nielsen","Rao","Bello","Horvat","Mori"];

const METROS = [
  ["Charlotte, NC", "ET"], ["Atlanta, GA", "ET"], ["Jersey City, NJ", "ET"], ["Boston, MA", "ET"],
  ["Raleigh, NC", "ET"], ["Columbus, OH", "ET"], ["Tampa, FL", "ET"], ["Reston, VA", "ET"],
  ["Dallas, TX", "CT"], ["Austin, TX", "CT"], ["Chicago, IL", "CT"], ["Minneapolis, MN", "CT"],
  ["Denver, CO", "MT"], ["Phoenix, AZ", "MT"], ["Salt Lake City, UT", "MT"],
  ["Seattle, WA", "PT"], ["San Jose, CA", "PT"], ["Portland, OR", "PT"], ["Irvine, CA", "PT"],
];

const DISCIPLINES = {
  "Data & AI": {
    titles: ["Data Engineer", "ML Engineer", "Analytics Engineer", "Data Architect", "MLOps Engineer", "Applied AI Engineer"],
    core: ["Python", "Spark", "Databricks", "Snowflake", "dbt", "Airflow", "Kafka", "PyTorch", "SQL", "Scala", "LangChain", "SageMaker", "Vertex AI", "Delta Lake"],
    projects: [
      ["Real-time fraud scoring pipeline", "Kafka → Spark Structured Streaming feature pipeline scoring 42k card transactions/sec with sub-200ms p99."],
      ["Lakehouse migration", "Moved 3.1 PB from on-prem Hadoop to Databricks Delta Lake; retired 140 legacy Oozie jobs."],
      ["Claims triage model", "Gradient-boosted classifier routing insurance claims; cut manual review queue by 37%."],
      ["Retrieval-augmented support assistant", "RAG service over 1.2M policy documents with pgvector, eval harness and PII guardrails."],
      ["Demand forecasting platform", "Hierarchical forecasts for 18k SKUs across 900 stores, retrained nightly on SageMaker Pipelines."],
      ["Regulatory reporting marts", "dbt models feeding CCAR / FR Y-14 submissions with column-level lineage in Unity Catalog."],
    ],
  },
  "DevOps / Cloud": {
    titles: ["DevOps Engineer", "Site Reliability Engineer", "Cloud Architect", "Platform Engineer", "Cloud Security Engineer", "Kubernetes Engineer"],
    core: ["Terraform", "Kubernetes", "AWS", "Azure", "GCP", "ArgoCD", "GitHub Actions", "Ansible", "Prometheus", "Istio", "Go", "Helm", "Datadog", "Vault"],
    projects: [
      ["Multi-account AWS landing zone", "Control Tower + Terraform baseline for 86 accounts with SCP guardrails and centralized logging."],
      ["EKS platform consolidation", "Collapsed 14 self-managed clusters into 3 EKS clusters on Karpenter; 41% compute savings."],
      ["Zero-downtime datacenter exit", "Migrated 220 VMs and 38 Oracle schemas to Azure with blue/green cutover over four weekends."],
      ["GitOps delivery pipeline", "ArgoCD app-of-apps for 300+ services, progressive delivery with Argo Rollouts and SLO gates."],
      ["SOC 2 control automation", "Policy-as-code with OPA and Vault dynamic secrets; audit evidence collection fully automated."],
      ["Observability overhaul", "OpenTelemetry rollout across 120 services; MTTR down from 94 to 22 minutes."],
    ],
  },
  "Full-Stack": {
    titles: ["Full-Stack Engineer", "Senior React Engineer", "Java Full-Stack Engineer", ".NET Full-Stack Engineer", "Node.js Engineer", "Frontend Architect"],
    core: ["TypeScript", "React", "Next.js", "Node.js", "Java", "Spring Boot", "C#", ".NET", "PostgreSQL", "GraphQL", "Angular", "Python", "FastAPI", "Redis"],
    projects: [
      ["Digital account opening", "Next.js + Spring Boot onboarding flow for a retail bank; KYC completion up 23%, WCAG 2.1 AA."],
      ["Store associate mobile app", "React Native inventory and BOPIS app deployed to 14k devices across 1,100 stores."],
      ["Loan origination portal", ".NET 8 microservices with event-sourced underwriting workflow and Angular front end."],
      ["Design system rollout", "Tokenized React component library adopted by 23 product teams; Storybook with visual regression."],
      ["Checkout re-platform", "Headless commerce on Node.js/GraphQL handling 9k orders/min at Black Friday peak."],
      ["Provider scheduling system", "FHIR-compliant appointment platform for a 40-hospital network; HL7 integration layer."],
    ],
  },
};

const CERTS = {
  "Data & AI": ["Databricks Data Engineer Professional", "SnowPro Advanced: Data Engineer", "AWS Machine Learning Specialty", "Google Professional ML Engineer"],
  "DevOps / Cloud": ["AWS Solutions Architect Professional", "CKA", "CKS", "HashiCorp Terraform Associate", "Azure Solutions Architect Expert"],
  "Full-Stack": ["AWS Developer Associate", "Oracle Java SE 17 Developer", "Microsoft Azure Developer Associate"],
};

// Upper bound on years of experience per technology (its age as of 2026).
const TECH_AGE = {
  React: 12, "Next.js": 9, TypeScript: 13, "Node.js": 16, GraphQL: 10, Angular: 15, FastAPI: 7, Redis: 16, "Spring Boot": 11, ".NET": 20,
  Kubernetes: 11, Terraform: 11, ArgoCD: 7, "GitHub Actions": 6, Helm: 9, Istio: 8, Go: 14, Prometheus: 11, Datadog: 12, Vault: 10, Ansible: 13,
  Spark: 13, Databricks: 11, Snowflake: 10, dbt: 9, Airflow: 10, Kafka: 14, PyTorch: 9, LangChain: 3, SageMaker: 8, "Vertex AI": 5, "Delta Lake": 7, Scala: 18,
  AWS: 18, Azure: 15, GCP: 13,
};

const DOMAINS = ["Banking", "Capital Markets", "Insurance", "Retail", "Healthcare", "Logistics", "Public Sector", "Telecom"];

const VETTERS = ["R. Iyer", "M. Castillo", "J. Brennan", "S. Okafor"];

const candidates = [];
const usedNames = new Set();
let code = 1018;

for (let i = 0; i < 148; i++) {
  const discipline = weighted([["Data & AI", 36], ["DevOps / Cloud", 32], ["Full-Stack", 32]]);
  const d = DISCIPLINES[discipline];
  let first, last;
  do { first = pick(FIRST); last = pick(LAST); } while (usedNames.has(first + last));
  usedNames.add(first + last);

  const years = weighted([[int(4, 6), 22], [int(7, 10), 40], [int(11, 15), 28], [int(16, 22), 10]]);
  const seniority = years >= 14 ? "Principal" : years >= 10 ? "Lead" : years >= 6 ? "Senior" : "";
  const baseTitle = pick(d.titles);
  const title = baseTitle.startsWith("Senior") || !seniority ? baseTitle : `${seniority} ${baseTitle}`;

  const skills = sample(d.core, int(5, 7)).map((skill, idx) => ({
    skill,
    years: Math.max(1, Math.min(years - idx - int(0, 3), TECH_AGE[skill] ?? years)),
    primary: idx < 3,
  }));

  const clouds = discipline === "DevOps / Cloud"
    ? sample(["AWS", "Azure", "GCP"], weighted([[1, 45], [2, 45], [3, 10]]))
    : sample(["AWS", "Azure", "GCP"], weighted([[1, 70], [2, 27], [3, 3]]));

  const workAuthorization = weighted([["US_CITIZEN", 44], ["GREEN_CARD", 22], ["H1B", 20], ["EAD_OPT", 9], ["TN", 5]]);
  const clearance = workAuthorization === "US_CITIZEN"
    ? weighted([["None", 62], ["Public Trust", 18], ["Secret", 14], ["Top Secret", 6]])
    : "None";

  const benchStage = weighted([["Available", 60], ["Vetting", 11], ["Onboarding", 7], ["Interview", 14], ["Placed", 8]]);
  let availability, availableFrom = null;
  if (benchStage === "Placed") {
    availability = "PLACED";
    availableFrom = isoDate(daysFromNow(int(60, 200)));
  } else {
    availability = weighted([["IMMEDIATE", 58], ["TWO_WEEKS", 27], ["SPECIFIC_DATE", 15]]);
    if (availability === "TWO_WEEKS") availableFrom = isoDate(daysFromNow(int(8, 14)));
    if (availability === "SPECIFIC_DATE") availableFrom = isoDate(daysFromNow(int(16, 45)));
  }

  // Rates track seniority and discipline; C2C carries a ~22% premium over W2.
  const base = { "Data & AI": 78, "DevOps / Cloud": 74, "Full-Stack": 66 }[discipline];
  const rateC2C = Math.round((base + years * 3.1 + int(-8, 12)) / 5) * 5;
  const rateW2 = Math.round((rateC2C * 0.82) / 1) ;

  const screen = benchStage === "Onboarding" ? null : Math.min(98, Math.max(71, Math.round(76 + years * 0.9 + int(-6, 10))));

  // Verification freshness: most within the 7-day window, a handful drifting out.
  const verifiedHoursAgo = benchStage === "Placed" ? int(200, 600) : weighted([[int(1, 48), 55], [int(49, 140), 33], [int(170, 260), 12]]);
  const lastVerifiedAt = new Date(NOW.getTime() - verifiedHoursAgo * 3600000).toISOString();

  const [metro, timezone] = pick(METROS);
  const projects = sample(d.projects, int(2, 3)).map(([name, summary]) => ({
    name,
    summary,
    verified: rand() > 0.15,
  }));

  const needsVisa = ["H1B", "EAD_OPT", "TN"].includes(workAuthorization);
  const visaExpiry = needsVisa ? isoDate(daysFromNow(weighted([[int(20, 88), 25], [int(120, 900), 75]]))) : null;
  const stageDone = benchStage !== "Onboarding";
  const compliance = {
    workAuthVerified: stageDone && rand() > 0.03,
    i9Complete: stageDone && rand() > 0.06,
    backgroundCheck: !stageDone ? "Not started" : benchStage === "Vetting" ? weighted([["In progress", 70], ["Cleared", 30]]) : "Cleared",
    referencesCompleted: !stageDone ? 0 : benchStage === "Vetting" ? int(1, 2) : 3,
    referencesRequired: 3,
    ndaSigned: stageDone,
    visaExpiry,
  };

  const c = {
    id: uuid(),
    code: `TC-${code}`,
    firstName: first,
    lastName: last,
    email: `${first.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}.${last.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}@consultants.talentbridge.dev`,
    title,
    discipline,
    yearsExperience: years,
    skills,
    clouds,
    certifications: rand() > 0.35 ? sample(CERTS[discipline], int(1, 2)) : [],
    domains: sample(DOMAINS, int(1, 3)),
    rateC2C,
    rateW2,
    workAuthorization,
    clearance,
    availability,
    availableFrom,
    benchStage,
    technicalScreenScore: screen,
    screenBreakdown: screen === null ? null : {
      systemDesign: Math.min(100, screen + int(-9, 6)),
      coding: Math.min(100, screen + int(-7, 7)),
      domain: Math.min(100, screen + int(-10, 5)),
      communication: Math.min(100, screen + int(-5, 8)),
    },
    screenedBy: screen === null ? null : pick(VETTERS),
    architectureProjects: projects,
    metro,
    timezone,
    remote: weighted([["Remote", 55], ["Hybrid", 35], ["Onsite", 10]]),
    lastVerifiedAt,
    compliance,
    vettingNotes: screen === null ? "Intake call scheduled; technical screen pending." : pick([
      "Strong system design; articulated trade-offs clearly under pressure.",
      "Excellent on production incident walkthrough. Slightly verbose in coding round.",
      "Led migration work end-to-end; references confirm ownership of delivery.",
      "Deep hands-on depth. Prefers remote; will travel quarterly for PI planning.",
      "Client-facing experience with regulated banking stakeholders.",
      "Solid fundamentals, pragmatic. Good fit for greenfield teams.",
    ]),
    isActive: true,
    createdAt: new Date(NOW.getTime() - int(12, 420) * 86400000).toISOString(),
  };
  candidates.push(c);
  code += int(3, 29);
}

const recruiters = [
  ["Keystone Technical Partners", "Dana Whitfield", "dana.whitfield@keystonetp.com"],
  ["Northline Staffing Group", "Chris Adebayo", "c.adebayo@northlinesg.com"],
  ["Harbor & Vale Talent", "Morgan Reyes", "mreyes@harborvale.io"],
  ["Summit Ridge Consulting", "Taylor Nakamura", "tnakamura@summitridge.co"],
  ["Bluewater Workforce", "Jordan Price", "jordan.price@bluewaterwf.com"],
  ["Ironclad IT Staffing", "Riley Osei", "riley@ironcladit.com"],
].map(([companyName, contactName, workEmail], i) => ({
  id: uuid(),
  companyName,
  contactName,
  workEmail,
  phoneNumber: `+1 (${int(201, 989)}) 555-0${int(100, 199)}`,
  isVerified: i !== 5,
  ndaSigned: i !== 5,
  createdAt: new Date(NOW.getTime() - int(40, 700) * 86400000).toISOString(),
}));

const CLIENTS = ["Meridian Federal Bank", "Crestline Retail Holdings", "Atlas Mutual Insurance", "Pinecrest Health System", "Orion Freight & Logistics", "Granite State Credit Union", "Lakeshore Capital Markets"];
const ROLES = {
  "Data & AI": ["Senior Data Engineer – Payments", "ML Engineer – Fraud", "Databricks Lead"],
  "DevOps / Cloud": ["AWS Platform Engineer", "SRE – Trading Systems", "Azure Cloud Architect"],
  "Full-Stack": ["React/Node Engineer – Digital Banking", "Java Full-Stack – Claims", ".NET Engineer – Policy Admin"],
};

const requests = [];
const eligible = candidates.filter((c) => c.benchStage !== "Onboarding");
for (let i = 0; i < 34; i++) {
  const c = pick(eligible);
  const status = c.benchStage === "Placed" ? "ACTIVE"
    : c.benchStage === "Interview" ? weighted([["INTERVIEWING", 70], ["OFFERED", 30]])
    : weighted([["SUBMITTED", 55], ["DRAFT", 12], ["COMPLETED", 8], ["INTERVIEWING", 25]]);
  const createdHoursAgo = int(2, 24 * 30);
  const lockHoursLeft = status === "SUBMITTED" || status === "DRAFT" ? int(-10, 47) : null;
  requests.push({
    id: uuid(),
    recruiterId: i % 3 === 0 ? recruiters[int(1, 5)].id : recruiters[0].id,
    candidateId: c.id,
    clientName: pick(CLIENTS),
    targetRoleTitle: pick(ROLES[c.discipline]),
    proposedRate: c.rateC2C + int(15, 40),
    status,
    lockExpiresAt: lockHoursLeft === null ? null : new Date(NOW.getTime() + lockHoursLeft * 3600000).toISOString(),
    createdAt: new Date(NOW.getTime() - createdHoursAgo * 3600000).toISOString(),
  });
}
requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const data = { generatedAt: NOW.toISOString(), candidates, recruiters, requests, clients: CLIENTS };
const json = JSON.stringify(data, null, 2);
for (const out of [resolve(here, "../src/data/demo.json")]) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, json);
  console.log(`wrote ${out}`);
}
console.log(`${candidates.length} candidates, ${recruiters.length} recruiters, ${requests.length} requests`);
