import { cn } from "@/lib/cn";
import { IconCheck } from "@/components/icons";

// Product-style visuals for the vetting story: real UI fragments on a
// tinted stage, so each step shows what the client actually receives.

function Stage({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <div className={cn("grid aspect-[4/3] place-items-center rounded-[20px] p-6 sm:p-10", tone)}>{children}</div>;
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("w-full max-w-[400px] rounded-[16px] bg-surface p-5 shadow-[0_24px_48px_-24px_rgb(7_26_20/0.35)] ring-1 ring-line sm:p-6", className)}>{children}</div>;
}

export function ScorecardMock() {
  const rows: [string, number][] = [
    ["System design", 92],
    ["Hands-on coding", 90],
    ["Domain depth", 88],
    ["Communication", 95],
  ];
  return (
    <Stage tone="bg-acc-violet-bg">
      <Panel>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[12px] text-subtle">TC-1141</p>
            <p className="text-[15px] font-semibold">Technical panel scorecard</p>
          </div>
          <p className="font-display text-[34px] leading-none font-light text-acc-violet">91</p>
        </div>
        <ul className="mt-5 space-y-3">
          {rows.map(([k, v]) => (
            <li key={k}>
              <p className="flex justify-between text-[13px]">
                <span className="text-muted">{k}</span>
                <span className="tnum font-semibold">{v}</span>
              </p>
              <span className="mt-1.5 block h-1.5 rounded-full bg-line">
                <span className="block h-full rounded-full bg-acc-violet" style={{ width: `${v}%` }} />
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-line pt-3 text-[12.5px] text-subtle">Reviewed by a principal engineer, 90-minute live session</p>
      </Panel>
    </Stage>
  );
}

export function ComplianceMock() {
  const items = ["Work authorization (E-Verify)", "Form I-9 reviewed", "Background check cleared", "3 of 3 references", "Consultant NDA signed"];
  return (
    <Stage tone="bg-brand-wash">
      <Panel>
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold">Compliance record</p>
          <span className="rounded-full bg-brand px-2.5 py-1 text-[12px] font-semibold text-white">Cleared</span>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {items.map((t) => (
            <li key={t} className="flex items-center gap-3 py-2.5 text-[13.5px]">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-wash text-brand">
                <IconCheck size={12} strokeWidth={2.5} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </Panel>
    </Stage>
  );
}

export function AvailabilityMock() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <Stage tone="bg-sun-wash">
      <Panel>
        <p className="text-[15px] font-semibold">Weekly availability check</p>
        <p className="text-[13px] text-subtle">Confirmed by the consultant this week</p>
        <div className="mt-5 grid grid-cols-7 gap-1.5">
          {days.map((d, i) => (
            <div key={d} className={cn("rounded-[8px] py-2 text-center text-[12px]", i === 0 ? "bg-brand font-semibold text-white" : "bg-paper text-muted")}>
              {d}
              {i === 0 && <IconCheck size={12} strokeWidth={2.5} className="mx-auto mt-1" />}
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between rounded-[10px] bg-paper px-3 py-2.5 text-[13px]">
          <span className="text-muted">Next check</span>
          <span className="font-semibold">In 7 days</span>
        </div>
      </Panel>
    </Stage>
  );
}

export function StartMock() {
  const steps = [
    ["You choose", "Tuesday"],
    ["Contract signed", "Tuesday"],
    ["Onboarding done", "Wednesday"],
    ["First day", "Thursday"],
  ];
  return (
    <Stage tone="bg-coral-wash">
      <Panel>
        <p className="text-[15px] font-semibold">Start plan</p>
        <p className="text-[13px] text-subtle">From selection to first day in 48 hours</p>
        <ol className="mt-5 border-l-2 border-line">
          {steps.map(([t, d], i) => (
            <li key={t} className="relative pb-4 pl-5 last:pb-0">
              <span className={cn("absolute top-1 -left-[7px] size-3 rounded-full ring-2 ring-surface", i === steps.length - 1 ? "bg-coral" : "bg-brand")} />
              <p className="flex justify-between text-[13.5px]">
                <span className="font-medium">{t}</span>
                <span className="text-subtle">{d}</span>
              </p>
            </li>
          ))}
        </ol>
      </Panel>
    </Stage>
  );
}
