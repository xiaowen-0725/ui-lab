# Visual comparison report

All implementation images are deterministic **candidate regression captures**. There is no user-approved acceptance capture, so every adoption pair is **not pixel-comparable** and visual acceptance remains pending.

| Case | Size/scale | Reference role | Implementation | Comparable | Difference category | Result |
|---|---|---|---|---|---|---|
| wide-light-default | 1440×900 / 1 | unavailable | `implementation/wide-light-default.png` | no | layout, typography, color/surface, anatomy, assets | candidate only |
| wide-dark-loading | 1440×900 / 1 | unavailable | `implementation/wide-dark-loading.png` | no | state, color/surface, focus/motion | candidate only |
| collapse-light-error | 1000×760 / 1 | unavailable | `implementation/collapse-light-error.png` | no | responsive, state, anatomy | candidate only |
| collapse-dark-reduced-motion | 1000×760 / 1 | unavailable | `implementation/collapse-dark-reduced-motion.png` | no | responsive, color/surface, focus/motion | candidate only |
| narrow-light-empty | 375×760 / 1 | unavailable | `implementation/narrow-light-empty.png` | no | responsive, state, layout | candidate only |
| wide-light-keyboard-focus | 1440×900 / 1 | unavailable | `implementation/wide-light-keyboard-focus.png` | no | focus/motion, anatomy | candidate only |

Capture preconditions: Chromium, device scale 1, declared viewport/theme/query state, `document.fonts.ready`, two animation frames after settle; keyboard case focuses the navigation toggle; reduced-motion case uses both browser emulation and the fixture query flag.
