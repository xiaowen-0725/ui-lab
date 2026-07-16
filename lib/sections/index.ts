// Source of truth for the Sections module (落地页区块).
// Same site-wide formula: live sample + names/aliases + "say this to AI"
// prompt + recipe. The unit is a section *type*; each type carries 2-3 shape
// variants, and every variant has its own demo + prompt.

import { batchASections } from "./batch-a";
import { batchBSections } from "./batch-b";
import { batchCSections } from "./batch-c";
import { heroSections } from "./hero";
import type { SectionEntry } from "./types";

export type { SectionEntry, SectionVariant } from "./types";

/**
 * Top-to-bottom anatomy of a landing page — the switcher renders in this
 * order, which is itself the lesson: what comes after what.
 */
const ANATOMY_ORDER = [
  "navbar",
  "hero",
  "logo-wall",
  "features",
  "stats",
  "testimonials",
  "pricing",
  "faq",
  "cta",
  "footer",
];

export const SECTIONS: SectionEntry[] = [
  ...heroSections,
  ...batchASections,
  ...batchBSections,
  ...batchCSections,
].sort(
  (a, b) => ANATOMY_ORDER.indexOf(a.slug) - ANATOMY_ORDER.indexOf(b.slug),
);
