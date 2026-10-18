import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { presentable } from "@/lib/data";
import { CONTACT } from "@/lib/company";
import { Logo } from "@/components/layout/logo";
import { CountUp } from "@/components/motion";
import { ui } from "@/components/site/page-kit";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Partner login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const available = presentable.filter((c) => c.benchStage === "Available").length;

  return (
    <div className="site grid min-h-svh bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Brand panel: what is waiting behind the door */}
      <aside className="flex flex-col bg-[#0b1b33] px-6 py-8 text-white sm:px-10 lg:px-12 lg:py-10">
        <Logo tone="white" />
        <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[12px]">
          <Image src="/images/engineers-pairing.jpg" alt="Two engineers reviewing work together" fill priority sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
        </div>
        <div className="mt-10 lg:mt-auto lg:pt-10">
          <p className="max-w-[18ch] text-[30px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[36px]">The bench, verified this week.</p>
          <p className="mt-6 max-w-[40ch] text-[16px] leading-[1.6] text-[#c9d3e3]">
            <CountUp value={available} className="font-semibold text-white" /> engineers are available to submit today, each screened, cleared and re-confirmed in the
            last seven days.
          </p>
        </div>
        <p className="mt-12 text-[13px] text-[#c9d3e3] lg:mt-16">© 2026 TalentBridge, Inc. · Powell, Ohio</p>
      </aside>

      <main id="main" className="flex flex-col px-6 py-12 sm:px-10 lg:px-16 lg:py-10">
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center">
          <h1 className="text-[30px] leading-[1.15] font-semibold tracking-[-0.02em] text-[#0b1b33]">Sign in to your workspace</h1>
          <p className="mt-2 text-[16px] leading-[1.55] text-[#3d4a60]">Search the bench, place holds and track every submission.</p>
          <div className="mt-8">
            <LoginForm />
          </div>
          <p className="mt-8 text-[15px] text-[#3d4a60]">
            Not a partner yet?{" "}
            <Link href="/contact?who=agency" className={ui.link}>
              Request access
            </Link>
          </p>
        </div>
        <p className="mx-auto mt-12 w-full max-w-[400px] text-[14px] leading-relaxed text-[#5f6b80]">
          Trouble signing in? Call{" "}
          <a href={`tel:${CONTACT.tel}`} className="tnum font-medium text-[#0b1b33] underline underline-offset-4">
            {CONTACT.phone}
          </a>
          . By signing in you accept our{" "}
          <Link href="/terms" className="font-medium text-[#0b1b33] underline underline-offset-4">
            terms of use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-[#0b1b33] underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
