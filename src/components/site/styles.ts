// Marketing-site design language: corporate and measured. Every public page
// composes from these so type scale, spacing, alignment and CTAs stay identical.

/** Page container: one max width and gutter everywhere. */
export const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

/** Vertical rhythm for a standard section */
export const section = "py-[72px] sm:py-24 lg:py-32";

/** Type scale: General Sans. H1 56, H2 38, H3 21, lead 20, body 17. */
export const type = {
  hero: "font-display text-[36px] leading-[1.08] font-semibold tracking-[-0.02em] text-ink text-balance sm:text-[46px] xl:text-[56px]",
  h2: "font-display text-[30px] leading-[1.15] font-semibold tracking-[-0.02em] text-ink text-balance sm:text-[38px]",
  statement: "text-[22px] leading-[1.4] font-medium tracking-[-0.01em] text-ink sm:text-[26px]",
  h3: "text-[20px] leading-snug font-semibold tracking-[-0.01em] text-ink sm:text-[21px]",
  lede: "text-[18px] leading-[1.6] text-ink-2 sm:text-[20px]",
  body: "text-[17px] leading-[1.6] text-ink-2",
  small: "text-[15px] leading-[1.5] text-muted",
  context: "text-[15px] font-semibold text-brand",
};

/** Space between a section heading block and its content */
export const headGap = "mt-10 lg:mt-12";

/** Card: white, 1px border, 8px radius, no shadow */
export const card = "rounded-[8px] border border-[#dfe3ea] bg-white";

/** Calls to action: 8px corners, one height site-wide, pressed on click */
const ctaBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[8px] px-6 text-[16px] font-semibold whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98]";
export const cta = {
  primary: `${ctaBase} bg-brand text-white hover:bg-brand-strong`,
  dark: `${ctaBase} bg-ink text-white hover:bg-ink-2`,
  outline: `${ctaBase} border border-[#8792a6] bg-white text-ink hover:border-ink`,
  bright: `${ctaBase} bg-brand text-white hover:bg-brand-strong`,
  white: `${ctaBase} bg-white text-navy hover:bg-mist`,
  outlineInverse: `${ctaBase} border border-white/60 text-white hover:border-white hover:bg-white/10`,
};

/** Inline text action */
export const textLink =
  "inline-flex items-center gap-1.5 text-[16px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:text-brand-strong hover:underline";
