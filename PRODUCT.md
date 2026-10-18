# TalentBridge — Product overview

> One page that explains what TalentBridge is, who it serves, how it works, and what we are building.
> It is the single source of product truth: design, copy and engineering decisions should agree with it.

---

## 1. In one sentence

**TalentBridge is an IT staffing partner with its own software platform.** It keeps a bench of senior engineers who are already technically screened, compliance-cleared and confirmed available. Enterprises and staffing agencies browse them as **blind profiles**, reserve one with a **48-hour hold**, and have the engineer working **within 48 hours** of choosing.

## 2. The problem

| Who | Pain today |
|---|---|
| **Enterprise hiring managers** (banks, insurers, healthcare, public sector) | Contract searches take weeks. Resumes are unverified. Compliance (work authorization, I-9, background) blocks start dates *after* a candidate is chosen. |
| **Staffing agencies** | Their own benches are thin. Several agencies submit the same engineer to the same client, which embarrasses everyone. Vetting every candidate themselves is expensive. |
| **Engineers (consultants)** | They repeat technical screens for every agency, their details get spread around without consent, and they sit idle between contracts. |

## 3. The idea: three mechanisms competitors don't combine

1. **Vetted before you ask.** Every engineer passes four checks *before* any client sees them:
   - a 90-minute live technical panel with a senior engineer from the same discipline, scored on system design, coding, domain depth and communication;
   - compliance: work authorization matched through E-Verify, I-9 reviewed, background check cleared, references (e.g. 3 of 3) and NDA;
   - a weekly availability re-confirmation (anyone who goes silent is held back);
   - matching and deployment.
2. **Blind profiles.** Clients see skills, years, screen scores, work authorization, availability and rate, but never the name or contact details. Every profile has a code (e.g. `TC-1141`). *Brand motif: the redaction bar over the name.*
3. **48-hour holds.** A recruiter places a hold on an engineer for a named end client. While the hold runs, no other agency can submit that engineer to that client. This ends duplicate submissions.

**The result:** a matched shortlist in 1 business day, a start 48 hours after selection, a free replacement in the first 2 weeks, and no fee unless you hire.

## 4. Who uses it

| Audience | What they do | Where |
|---|---|---|
| **Enterprises** | Fill contract, contract-to-hire and delivery-team roles | Public site → requisition; customer workspace |
| **Staffing agencies (bench partners)** | Submit TalentBridge engineers to their own clients under their own brand, with redacted co-branded profiles | Customer workspace |
| **Consultants (engineers)** | Apply once, pass one screen, get matched to roles; identity stays private until they agree | Public site (careers) |
| **TalentBridge staff** | Run organizations, candidates, the bench, compliance and rates | Platform console |

## 5. What we sell (services)

| Service | For | Key terms |
|---|---|---|
| Contract staffing | Enterprises | Shortlist in 1 business day · start in 48 hours · 3–18 months · W2 or C2C |
| Agency bench partnerships | Staffing agencies | Blind, co-branded profiles · 48-hour client holds · partner portal |
| Contract-to-hire | Enterprises | 3–6 month contract, then conversion on terms agreed up front |
| Dedicated delivery teams | Enterprises | Pods of 3–8 engineers plus a delivery lead · 2-week ramp · 2-week notice to scale |
| Compliance and onboarding | Both | Verified before presentation · visa expiry tracked (90-day lookahead, escalated at 45) |
| Technical vetting | Both | 90-minute panel · 4 scored dimensions · re-verification every 7 days |

- **Disciplines:** Data & AI · Cloud & DevOps · Full-Stack.
- **Industries:** Banking · Capital Markets · Insurance · Healthcare · Retail · Public Sector (including cleared engineers).
- **Work authorizations:** US citizen · green card · H-1B (transfer ready) · EAD · TN.

## 6. The product: three surfaces

### 6.1 Public website (`src/app/(site)`): *persuade*
Its job is to get a requisition sent, a partnership started, or an engineer to apply.

| Page | Purpose |
|---|---|
| `/` Home | The hero is a **live role builder** (discipline · seniority · start) that matches against the real bench and shows matching blind profiles. Below it: how vetting works, solutions by audience, industries, the requisition form and the FAQ. |
| `/services/[slug]` | One page per service (6) |
| `/recruiters` | Browse the bench / job-description matcher for agencies |
| `/careers` | Open roles (client named by industry only) and the consultant application |
| `/company` | About, the vetting standard, head office |
| `/contact` | Hiring / partner / candidate contact. Understands `?profile=`, `?industry=` and `?who=`. |
| `/privacy`, `/terms` | Legal |
| `/login` | Sign-in to the workspace |

### 6.2 Customer workspace (`src/app/(workspace)`): *operate*
For people at enterprises and agencies (a **multi-tenant organization**).

| Page | What it does |
|---|---|
| Dashboard | Available now, active holds, submissions, submission→interview rate; holds expiring soonest; funnel; bench by practice |
| Talent inventory | Search and filter blind profiles; list or grid; detail sheet; **place a 48-hour hold**; "Match a job spec" |
| Shortlist | Saved engineers to compare |
| Requests and holds | Every hold and submission, with status (Draft → Submitted → Interviewing → Offered → Active → Completed) and a live lock countdown |
| Settings: Organization | Org details, members, roles and permissions, security (SSO, MFA, allowed domains) |
| Settings: Profile | Personal profile, password, sessions, notifications |
| Help | Support contact, messages, keyboard shortcuts |

