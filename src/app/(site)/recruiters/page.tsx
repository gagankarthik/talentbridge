import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { presentable, toBlind } from "@/lib/data";
import { container, cta, headGap, section, type } from "@/components/site/styles";
import { HeroBackdrop } from "@/components/site/hero-backdrop";
import { Reveal } from "@/components/motion";
import { InlineRequest } from "@/features/request-engine/talent-request";
import { FreshnessMeter } from "@/components/ui/freshness-meter";
import { AvailabilityPill, CandidateCode, SkillChip, WorkAuthTag } from "@/components/ui/status";
import { IconCalendar, IconEyeOff, IconId, IconShield, IconUsers } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/recruiters" },
  title: "Talent Network",
  description: "Browse pre-vetted, compliance-cleared engineers or match a job description against our bench.",
};

const CONTROLS = [
  { icon: IconId, t: "Work authorization verified", d: "E-Verify match plus document review by our compliance team before any profile is listed." },
  { icon: IconUsers, t: "Live technical panel", d: "90 minutes with a senior engineer in the same discipline, scored on four dimensions." },
  { icon: IconShield, t: "Background screening", d: "Criminal, employment and education checks through an FCRA-compliant provider." },
  { icon: IconCalendar, t: "Weekly availability checks", d: "Consultants re-confirm every 7 days. Stale profiles can't be put on hold." },
  { icon: IconEyeOff, t: "Identity protected", d: "Names and contact details are removed from every profile and one-sheet until you place a hold." },
];

const ANATOMY = [
  { t: "Candidate ID", d: "The name stays hidden until you place a hold. The ID is how you reference them with us." },
  { t: "Verified work authorization", d: "Checked against documents, not self-reported." },
  { t: "Availability date", d: "Confirmed by the consultant within the last 7 days." },
  { t: "Stack with years", d: "Primary skills are highlighted; years come from verified engagements." },
  { t: "Freshness meter", d: "Days left in the verification window." },
];

function Marker({ n }: { n: number }) {
  return <span className="tnum grid size-6 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-semibold text-white">{n}</span>;
}

export default function TalentNetworkPage() {
  const sample = toBlind([...presentable].filter((c) => c.benchStage === "Available").sort((a, b) => (b.technicalScreenScore ?? 0) - (a.technicalScreenScore ?? 0))[2]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <HeroBackdrop />
        <div className={cn(container, "relative grid gap-12 pt-16 pb-20 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:pt-24 lg:pb-24")}>
          <div>
            <p className="text-[14px] font-semibold text-sky">Talent Network</p>
            <h1 className="mt-4 font-display text-[46px] leading-[1] font-light tracking-[-0.035em] text-white sm:text-[68px] lg:text-[80px]">Tell us the role. We&apos;ll show you who&apos;s ready.</h1>
            <p className="mt-6 max-w-[32em] text-[18px] leading-relaxed text-slate-300">
              Paste a job description to rank our bench against it. Every profile has cleared compliance before you see it.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact?topic=requisition" className={cta.white}>
                Send a requisition
              </Link>
              <Link href="/contact?who=agency" className={cta.outlineInverse}>
                Become an agency partner
              </Link>
            </div>
          </div>
          <div id="request" className="scroll-mt-24 rounded-[20px] bg-surface p-5 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] sm:p-7">
            <h2 className="text-[20px] font-semibold tracking-[-0.015em]">Match a job description</h2>
            <p className="mt-1 mb-5 text-[15px] text-muted">Upload the requisition or paste the requirements. Results show why each engineer matched.</p>
            <InlineRequest publicView />
          </div>
        </div>
      </section>

      {/* Anatomy of a blind profile */}
      <section className="bg-canvas">
        <div className={cn(container, section, "grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center")}>
          <Reveal>
            <h2 className={type.h2}>What a blind profile tells you</h2>
            <p className={cn(type.lede, "mt-4 max-w-md")}>Everything a hiring manager decides on. Nothing that lets a client go around you.</p>
            <ol className="mt-10 space-y-4">
              {ANATOMY.map((a, i) => (
                <li key={a.t} className="flex gap-3">
                  <Marker n={i + 1} />
                  <p className="text-[15.5px] leading-relaxed">
                    <span className="font-semibold text-ink">{a.t}.</span> <span className="text-muted">{a.d}</span>
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="relative overflow-hidden rounded-[20px] p-6 sm:p-10">
            <Image src="/images/planning-session.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-night/55" />
            <div className="relative rounded-[20px] bg-surface p-5 shadow-2xl sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2">
                    <Marker n={1} />
                    <CandidateCode code={sample.code} />
                  </p>
                  <p className="mt-2 text-[17px] font-semibold">{sample.title}</p>
                  <p className="tnum text-[13.5px] text-subtle">
                    {sample.yearsExperience} yrs, {sample.discipline}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Marker n={2} />
                <WorkAuthTag auth={sample.workAuthorization} />
                <Marker n={3} />
                <AvailabilityPill c={sample} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-1">
                <span className="mr-1">
                  <Marker n={4} />
                </span>
                {sample.skills.slice(0, 5).map((s) => (
                  <SkillChip key={s.skill} skill={s.skill} years={s.years} strong={s.primary} />
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 border-t border-line pt-3">
                <Marker n={5} />
                <FreshnessMeter lastVerifiedAt={sample.lastVerifiedAt} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section id="controls" className="scroll-mt-24 bg-surface">
        <div className={cn(container, section)}>
          <Reveal className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 className={type.h2}>Our compliance standard</h2>
            <p className={cn(type.lede, "max-w-lg lg:justify-self-end")}>Every consultant clears all five controls before a recruiter or client sees their profile.</p>
          </Reveal>
          <Reveal stagger className={cn(headGap, "grid gap-5 sm:grid-cols-2 lg:grid-cols-5")}>
            {CONTROLS.map((c) => (
              <article key={c.t} className="flex flex-col rounded-[20px] bg-canvas p-6 ring-1 ring-line">
                <span className="grid size-11 place-items-center rounded-full bg-brand-wash text-brand">
                  <c.icon size={20} />
                </span>
                <h3 className="mt-5 text-[16.5px] font-semibold tracking-[-0.01em] text-ink">{c.t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{c.d}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-surface pb-20 lg:pb-28">
        <div className={container}>
          <div className="relative overflow-hidden rounded-[20px] bg-night text-white">
            <Image src="/images/client-briefing.jpg" alt="" fill sizes="(min-width: 1280px) 1280px, 100vw" className="object-cover opacity-35" />
            <div className="absolute inset-0 bg-night/55" />
            <div className="relative grid gap-8 px-8 py-16 sm:px-14 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end">
              <p className="max-w-[16ch] font-display text-[44px] leading-[1] font-light tracking-[-0.03em] sm:text-[64px]">Extend your bench without adding recruiters.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact?who=agency" className={cta.white}>
                  Become a partner
                </Link>
                <Link href="/login" className={cta.outlineInverse}>
                  Partner login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
