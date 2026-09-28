// Platform (TalentBridge staff) side of the multi-tenant model: every
// customer organization, the internal team, and the platform audit log.
// Demo data; in production this is served by the admin API.

import type { OrgRole } from "./org";

export type OrgStatus = "active" | "onboarding" | "suspended";
export type Plan = "Pilot" | "Partner" | "Enterprise";
export type StaffRole = "platform_admin" | "talent_ops" | "compliance" | "client_partner";

export interface PlatformOrg {
  id: string;
  name: string;
  domain: string;
  type: "Staffing agency" | "Enterprise";
  plan: Plan;
  seats: number;
  members: number;
  status: OrgStatus;
  owner: { name: string; email: string; invitePending?: boolean };
  clientPartner: string;
  sso: boolean;
  mfaRequired: boolean;
  createdAt: string; // ISO date
  lastActive: string | null; // ISO
  activeHolds: number;
  requests30: number;
}

export interface OrgMember {
  name: string;
  email: string;
  role: OrgRole;
  status: "active" | "invited";
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  orgs: string[]; // org ids for client partners
  lastActive: string;
}

export interface AuditEvent {
  id: string;
  at: string; // ISO
  actor: string;
  actorType: "platform" | "customer" | "system";
  orgId: string | null;
  action: string;
  detail: string;
}

export const STAFF_ROLES: { id: StaffRole; name: string; summary: string }[] = [
  { id: "platform_admin", name: "Platform admin", summary: "Creates organizations, changes plans, suspends access and approves support sessions." },
  { id: "talent_ops", name: "Talent operations", summary: "Onboards consultants and runs the bench tracker." },
  { id: "compliance", name: "Compliance", summary: "Verifies work authorization and clears the compliance queue." },
  { id: "client_partner", name: "Client partner", summary: "Supports assigned customer organizations and can start support sessions for them." },
];

export const PLANS: { id: Plan; seats: number; note: string }[] = [
  { id: "Pilot", seats: 5, note: "30-day evaluation" },
  { id: "Partner", seats: 25, note: "Staffing agencies" },
  { id: "Enterprise", seats: 100, note: "SSO, audit export, dedicated partner" },
];

export const ORGS: PlatformOrg[] = [
  { id: "org_keystone", name: "Keystone Technical Partners", domain: "keystonetp.com", type: "Staffing agency", plan: "Partner", seats: 25, members: 7, status: "active", owner: { name: "Dana Whitfield", email: "dana.whitfield@keystonetp.com" }, clientPartner: "Alex Moreno", sso: true, mfaRequired: true, createdAt: "2025-03-14", lastActive: "2026-09-28T13:40:00Z", activeHolds: 10, requests30: 17 },
  { id: "org_northline", name: "Northline Staffing Group", domain: "northlinesg.com", type: "Staffing agency", plan: "Enterprise", seats: 100, members: 41, status: "active", owner: { name: "Chris Adebayo", email: "c.adebayo@northlinesg.com" }, clientPartner: "Alex Moreno", sso: true, mfaRequired: true, createdAt: "2024-11-02", lastActive: "2026-09-28T12:10:00Z", activeHolds: 22, requests30: 64 },
  { id: "org_harbor", name: "Harbor & Vale Talent", domain: "harborvale.io", type: "Staffing agency", plan: "Partner", seats: 25, members: 23, status: "active", owner: { name: "Morgan Reyes", email: "mreyes@harborvale.io" }, clientPartner: "Jamie Lin", sso: false, mfaRequired: true, createdAt: "2025-06-20", lastActive: "2026-09-27T17:30:00Z", activeHolds: 6, requests30: 21 },
  { id: "org_meridian", name: "Meridian Federal Bank", domain: "meridianfed.com", type: "Enterprise", plan: "Enterprise", seats: 100, members: 12, status: "active", owner: { name: "Priya Shah", email: "p.shah@meridianfed.com" }, clientPartner: "Jamie Lin", sso: true, mfaRequired: true, createdAt: "2025-09-08", lastActive: "2026-09-28T10:05:00Z", activeHolds: 3, requests30: 9 },
  { id: "org_summit", name: "Summit Ridge Consulting", domain: "summitridge.co", type: "Staffing agency", plan: "Pilot", seats: 5, members: 2, status: "onboarding", owner: { name: "Taylor Nakamura", email: "tnakamura@summitridge.co", invitePending: true }, clientPartner: "Alex Moreno", sso: false, mfaRequired: false, createdAt: "2026-09-24", lastActive: null, activeHolds: 0, requests30: 0 },
  { id: "org_bluewater", name: "Bluewater Workforce", domain: "bluewaterwf.com", type: "Staffing agency", plan: "Partner", seats: 25, members: 24, status: "active", owner: { name: "Jordan Price", email: "jordan.price@bluewaterwf.com" }, clientPartner: "Jamie Lin", sso: false, mfaRequired: false, createdAt: "2025-01-15", lastActive: "2026-09-26T15:45:00Z", activeHolds: 4, requests30: 12 },
  { id: "org_ironclad", name: "Ironclad IT Staffing", domain: "ironcladit.com", type: "Staffing agency", plan: "Partner", seats: 25, members: 9, status: "suspended", owner: { name: "Riley Osei", email: "riley@ironcladit.com" }, clientPartner: "Alex Moreno", sso: false, mfaRequired: false, createdAt: "2025-04-30", lastActive: "2026-08-14T09:00:00Z", activeHolds: 0, requests30: 0 },
];

