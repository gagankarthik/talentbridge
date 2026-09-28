import { IconPlus } from "@/components/icons";

export const FAQS = [
  {
    q: "What does TalentBridge do?",
    a: "We're an IT staffing partner. We maintain a bench of senior engineers, matched to each client's requirement, who have passed a live technical screen and full compliance checks, and we place them with enterprises directly or through staffing agencies.",
  },
  {
    q: "How quickly can a consultant start?",
    a: "You'll get a matched shortlist within one business day. Once you choose a consultant, most start within 48 hours because work authorization, I-9 and background checks are already complete.",
  },
  {
    q: "How do you vet consultants?",
    a: "Every consultant completes a 90-minute live panel with a senior engineer in the same discipline, scored on system design, coding, domain depth and communication. We also verify delivery history with three professional references.",
  },
  {
    q: "Which work authorizations do your consultants hold?",
    a: "US citizens, green card holders, H-1B (transfer ready), EAD and TN. Every status is verified through E-Verify and document review before a profile is shared. Clearance-holding engineers are available for public-sector roles.",
  },
  {
    q: "Can staffing agencies submit your consultants to their own clients?",
    a: "Yes. Agency partners receive redacted, co-branded profiles and can place a 48-hour hold on a consultant for a named end client, which blocks duplicate submissions from other agencies.",
  },
  {
    q: "Do you offer W2 and corp-to-corp?",
    a: "Both. On W2 we handle payroll, benefits and insurance. On corp-to-corp we contract through the consultant's own corporation. Contract-to-hire conversions are available on terms agreed up front.",
  },
  {
    q: "What if a consultant isn't the right fit?",
    a: "If a consultant isn't working out in the first two weeks, we replace them at no additional cost.",
  },
  {
    q: "How do consultants join the bench?",
    a: "Apply through our careers page. After an intake call you'll book the technical panel. Once you pass it and complete compliance checks, you're on the bench and we start matching you to roles.",
  },
];

export const CANDIDATE_FAQS = [
  {
    q: "Who can join the bench?",
    a: "Engineers with four or more years of professional experience who are authorized to work in the US: citizens, green card holders, H-1B (transfer ready), EAD and TN.",
  },
  {
    q: "What does the process look like?",
    a: "A 30-minute intake call with a recruiter, then a 90-minute live technical panel with a senior engineer in your discipline. After that we complete reference, work authorization and background checks.",
  },
  {
    q: "Is my information shared with clients?",
    a: "Not without your say. Clients see a redacted profile with your skills, experience and screen results. Your name and contact details are only shared when you agree to be submitted for a specific role.",
  },
  {
    q: "Can I work on W2 or corp-to-corp?",
    a: "Either. On W2 we run payroll, benefits and insurance. On corp-to-corp we contract with your own corporation.",
  },
  {
    q: "Do I have to pay anything?",
    a: "No. We never charge consultants for screening, placement or visa support.",
  },
];

/** Native <details> accordion: keyboard and screen-reader friendly without JS. */
export function Faq({ items = FAQS }: { items?: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-[18px] font-medium text-ink transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-line-strong transition-all duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-white group-open:ring-ink">
              <IconPlus size={16} />
            </span>
          </summary>
          <p className="anim-fade max-w-3xl pr-14 pb-6 text-[16px] leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
