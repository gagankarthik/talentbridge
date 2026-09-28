import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/company";
import { Logo } from "@/components/layout/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Partner login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-surface lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-[40px] leading-[1.05] font-light tracking-[-0.03em] text-ink">Partner login</h1>
          <p className="mt-3 text-[15px] text-muted">Sign in to search the bench, place holds and track your submissions.</p>
          <div className="mt-8">
            <LoginForm />
          </div>
          <p className="mt-8 text-[14px] text-muted">
            Not a partner yet?{" "}
            <Link href="/contact?who=agency" className="font-semibold text-brand underline-offset-4 hover:underline">
              Request access
            </Link>
          </p>
        </div>
        <p className="text-xs text-subtle">
          Trouble signing in? Call{" "}
          <a href={`tel:${CONTACT.tel}`} className="underline underline-offset-2">
            {CONTACT.phone}
          </a>
          .{" "}
          <Link href="/terms" className="underline underline-offset-2">
            Terms of use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            privacy policy
          </Link>
        </p>
      </div>
      <div className="relative hidden overflow-hidden bg-night lg:block">
        <Image src="/images/client-briefing.jpg" alt="" fill priority sizes="50vw" className="object-cover opacity-80" />
        <div className="absolute inset-x-8 bottom-8 rounded-[16px] bg-surface/95 p-6 backdrop-blur">
          <p className="font-display text-[26px] leading-tight font-light text-ink">Every profile in the workspace is screened, cleared and confirmed available this week.</p>
        </div>
      </div>
    </div>
  );
}