**Org roles and permissions:**

| Role | Permissions |
|---|---|
| Owner | Everything, including billing and deleting the org; one per org |
| Admin | Members, roles and security |
| Recruiter | Search, export, see rates, place holds |
| Account manager | Search, see rates, place holds, see all requests; cannot export |
| Viewer | Read only |

**Plans:**

| Plan | Seats | Notes |
|---|---|---|
| Pilot | 5 | 30-day evaluation |
| Partner | 25 | Staffing agencies |
| Enterprise | 100 | SSO, audit export, a dedicated partner |

### 6.3 Platform console (`src/app/(admin)`): *operate*
For TalentBridge staff.

| Page | What it does |
|---|---|
| Overview | Active orgs, onboarding, seats, holds, compliance flags; bench by stage; items needing attention |
| Organizations (+ detail) | Every customer org: plan, members, security, support sessions |
| Platform team | Internal staff and their assigned orgs |
| Audit log | Every significant platform event, filterable |
| Candidates (+ record, + new) | Full internal records, with names, readiness checks and the "blocked from customers" state |
| Ops · Bench tracker | Kanban by bench stage (Onboarding → Vetting → Available → Interview → Placed), with drag to move |
| Ops · Compliance | The queue of issues (unverified authorization, incomplete I-9, expiring visas, background checks or references in progress, stale availability) |
| Ops · Rates and margin | Rate card by discipline and seniority (p25/p50/p75), a pay→bill calculator (W2 burden vs C2C) and a margin breakdown |

**Staff roles:**
- **Platform admin:** orgs, plans and support access.
- **Talent operations:** onboarding and the bench.
- **Compliance:** verification and the queue.
- **Client partner:** supports assigned orgs.

## 7. Core rules (business logic)

- **Presentation gate.** A candidate reaches customers only if all of these hold:
  - they are active;
  - their stage is Available or Interview;
  - their work authorization is verified;
  - their background check is cleared.
- **Blind by default.** Customers never receive the name, email, vetting notes or screener. Identity is shared only when the consultant agrees to a specific submission.
- **Hold.** 48 hours, for one engineer and one named end client, exclusive across agencies. It can be placed only while the engineer's availability is fresh (re-confirmed within 7 days).
- **Compliance flags.** Visas are flagged at ≤ 90 days and escalated at ≤ 45. Stale availability blocks holds.
- **Commercials.** W2 or corp-to-corp. Contract-to-hire conversion terms are fixed up front. Free replacement within 2 weeks. No placement, no fee. Consultants never pay anything.

## 8. Key user journeys

1. **Enterprise:** home → build a role (or send a requisition) → shortlist in 1 business day → pick an engineer → start in 48 hours.
2. **Agency recruiter:** sign in → talent inventory → filter → shortlist → place a 48-hour hold for a named client → submit → track in Requests.
3. **Consultant:** careers → apply → intake call → 90-minute panel → compliance → on the bench → weekly re-confirmation → matched.
4. **TalentBridge ops:** new candidate → vetting → clear compliance queue → bench Available → monitor holds and rates.

## 9. Brand and design direction

- **Colour:** deep navy `#0b1b33` (header, footer, one band per page), white, and a single action blue `#2558e0` (`#5b8cff` on navy). Status colours are reserved for status: green, amber, red, neutral.
- **Type:** General Sans (self-hosted).
- **Logo:** a bridge deck over an arched pier. The deck doubles as the redaction bar of a blind profile.
- **Feel:** enterprise, in the Workday / Salesforce register. Calm, structured, uncluttered, trustworthy, alive (colour photography, real product data on show). Never generic or AI-templated.
- **App shell:** a navy global header with the single search (⌘K) and a white sidebar (approved; do not change). Content sits on a canvas with bordered cards and 52px table rows.
- **Quality bar:** AA contrast everywhere; responsive at 390 / 768 / 1024 / 1440. The 11-point acceptance rubric covers sections, layout, hierarchy, copy, spacing, imagery, components, data, brand, UX flow and polish.

## 10. Current state (honest)

This is a **working demo / prototype**, not production yet:

| Area | Today | Production plan |
|---|---|---|
| Data | Seeded demo dataset (`src/data/demo.json`, ~115 candidates) | PostgreSQL schema per the PRD |
| Auth | None. `/dashboard` and `/admin` open directly. | Real auth, SSO, MFA |
| Matching | Keyword-based "match a job spec" | Vector search (pgvector), PRD phase 3 |
| Forms | Validate and confirm locally; nothing is sent | Wired to a backend / CRM |
| Stack | Next.js 16 (App Router), React 19, Tailwind CSS 4, Radix UI, TanStack Query, cmdk | — |

## 11. What must never be invented

No customer logos, testimonials, client names, or business statistics beyond the commitments above. Open roles describe the client by industry only. Demo content shown as product UI comes from the dataset and is labelled as sample where a visitor could mistake it for a live record.
