# Palette Workspace Design QA

- Source visual truth: `public/qa/palette-workspace/reference.png`
- Implementation screenshot: `public/qa/palette-workspace/desktop.png`
- Mobile screenshot: `public/qa/palette-workspace/mobile-details.png`
- Side-by-side evidence: `/Users/zhoujw/.codex/visualizations/2026/08/12/019ff662-e40d-7eb3-8780-5512788618dc/palette-workspace-option3-final-comparison.png`
- Viewport: 1440 × 1024 CSS px, device scale 1
- Source pixels: 1487 × 1058, normalized with contain fit to 1440 × 1024
- Implementation pixels: 1440 × 1024
- State: Chinese, Browse mode, `business` / Corporate Blue, muted text on background selected

## Full-view comparison

The implementation preserves the selected direction's dominant composition: a full-screen palette-derived atmospheric canvas, large live product preview on the left, one dark inspector on the right, restrained top controls, eight semantic swatches, selected contrast ratio, all four pair results, and two copy actions.

## Focused comparison

The inspector was checked separately because it carries the densest fidelity requirements. Its hierarchy matches the source: palette identity → swatches → pair control → dominant ratio → AA/AAA status → pair list → export actions. Labels use the repository's real bilingual vocabulary and live contrast values rather than image-generated copy.

## Required fidelity surfaces

- Fonts and typography: Geist/Geist Mono retain the source's neutral grotesk and code-number contrast; hierarchy and weights are close. The source's extremely light microcopy was strengthened slightly for real accessibility.
- Spacing and layout rhythm: the main 2-column proportion, canvas padding, inspector width, large preview radius, and compact top toolbar match. Mobile stacks preview and inspector with no horizontal overflow.
- Colors and tokens: the atmosphere, preview, swatches, and illustration derive from the active Catalog palette. The inspector intentionally remains graphite for stable readability across all 16 palettes.
- Image quality and assets: the source's layered product-interface illustration was replaced by a generated grayscale transparent asset at `public/palettes/interface-layers.png`, tinted by the active palette. No hotlinked or third-party branded asset is used.
- Copy and content: all app-specific text comes from current UI Lab messages and Palette data. Four WCAG ratios are calculated live.

## Comparison history

1. V1 finding (P1): global site header and dock reduced the immersive canvas and introduced a black band. Fix: hide global chrome only on `/palettes`, remove inherited page offsets, and use a true full-viewport workspace.
2. V1 finding (P2): preview was sparse compared with the selected visual. Fix: generate, chroma-key, validate, and integrate a real layered interface asset into the shared StyleDemo.
3. Mobile finding (P2): toolbar/select cramped and the preview delayed inspector discovery. Fix: stack the toolbar controls, allow the select to shrink, tighten the mobile preview height and spacing, and verify 390px with `scrollWidth === clientWidth`.

## Interaction and runtime evidence

- Palette next/previous: passed
- Browse → Contrast: passed
- Browse → Export: passed
- Copy actions: implemented with clipboard feedback
- Auto-cycle and static-background toggle: implemented
- Browser console errors: none
- Mobile 390 × 844: no horizontal overflow

## Follow-up polish

- P3: the generated source contains more decorative hero detail and customer-logo treatment than the repository's shared `StyleDemo`; the implementation intentionally keeps real reusable demo content instead of inventing brand marks.

final result: passed
