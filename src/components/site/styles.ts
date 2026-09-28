// Marketing-site design language ("Evergreen and signal"). Every public page
// composes from these so type scale, spacing, alignment and CTAs stay identical.

/** Page container: one max width and gutter everywhere. */
export const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

/** Vertical rhythm */
export const section = "py-20 lg:py-28";

/** Type scale (Newsreader display for statements, Geist for everything else) */
export const type = {
  hero: "font-display text-[44px] leading-[1] font-light tracking-[-0.035em] text-ink sm:text-[64px] lg:text-[76px]",
  h2: "font-display text-[38px] leading-[1.05] font-light tracking-[-0.025em] text-ink sm:text-[52px]",
  statement: "font-display text-[44px] leading-[1.02] font-light tracking-[-0.03em] sm:text-[72px] lg:text-[84px]",
  h3: "text-[20px] leading-snug font-semibold tracking-[-0.015em] text-ink",
  lede: "text-[18px] leading-relaxed text-muted",
  body: "text-[15.5px] leading-relaxed text-muted",
  context: "text-[14px] font-semibold text-brand",
};

/** Space between a section heading block and its content */
export const headGap = "mt-12 lg:mt-14";

/** Calls to action: one height, radius and weight site-wide */
const ctaBase = "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold whitespace-nowrap transition-colors";
export const cta = {
  primary: `${ctaBase} bg-brand text-white hover:bg-brand-strong`,
  dark: `${ctaBase} bg-ink text-white hover:bg-ink-2`,
  outline: `${ctaBase} text-ink ring-1 ring-inset ring-line-strong hover:bg-paper`,
  bright: `${ctaBase} bg-brand-bright text-night hover:bg-[#5ff0bf]`,
  white: `${ctaBase} bg-white text-ink hover:bg-slate-100`,
  outlineInverse: `${ctaBase} text-white ring-1 ring-inset ring-white/30 hover:bg-white/10`,
};
