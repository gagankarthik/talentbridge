// Tenant (customer organization) model for the partner workspace.
// Every customer is an Organization; people belong to it through a Membership
// with one org-scoped role. TalentBridge's own staff roles live separately
// (see PLATFORM_ROLES) and are never assignable by a customer admin.

export type OrgRole = "owner" | "admin" | "recruiter" | "account_manager" | "viewer";

export const ORG_ROLES: { id: OrgRole; name: string; summary: string }[] = [
  { id: "owner", name: "Owner", summary: "Full control, including billing and deleting the organization. One per organization." },
  { id: "admin", name: "Admin", summary: "Manages members, roles, SSO and security settings." },
  { id: "recruiter", name: "Recruiter", summary: "Searches talent, shortlists, places holds and submits." },
  { id: "account_manager", name: "Account manager", summary: "Tracks submissions and holds for their clients; can't export profiles." },
  { id: "viewer", name: "Viewer", summary: "Read-only access to the inventory and reports." },
];

export type Permission =
  | "talent.search"
  | "talent.export"
  | "rates.view"
  | "holds.place"
  | "requests.view_all"
  | "members.manage"
  | "security.manage"
  | "billing.manage";

export const PERMISSIONS: { id: Permission; name: string; group: string }[] = [
  { id: "talent.search", name: "Search talent and view blind profiles", group: "Talent" },
  { id: "talent.export", name: "Export profiles to CSV", group: "Talent" },
  { id: "rates.view", name: "See consultant rates", group: "Talent" },
  { id: "holds.place", name: "Place and release 48-hour holds", group: "Submissions" },
  { id: "requests.view_all", name: "See every team member's requests", group: "Submissions" },
  { id: "members.manage", name: "Invite, remove and change member roles", group: "Administration" },
  { id: "security.manage", name: "Configure SSO, MFA and allowed domains", group: "Administration" },
  { id: "billing.manage", name: "Manage plan and billing", group: "Administration" },
];

export const ROLE_PERMISSIONS: Record<OrgRole, Permission[]> = {
  owner: ["talent.search", "talent.export", "rates.view", "holds.place", "requests.view_all", "members.manage", "security.manage", "billing.manage"],
  admin: ["talent.search", "talent.export", "rates.view", "holds.place", "requests.view_all", "members.manage", "security.manage"],
  recruiter: ["talent.search", "talent.export", "rates.view", "holds.place"],
  account_manager: ["talent.search", "rates.view", "holds.place", "requests.view_all"],
  viewer: ["talent.search"],
};

export const can = (role: OrgRole, p: Permission) => ROLE_PERMISSIONS[role].includes(p);

/** TalentBridge staff roles. Scoped to the platform, not to a customer. */
export const PLATFORM_ROLES = [
  { name: "Platform admin", summary: "Creates organizations, manages plans and support access." },
  { name: "Talent operations", summary: "Onboards consultants and runs the bench tracker." },
  { name: "Compliance", summary: "Verifies work authorization and manages the compliance queue." },
  { name: "Client partner", summary: "Supports assigned customer organizations." },
];

export type MemberStatus = "active" | "invited" | "suspended";

export interface Member {
  id: string;
  name: string;
  email: string;
  title: string;
  role: OrgRole;
  status: MemberStatus;
  lastActive: string | null; // ISO
  mfa: boolean;
}

export const ORGANIZATION = {
  id: "org_keystone",
  name: "Keystone Technical Partners",
  domain: "keystonetp.com",
  industry: "IT staffing agency",
  address: "Columbus, OH",
  plan: "Partner, 25 seats",
  seats: 25,
  createdAt: "2025-03-14",
  sso: { enabled: true, provider: "Okta (SAML 2.0)", enforced: false },
  mfaRequired: true,
  allowedDomains: ["keystonetp.com"],
};

export const MEMBERS: Member[] = [
  { id: "m1", name: "Dana Whitfield", email: "dana.whitfield@keystonetp.com", title: "Director of Recruiting", role: "owner", status: "active", lastActive: "2026-09-28T13:40:00Z", mfa: true },
  { id: "m2", name: "Chris Adebayo", email: "c.adebayo@keystonetp.com", title: "Recruiting Operations", role: "admin", status: "active", lastActive: "2026-09-28T11:05:00Z", mfa: true },
  { id: "m3", name: "Morgan Reyes", email: "m.reyes@keystonetp.com", title: "Senior Technical Recruiter", role: "recruiter", status: "active", lastActive: "2026-09-28T09:12:00Z", mfa: true },
  { id: "m4", name: "Taylor Nakamura", email: "t.nakamura@keystonetp.com", title: "Technical Recruiter", role: "recruiter", status: "active", lastActive: "2026-09-27T16:48:00Z", mfa: false },
  { id: "m5", name: "Jordan Price", email: "j.price@keystonetp.com", title: "Account Manager, Banking", role: "account_manager", status: "active", lastActive: "2026-09-26T14:20:00Z", mfa: true },
  { id: "m6", name: "Riley Osei", email: "r.osei@keystonetp.com", title: "Finance Analyst", role: "viewer", status: "active", lastActive: "2026-09-20T10:00:00Z", mfa: true },
  { id: "m7", name: "Sam Carter", email: "s.carter@keystonetp.com", title: "Technical Recruiter", role: "recruiter", status: "invited", lastActive: null, mfa: false },
];
