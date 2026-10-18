"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { CONTACT } from "@/lib/company";
import { ActionLink } from "@/components/site/premium";
import { IconArrowRight, IconPhone } from "@/components/icons";

const CUTOFF_HOUR = 17; // 5:00 PM Eastern, the end of the business day

/** Today's date and hour in New York, read from the visitor's own clock. */
function easternNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { date: new Date(Date.UTC(get("year"), get("month") - 1, get("day"), 12)), hour: get("hour") };
}

const isWeekend = (d: Date) => d.getUTCDay() === 0 || d.getUTCDay() === 6;
const nextBusinessDay = (d: Date) => {
  const n = new Date(d);
  do n.setUTCDate(n.getUTCDate() + 1);
  while (isWeekend(n));
  return n;
};

/**
 * One business day: a requisition counts from the business day it arrives
 * (after 5 PM or at the weekend, the next one), and the shortlist is due at
 * the end of the business day after that.
 */
function shortlistDue() {
  const { date, hour } = easternNow();
  const received = isWeekend(date) || hour >= CUTOFF_HOUR ? nextBusinessDay(date) : date;
  const due = nextBusinessDay(received);
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }).format(due);
}

/** The close: the enterprise action with a real due date, then the other two ways in. */
export function ClosingCta() {
  // Worked out after mount, from the visitor's clock; the server sends the plain promise
  const [due, setDue] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setDue(shortlistDue());
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
      <div className="relative overflow-hidden rounded-[20px] bg-navy p-8 text-white sm:p-12 lg:col-span-8 lg:p-14">
        <h2 id="cta-h" className="max-w-[18ch] font-display text-[32px] leading-[1.1] font-semibold tracking-[-0.02em] text-balance sm:text-[46px]">
          Send the role. Get a matched shortlist.
        </h2>
        <p className="mt-5 max-w-[46ch] text-[18px] leading-[1.6] text-[#c8d3e6]">
          {due ? (
            <>
              Send it now and your matched shortlist arrives by <span className="font-semibold text-sun">{due}</span>, 5:00 PM Eastern.
            </>
          ) : (
            <>Every requisition gets a matched shortlist within one business day.</>
          )}{" "}
          No placement, no fee.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ActionLink href="/contact?topic=requisition">Send a requisition</ActionLink>
          <a
            href={`tel:${CONTACT.tel}`}
            className="tnum inline-flex h-12 items-center gap-2 rounded-[8px] bg-white/10 px-6 text-[16px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-white/[0.16] active:scale-[0.98]"
          >
            <IconPhone size={17} strokeWidth={1.5} />
            {CONTACT.phone}
          </a>
        </div>
      </div>

      <ul className="grid gap-4 lg:col-span-4 lg:gap-5">
        {[
          { href: "/services/agency-bench-partnerships", who: "For staffing firms", t: "Become a bench partner", d: "Present our cleared engineers under your brand." },
          { href: "/careers#apply", who: "For consultants", t: "Join the bench", d: "One 90-minute panel. Never a fee." },
        ].map((x) => (
          <li key={x.href}>
            <Link
              href={x.href}
              className={cn("group flex h-full flex-col justify-between rounded-[20px] bg-white p-7 transition-colors duration-300 hover:bg-brand-wash")}
            >
              <span>
                <span className="block text-[15px] font-semibold text-brand">{x.who}</span>
                <span className="mt-1 block text-[22px] leading-snug font-semibold tracking-[-0.01em] text-ink">{x.t}</span>
                <span className="mt-2 block text-[16px] leading-[1.55] text-ink-2">{x.d}</span>
              </span>
              <IconArrowRight size={22} strokeWidth={1.5} className="mt-6 text-brand" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