export const ORG_MEMBERS: Record<string, OrgMember[]> = {
  org_northline: [
    { name: "Chris Adebayo", email: "c.adebayo@northlinesg.com", role: "owner", status: "active" },
    { name: "Lena Brooks", email: "l.brooks@northlinesg.com", role: "admin", status: "active" },
    { name: "Omar Haddad", email: "o.haddad@northlinesg.com", role: "recruiter", status: "active" },
    { name: "Grace Kim", email: "g.kim@northlinesg.com", role: "account_manager", status: "active" },
  ],
  org_summit: [
    { name: "Taylor Nakamura", email: "tnakamura@summitridge.co", role: "owner", status: "invited" },
    { name: "Ben Okoro", email: "b.okoro@summitridge.co", role: "recruiter", status: "invited" },
  ],
};

export const STAFF: StaffMember[] = [
  { id: "s1", name: "Avery Morgan", email: "avery.morgan@talentbridge.com", role: "platform_admin", orgs: [], lastActive: "2026-09-28T13:55:00Z" },
  { id: "s2", name: "Alex Moreno", email: "alex.moreno@talentbridge.com", role: "client_partner", orgs: ["org_keystone", "org_northline", "org_summit", "org_ironclad"], lastActive: "2026-09-28T12:30:00Z" },
  { id: "s3", name: "Jamie Lin", email: "jamie.lin@talentbridge.com", role: "client_partner", orgs: ["org_harbor", "org_meridian", "org_bluewater"], lastActive: "2026-09-28T11:15:00Z" },
  { id: "s4", name: "R. Iyer", email: "r.iyer@talentbridge.com", role: "talent_ops", orgs: [], lastActive: "2026-09-28T10:40:00Z" },
  { id: "s5", name: "M. Castillo", email: "m.castillo@talentbridge.com", role: "talent_ops", orgs: [], lastActive: "2026-09-27T18:05:00Z" },
  { id: "s6", name: "S. Okafor", email: "s.okafor@talentbridge.com", role: "compliance", orgs: [], lastActive: "2026-09-28T09:20:00Z" },
];

/** Signed-in platform user for the demo. */
export const CURRENT_STAFF = STAFF[0];

export const AUDIT: AuditEvent[] = [
  { id: "a1", at: "2026-09-28T13:40:00Z", actor: "Dana Whitfield", actorType: "customer", orgId: "org_keystone", action: "Placed hold", detail: "TC-3009 for Meridian Federal Bank" },
  { id: "a2", at: "2026-09-28T12:52:00Z", actor: "Alex Moreno", actorType: "platform", orgId: "org_northline", action: "Support session ended", detail: "Duration 22 minutes. Reason: SSO login issue" },
  { id: "a3", at: "2026-09-28T12:30:00Z", actor: "Alex Moreno", actorType: "platform", orgId: "org_northline", action: "Support session started", detail: "Reason: SSO login issue" },
  { id: "a4", at: "2026-09-28T11:05:00Z", actor: "Chris Adebayo", actorType: "customer", orgId: "org_northline", action: "Changed member role", detail: "Omar Haddad from Viewer to Recruiter" },
  { id: "a5", at: "2026-09-28T09:00:00Z", actor: "System", actorType: "system", orgId: null, action: "Hold expiry sweep", detail: "4 holds released automatically" },
  { id: "a6", at: "2026-09-27T16:20:00Z", actor: "Avery Morgan", actorType: "platform", orgId: "org_summit", action: "Created organization", detail: "Pilot plan, 5 seats. Owner invite sent to tnakamura@summitridge.co" },
  { id: "a7", at: "2026-09-26T10:10:00Z", actor: "Morgan Reyes", actorType: "customer", orgId: "org_harbor", action: "Exported profiles", detail: "24 blind profiles to CSV" },
  { id: "a8", at: "2026-09-25T14:00:00Z", actor: "Avery Morgan", actorType: "platform", orgId: "org_meridian", action: "Changed plan", detail: "Partner to Enterprise, 100 seats" },
  { id: "a9", at: "2026-08-14T09:30:00Z", actor: "Avery Morgan", actorType: "platform", orgId: "org_ironclad", action: "Suspended organization", detail: "Unsigned partner agreement" },
];
