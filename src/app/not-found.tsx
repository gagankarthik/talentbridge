import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { cta } from "@/components/site/styles";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-surface px-6 py-8 sm:px-12">
      <Logo />
      <div className="mx-auto flex max-w-xl flex-1 flex-col justify-center py-16">
        <p className="tnum text-[14px] font-semibold text-brand">404</p>
        <h1 className="mt-3 font-display text-[48px] leading-[1.02] font-light tracking-[-0.03em] text-ink sm:text-[64px]">We couldn&apos;t find that page.</h1>
        <p className="mt-4 text-[17px] text-muted">The link may be out of date, or the page may have moved.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={cta.primary}>
            Go to the homepage
          </Link>
          <Link href="/contact" className={cta.outline}>
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
