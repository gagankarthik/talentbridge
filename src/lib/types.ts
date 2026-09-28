// Mirrors the PostgreSQL schema in PRD §6 (camelCased) plus vetting detail.

export type WorkAuth = "US_CITIZEN" | "GREEN_CARD" | "H1B" | "EAD_OPT" | "TN";
export type Availability = "IMMEDIATE" | "TWO_WEEKS" | "SPECIFIC_DATE" | "PLACED";
export type EngagementStatus = "DRAFT" | "SUBMITTED" | "INTERVIEWING" | "OFFERED" | "ACTIVE" | "COMPLETED";
export type Discipline = "Data & AI" | "DevOps / Cloud" | "Full-Stack";
export type BenchStage = "Onboarding" | "Vetting" | "Available" | "Interview" | "Placed";
export type Clearance = "None" | "Public Trust" | "Secret" | "Top Secret";
export type Timezone = "ET" | "CT" | "MT" | "PT";
export type Cloud = "AWS" | "Azure" | "GCP";

export interface Skill {
  skill: string;
  years: number;
  primary: boolean;
}

export interface Project {
  name: string;
  summary: string;
  verified: boolean;
}

export interface Compliance {
  workAuthVerified: boolean;
  i9Complete: boolean;
  backgroundCheck: "Cleared" | "In progress" | "Not started";
  referencesCompleted: number;
  referencesRequired: number;
  ndaSigned: boolean;
  visaExpiry: string | null;
}

export interface Candidate {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  discipline: Discipline;
  yearsExperience: number;
  skills: Skill[];
  clouds: Cloud[];
  certifications: string[];
  domains: string[];
  rateC2C: number;
  rateW2: number;
  workAuthorization: WorkAuth;
  clearance: Clearance;
  availability: Availability;
  availableFrom: string | null;
  benchStage: BenchStage;
  technicalScreenScore: number | null;
  screenBreakdown: { systemDesign: number; coding: number; domain: number; communication: number } | null;
  screenedBy: string | null;
  architectureProjects: Project[];
  metro: string;
  timezone: Timezone;
  remote: "Remote" | "Hybrid" | "Onsite";
  lastVerifiedAt: string;
  compliance: Compliance;
  vettingNotes: string;
  isActive: boolean;
  createdAt: string;
}

/** What a recruiter is allowed to see before a request is placed. */
export type BlindCandidate = Omit<Candidate, "firstName" | "lastName" | "email" | "vettingNotes" | "screenedBy">;

export interface RecruiterPartner {
  id: string;
  companyName: string;
  contactName: string;
  workEmail: string;
  phoneNumber: string;
  isVerified: boolean;
  ndaSigned: boolean;
  createdAt: string;
}

export interface TalentRequest {
  id: string;
  recruiterId: string;
  candidateId: string;
  clientName: string;
  targetRoleTitle: string;
  proposedRate: number;
  status: EngagementStatus;
  lockExpiresAt: string | null;
  createdAt: string;
}
