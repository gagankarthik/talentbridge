import { extendTailwindMerge } from "tailwind-merge";

// Tailwind-aware class joiner: later classes win over earlier conflicting ones,
// so primitives can be overridden with `className` predictably.
const merge = extendTailwindMerge({
  extend: {
    theme: { radius: ["ctl", "panel", "sheet"], text: ["2xs"] },
  },
});

export function cn(...parts: (string | false | null | undefined)[]) {
  return merge(parts.filter(Boolean).join(" "));
}
