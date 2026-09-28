import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { candidateByCode, currentRecruiter, isPresentable } from "@/lib/data";
import { availabilityOf, DEMO_NOW, fmtDate, WORK_AUTH_LABEL } from "@/lib/format";
import { LogoMark } from "@/components/icons";
import { buttonClass } from "@/components/ui/button";
import { PrintButton } from "./print-button";

export async function generateMetadata({ params }: PageProps<"/one-sheet/[code]">): Promise<Metadata> {
  const { code } = await params;
  return { title: `${code} one-sheet`, robots: { index: false, follow: false } };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid">
      <h2 className="border-b border-ink pb-1 text-[11px] font-semibold text-ink">{title}</h2>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

export default async function OneSheetPage({ params }: PageProps<"/one-sheet/[code]">) {
  const { code } = await params;
  const c = candidateByCode.get(code);
  if (!c || !isPresentable(c)) notFound();
  const a = availabilityOf(c);
  const s = c.screenBreakdown;

  return (
    <div className="min-h-screen bg-canvas py-8 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-5 flex max-w-[816px] items-center justify-between gap-3 px-4">
        <Link href="/shortlist" className={buttonClass("ghost")}>
          Back to shortlist
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-subtle sm:inline">Redacted: surname, email and phone removed</span>
          <PrintButton />
        </div>
      </div>

      <article className="tnum mx-auto max-w-[816px] bg-white px-6 py-8 text-[12px] leading-relaxed text-ink shadow-[0_1px_0_var(--color-line),0_24px_48px_-24px_rgb(15_23_42/0.25)] ring-1 ring-line sm:px-12 sm:py-10 print:max-w-none print:px-0 print:py-0 print:shadow-none print:ring-0">
        {/* Co-branded header */}
        <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-ink pb-4">
          <div>
            <p className="text-[11px] text-subtle">Presented by</p>
            <p className="text-[15px] font-semibold">{currentRecruiter.companyName}</p>
            <p className="text-[11px] text-muted">
              {currentRecruiter.contactName}, {currentRecruiter.workEmail}, {currentRecruiter.phoneNumber}
            </p>
          </div>
          <div className="flex items-center gap-2 text-right">
            <div>
              <p className="text-[11px] font-medium">Verified by TalentBridge</p>
              <p className="text-[10px] text-subtle">Profile as of {fmtDate(new Date(DEMO_NOW).toISOString())}</p>
            </div>
            <span className="grid size-8 place-items-center rounded-[7px] bg-ink text-white">
              <LogoMark size={18} />
            </span>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[12px] text-subtle">{c.code}</p>
            <h1 className="text-[24px] leading-tight font-semibold tracking-[-0.02em]">{c.title}</h1>
            <p className="text-[13px] text-muted">
              {c.yearsExperience} years, {c.discipline}. {c.metro} ({c.timezone}), {c.remote.toLowerCase()}.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-6 text-right">
            <div>
              <dt className="text-[10px] text-subtle">Available</dt>
              <dd className="text-[14px] font-semibold">{a.label}</dd>
            </div>
            <div>
              <dt className="text-[10px] text-subtle">Work authorization</dt>
              <dd className="text-[14px] font-semibold">{WORK_AUTH_LABEL[c.workAuthorization]}</dd>
            </div>
            <div>
              <dt className="text-[10px] text-subtle">Technical screen</dt>
              <dd className="text-[14px] font-semibold">{c.technicalScreenScore}/100</dd>
            </div>
          </dl>
        </div>

        <div className="mt-7 grid gap-7 sm:grid-cols-[1fr_220px] print:grid-cols-[1fr_220px]">
          <div className="space-y-6">
            <Block title="Architecture and delivery">
              <ul className="space-y-3">
                {c.architectureProjects.map((p) => (
                  <li key={p.name}>
                    <p className="font-semibold">
                      {p.name}
                      {p.verified && <span className="ml-2 text-[10px] font-medium text-avail-ink">Reference verified</span>}
                    </p>
                    <p className="text-muted">{p.summary}</p>
                  </li>
                ))}
              </ul>
            </Block>
            {s && (
              <Block title="Technical screen breakdown">
                <table className="w-full">
                  <tbody>
                    {(
                      [
                        ["System design", s.systemDesign],
                        ["Hands-on coding", s.coding],
                        ["Domain depth", s.domain],
                        ["Communication", s.communication],
                      ] as const
                    ).map(([k, v]) => (
                      <tr key={k}>
                        <td className="w-36 py-1 text-muted">{k}</td>
                        <td className="py-1">
                          <span className="block h-1.5 rounded-full bg-line">
                            <span className="block h-full rounded-full bg-ink" style={{ width: `${v}%` }} />
                          </span>
                        </td>
                        <td className="w-10 py-1 text-right font-semibold">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-1.5 text-[10px] text-subtle">90-minute live panel with a senior engineer in the same discipline.</p>
              </Block>
            )}
          </div>

          <div className="space-y-6">
            <Block title="Stack">
              <table className="w-full">
                <tbody>
                  {c.skills.map((x) => (
                    <tr key={x.skill}>
                      <td className={x.primary ? "py-0.5 font-semibold" : "py-0.5"}>{x.skill}</td>
                      <td className="py-0.5 text-right text-muted">{x.years} yrs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Block>
            <Block title="Cloud">
              <p>{c.clouds.join(", ")}</p>
            </Block>
            {c.certifications.length > 0 && (
              <Block title="Certifications">
                <ul>
                  {c.certifications.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </Block>
            )}
            <Block title="Industries">
              <p>{c.domains.join(", ")}</p>
            </Block>
            <Block title="Compliance">
              <ul className="space-y-0.5">
                <li>Work authorization verified</li>
                <li>Form I-9 complete</li>
                <li>Background check cleared</li>
                <li>{c.compliance.referencesCompleted} references completed</li>
                {c.clearance !== "None" && <li>{c.clearance} clearance</li>}
              </ul>
            </Block>
          </div>
        </div>

        <footer className="mt-10 border-t border-line pt-3 text-[10px] text-subtle">
          This profile is redacted. Direct contact details are held by {currentRecruiter.companyName}. Engagement through TalentBridge terms only.
        </footer>
      </article>
    </div>
  );
}
