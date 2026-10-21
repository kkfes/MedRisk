# Design System — MedRisk

**Author:** Sara Mukhammad (SE-2419) · **Task:** DIP-19 · **Stage:** M1 (data & baselines)
**Token file:** [`frontend/src/styles/tokens.css`](../../frontend/src/styles/tokens.css) ·
**Live style guide:** [`frontend/styleguide/index.html`](../../frontend/styleguide/index.html)
**Related:** [UX prototype notes](ux-prototype-notes.md),
[requirements specification](../requirements/requirements-specification.md),
[prototype](../../prototype/)

---

## 1. Purpose and scope

MedRisk is used by people who are not medically trained, on a phone or an old laptop, in a
state of mild anxiety about the result. The design system therefore optimises for three
things, in this order:

1. **Legibility.** Every text pair meets WCAG 2.1 AA; the focus indicator is always visible.
2. **Unambiguity of meaning.** A risk level is never communicated by colour alone, and a
   probability is never presented without the "this is not a diagnosis" context.
3. **Consistency.** One token file, one component inventory, so that the prototype, the
   React application and the style guide cannot drift apart.

**In scope for v1:** colour, typography, spacing, radius, shadow, focus, motion and the
inventory of the components listed in §6.

**Out of scope for v1:** dark theme (planned after v1), right-to-left layout, print styles,
illustration/icon set (the prototype uses no images at all — see
[UX prototype notes §3.8](ux-prototype-notes.md#38-accessibility-decisions)).

---

## 2. Colour

### 2.1 Palette

| Group | Token | Value | Purpose |
|---|---|---|---|
| Brand | `--color-primary` | `#0a6b56` | primary button, links, active nav item |
| | `--color-primary-hover` | `#07503f` | hover state of the above, secondary button label |
| | `--color-primary-active` | `#053e31` | pressed state |
| | `--color-primary-subtle` | `#e3f4f0` | banner background, selected option, subtle brand fill |
| | `--color-primary-ring` | `#0a6b56` | focus ring |
| Surface | `--color-bg` | `#f4f7f6` | page background |
| | `--color-surface` | `#ffffff` | card / panel background |
| | `--color-surface-muted` | `#eef2f1` | table header row, inset areas |
| | `--color-border` | `#d8e3e0` | decorative dividers (not a UI boundary) |
| | `--color-border-strong` | `#6d8880` | input and control borders (a UI boundary) |
| Text | `--color-text` | `#15211f` | body text |
| | `--color-text-muted` | `#4d5f5b` | hints, captions, secondary text |
| | `--color-text-heading` | `#07503f` | headings |
| | `--color-text-inverse` | `#ffffff` | text on a dark brand background |
| Feedback | `--color-success` / `-subtle` | `#0b5c3c` / `#e3f5ec` | success message |
| | `--color-warning` / `-subtle` | `#7a5200` / `#fdf1d6` | warning message |
| | `--color-danger` / `-subtle` | `#8c1f1f` / `#fbe0e0` | error message, destructive action |
| | `--color-note` / `-subtle` | `#5f5010` / `#fffbe6` | notice about mockup / illustrative data |
| Risk | `--color-risk-low` / `-subtle` | `#0b5c3c` / `#e3f5ec` | risk level *low* |
| | `--color-risk-moderate` / `-subtle` | `#7a5200` / `#fdf1d6` | risk level *moderate* |
| | `--color-risk-high` / `-subtle` | `#8a3b00` / `#fde8dc` | risk level *high* |
| | `--color-risk-very-high` / `-subtle` | `#8c1f1f` / `#fbe0e0` | risk level *very high* |
| Chart | `--color-chart-series-1` | `#07503f` | cardiovascular risk (solid line) |
| | `--color-chart-series-2` | `#8a3b00` | diabetes risk (dashed line) |
| | `--color-chart-grid` | `#d8e3e0` | grid lines |

The palette deliberately uses **one hue family** (teal/green) plus a warm amber-to-red ramp
for the risk levels. A colour-blind user still gets the full meaning, because the ramp is
always accompanied by a text label and a symbol (§2.3).

### 2.2 Measured contrast (WCAG 2.1 AA)

The ratios below were computed from the token file with the WCAG 2.1 relative-luminance
formula. Requirement: **4.5:1** for normal text, **3:1** for large text and for the
boundary of a UI component.

| Foreground | Background | Ratio | Requirement | Result |
|---|---|---|---|---|
| `--color-text` `#15211f` | `--color-surface` `#ffffff` | 16.55:1 | 4.5:1 (normal text) | pass |
| `--color-text` `#15211f` | `--color-bg` `#f4f7f6` | 15.35:1 | 4.5:1 (normal text) | pass |
| `--color-text-muted` `#4d5f5b` | `--color-surface` `#ffffff` | 6.77:1 | 4.5:1 (normal text) | pass |
| `--color-text-muted` `#4d5f5b` | `--color-bg` `#f4f7f6` | 6.28:1 | 4.5:1 (normal text) | pass |
| `--color-text-heading` `#07503f` | `--color-surface` `#ffffff` | 9.42:1 | 4.5:1 (normal text) | pass |
| `--color-text-heading` `#07503f` | `--color-primary-subtle` `#e3f4f0` | 8.29:1 | 4.5:1 (normal text) | pass |
| `--color-primary` `#0a6b56` | `--color-surface` `#ffffff` | 6.46:1 | 4.5:1 (normal text) | pass |
| `--color-primary` `#0a6b56` | `--color-bg` `#f4f7f6` | 5.99:1 | 4.5:1 (normal text) | pass |
| `--color-text-inverse` `#ffffff` | `--color-primary` `#0a6b56` | 6.46:1 | 4.5:1 (normal text) | pass |
| `--color-text-inverse` `#ffffff` | `--color-primary-hover` `#07503f` | 9.42:1 | 4.5:1 (normal text) | pass |
| `--color-primary-hover` `#07503f` | `--color-surface` `#ffffff` | 9.42:1 | 4.5:1 (normal text) | pass |
| `--color-primary-hover` `#07503f` | `--color-primary-subtle` `#e3f4f0` | 8.29:1 | 4.5:1 (normal text) | pass |
| `--color-text-inverse` `#ffffff` | `--color-danger` `#8c1f1f` | 9.01:1 | 4.5:1 (normal text) | pass |
| `--color-text-inverse` `#ffffff` | `--color-danger-hover` `#6f1717` | 11.60:1 | 4.5:1 (normal text) | pass |
| `--color-primary-ring` `#0a6b56` | `--color-surface` `#ffffff` | 6.46:1 | 3:1 (UI boundary) | pass |
| `--color-primary-ring` `#0a6b56` | `--color-bg` `#f4f7f6` | 5.99:1 | 3:1 (UI boundary) | pass |
| `--color-border-strong` `#6d8880` | `--color-surface` `#ffffff` | 3.83:1 | 3:1 (UI boundary) | pass |
| `--color-border-strong` `#6d8880` | `--color-bg` `#f4f7f6` | 3.55:1 | 3:1 (UI boundary) | pass |
| `--color-border` `#d8e3e0` | `--color-surface` `#ffffff` | 1.31:1 | decorative only | pass |
| `--color-text-muted` `#4d5f5b` | `--color-surface-muted` `#eef2f1` | 6.00:1 | 4.5:1 (normal text) | pass |
| `--color-success` `#0b5c3c` | `--color-success-subtle` `#e3f5ec` | 7.10:1 | 4.5:1 (normal text) | pass |
| `--color-warning` `#7a5200` | `--color-warning-subtle` `#fdf1d6` | 6.17:1 | 4.5:1 (normal text) | pass |
| `--color-danger` `#8c1f1f` | `--color-danger-subtle` `#fbe0e0` | 7.22:1 | 4.5:1 (normal text) | pass |
| `--color-note` `#5f5010` | `--color-note-subtle` `#fffbe6` | 7.64:1 | 4.5:1 (normal text) | pass |
| `--color-risk-low` `#0b5c3c` | `--color-risk-low-subtle` `#e3f5ec` | 7.10:1 | 4.5:1 (normal text) | pass |
| `--color-risk-moderate` `#7a5200` | `--color-risk-moderate-subtle` `#fdf1d6` | 6.17:1 | 4.5:1 (normal text) | pass |
| `--color-risk-high` `#8a3b00` | `--color-risk-high-subtle` `#fde8dc` | 6.56:1 | 4.5:1 (normal text) | pass |
| `--color-risk-very-high` `#8c1f1f` | `--color-risk-very-high-subtle` `#fbe0e0` | 7.22:1 | 4.5:1 (normal text) | pass |
| `--color-chart-series-1` `#07503f` | `--color-surface` `#ffffff` | 9.42:1 | 3:1 (UI boundary) | pass |
| `--color-chart-series-2` `#8a3b00` | `--color-surface` `#ffffff` | 7.76:1 | 3:1 (UI boundary) | pass |

**Result: 30 of 30 pairs pass.** Two rules follow from this table:

- `--color-border` is **not** allowed as the boundary of an interactive control — 1.31:1 is
  far below 3:1. It is used for decorative dividers only.
- Every "tint" background is paired with a **dark** foreground of the same hue. A white
  foreground on a tint would fail, which is why no tint is used as a button background.

### 2.3 Risk levels (colour + symbol + text)

| Level | Symbol | Text label | Colour pair |
|---|---|---|---|
| Low | `●` | Low risk | `--color-risk-low` on `--color-risk-low-subtle` |
| Moderate | `◆` | Moderate risk | `--color-risk-moderate` on `--color-risk-moderate-subtle` |
| High | `▲` | High risk | `--color-risk-high` on `--color-risk-high-subtle` |
| Very high | `■` | Very high risk | `--color-risk-very-high` on `--color-risk-very-high-subtle` |

**Rule (mandatory).** A risk level is always rendered as *symbol + text label*. The colour
may be removed entirely and the meaning must survive — this satisfies WCAG 1.4.1
(Use of Color) and covers colour-vision deficiency, greyscale printing and sunlight
screens. The symbol must not be replaced by another symbol of the same family (for example
`▲` and `▼` for high and low), because the meaning would then depend on shape recognition
alone.

### 2.4 Colour usage rules

| Do | Do not |
|---|---|
| Use the semantic tokens (`--color-danger`, `--color-risk-high`), never a raw hex value | Hard-code `#0a6b56` in a component |
| Pair a tint with its matching dark foreground | Put white text on a tint |
| Use `--color-border-strong` for the border of an input, a button or a checkbox | Use `--color-border` for a control boundary (1.31:1) |
| Use the risk ramp only for risk levels | Use the risk colours for ordinary warnings — a "high risk" badge must not compete with a validation error |
| Keep the danger colour for destructive and error states only | Use red for the primary action |

---

## 3. Typography

**Family:** `--font-family-base` — `"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
A system stack is used on purpose: no web font has to be downloaded, so the first paint is
not blocked on a network request — important for the users this product is for.

| Token | Size | Line height | Weight | Used for |
|---|---|---|---|---|
| `--font-size-2xl` | 2.6 rem (41.6 px) | 1.25 | 800 | the risk number on the report |
| `--font-size-xl` | 1.75 rem (28 px) | 1.25 | 700 | page title (`h1`) |
| `--font-size-lg` | 1.2 rem (19.2 px) | 1.3 | 700 | section heading (`h2`, `h3`) |
| `--font-size-base` | 1 rem (16 px) | 1.55 | 400 | body text |
| `--font-size-md` | 0.92 rem (14.7 px) | 1.4 | 600 | form labels, table cells |
| `--font-size-sm` | 0.84 rem (13.4 px) | 1.4 | 400 | hints, captions, notes |
| `--font-size-xs` | 0.78 rem (12.5 px) | 1.4 | 700 | uppercase table headers, badges |

**Rules**

- The base size is **16 px** and is never reduced. Browser zoom to 200 % must keep the
  layout usable (WCAG 1.4.4).
- A line of body text never exceeds **75 characters**; the content column is capped at
  `--layout-content-max-width` (980 px).
- `--font-size-xs` is only used for short uppercase labels. It is never used for a
  paragraph.
- Numbers that must be compared (risk percentages, trend deltas) use tabular figures where
  the platform provides them (`font-variant-numeric: tabular-nums`), so that digits line up
  in a table.
- **Medical wording rule:** the user-facing text avoids "risk score", "probability",
  "attribution" and "SHAP". The plain-language alternatives are in the factor explanation
  template of the report (see [UX prototype notes §3.3](ux-prototype-notes.md#33-the-result-screen-separates-your-input-from-the-estimate)).

---

## 4. Spacing and layout

### 4.1 Spacing scale (4 px base)

`--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 20 ·
`--space-6` 24 · `--space-8` 32 · `--space-10` 40 · `--space-12` 48 · `--space-16` 64 px

**Rules**

- Only the scale values are used. A spacing value that is not on the scale is a bug.
- Vertical rhythm inside a card: `--space-6` (24 px) between blocks, `--space-3`/`--space-4`
  between a label and its control.
- The gap between two cards: `--space-5` (20 px) on desktop, `--space-4` on mobile.
- Touch targets are at least 44 × 44 px (`--control-height-md`); a radio choice chip in the
  prototype is 9 px padding + 18 px control ≈ 40 px and is the only element below the
  target — it is raised to 44 px in the React form.

### 4.2 Layout

| Token | Value | Purpose |
|---|---|---|
| `--layout-max-width` | 1080 px | outer container (header, footer) |
| `--layout-content-max-width` | 980 px | text column inside a card |
| `--layout-gutter` | 20 px | horizontal padding on small screens |
| `--layout-header-height` | 56 px | sticky header |
| `--breakpoint-sm` | 480 px | single-column phone layout below this width |
| `--breakpoint-md` | 760 px | two-column grids collapse to one column |
| `--breakpoint-lg` | 1080 px | the content container reaches its maximum width |

---

## 5. Radius, shadow, border, focus, motion

| Token | Value | Used for |
|---|---|---|
| `--radius-sm` | 8 px | inputs, buttons, badges |
| `--radius-md` | 12 px | cards, panels |
| `--radius-lg` | 16 px | modal / large panel |
| `--radius-full` | 999 px | pills, progress bars, radio chips |
| `--shadow-sm` | `0 1px 3px rgba(16,42,37,.08)` | raised controls |
| `--shadow-md` | `0 2px 10px rgba(16,42,37,.08)` | cards |
| `--border-width` / `--border-width-strong` | 1 px / 2 px | normal / selected or invalid |
| `--focus-ring-width` / `--focus-ring-offset` | 3 px / 2 px | the focus outline |
| `--duration-fast` / `--duration-base` | 120 ms / 200 ms | hover and state transitions |
| `--easing-standard` | `cubic-bezier(.2,0,.2,1)` | all transitions |

**Focus rule (mandatory).** Every interactive element receives

```css
outline: var(--focus-ring-width) solid var(--focus-ring-color);
outline-offset: var(--focus-ring-offset);
```

The outline is never removed and never relies on `box-shadow` alone, because a
`box-shadow` focus ring is invisible in Windows High Contrast Mode. `:focus-visible` is
used for the modern behaviour, with a plain `:focus` fallback.

**Motion rule.** All motion is ≤ 200 ms and is disabled under
`@media (prefers-reduced-motion: reduce)`. There are no entrance animations on the report
screen: the number is shown immediately.

---

## 6. Component inventory

Every component below exists in the prototype and in the style guide, and its rules are
implemented once in [`frontend/src/styles/components.css`](../../frontend/src/styles/components.css).
The React versions are produced in M4 (DIP-35 … DIP-38) and must consume the same tokens.

### 6.1 Button

| Variant | Background | Label | Border | Usage |
|---|---|---|---|---|
| Primary | `--color-primary` | `--color-text-inverse` | `--color-primary` | the single main action of a screen ("Show my risk report") |
| Secondary | `--color-surface` | `--color-primary-hover` | `--color-primary` | a secondary action ("Cancel and go back") |
| Danger | `--color-danger` | `--color-text-inverse` | `--color-danger` | destructive action only ("Delete account") |

| State | Rule |
|---|---|
| Default | as above |
| Hover | background `--color-primary-hover` (secondary: `--color-primary-subtle`) |
| Focus | the standard focus ring, `outline-offset: 2px` |
| Active | background `--color-primary-active`, no movement |
| Disabled | background `--color-surface-muted`, border `--color-border-strong`, label `--color-text-muted` (6.00:1, see §2.2), `cursor: not-allowed`; the element stays in the DOM and is explained by a hint, it is not hidden |
| Loading | label replaced by "Working…", `aria-busy="true"`, width kept to avoid a layout jump |

Rules: one primary button per screen; the minimum target size is 44 px; a button never
uses colour alone to convey an action — the label always states the action.

### 6.2 Text field (input)

| Element | Token |
|---|---|
| Border | `--color-border-strong` (3.83:1 against the surface) |
| Background / text | `--color-surface` / `--color-text` |
| Label | `--font-size-md`, weight 600, `--color-text` |
| Hint | `--font-size-sm`, `--color-text-muted`, referenced by `aria-describedby` |
| Error message | `--color-danger`, weight 600, referenced by `aria-describedby` |
| Error state | border `--color-danger` at `--border-width-strong` **and** `aria-invalid="true"` — the border alone is not enough |
| Focus | the standard focus ring |
| Placeholder | `--color-text-muted` — a placeholder is never the only label |

Rules: every field has a visible `<label>`; the error message sits **below** the field and
is connected with `aria-describedby`; the first invalid field receives focus after a failed
submit; an error summary with links to the fields is rendered above the form.

### 6.3 Checkbox and radio

- Rendered as a chip (`--radius-full`, `--radius-sm` border) with the native input kept
  visible and 18 × 18 px, `accent-color: var(--color-primary)`.
- The whole chip is the click target; the selected chip gets `--border-width-strong` and
  `--color-primary-subtle`.
- A radio group is a `<fieldset>` with a `<legend>`; the group is **one tab stop** and the
  arrow keys move inside it (verified in the prototype walkthrough).
- The selected state is marked by the native control, not only by the chip colour.

### 6.4 Card

Background `--color-surface`, border `--color-border`, radius `--radius-md`, shadow
`--shadow-md`, padding `--space-6`. Cards are the only container for grouped content on
the report and history screens.

### 6.5 Result table (history)

| Element | Rule |
|---|---|
| Header row | `--font-size-xs`, uppercase, `--color-text-muted`, `scope="col"` |
| Row header | `--font-size-md`, `--color-text`, `scope="row"` |
| Cell | `--font-size-md`, padding `--space-3` / `--space-2`, divider `--color-border` |
| Caption | `--font-size-sm`, `--color-text-muted`, describes what the table contains |
| Delta column | the change is written in words as well: "−1.3 pp (down)", never by colour alone |

The table is the accessible equivalent of the trend chart and must always be present when
the chart is shown.

### 6.6 Disclaimer banner

Two variants, both mandatory on any screen that shows a risk number:

| Variant | Appearance | Used for |
|---|---|---|
| `disclaimer-top` | 2 px `--color-danger` border, `--color-danger-subtle` background, the sentence starts with "**This is a risk estimate, not a diagnosis.**" | the top of the result screen |
| `disclaimer` (inline) | 5 px left border `--color-risk-high`, `--color-risk-high-subtle` background, dark brown text | the closing paragraph of the report, the footer of every screen |

Rules: the disclaimer is never inside a collapsible element, never shortened to an icon,
and the text is never replaced by an image. The footer of **every** page carries the short
form "Risk estimates only — not a diagnosis. Consult a licensed physician."

### 6.7 Risk badge

See §2.3. Padding `--space-1`/`--space-3`, radius `--radius-full`, border
`--border-width` in the text colour, font `--font-size-sm`, weight 700.

### 6.8 Progress indicator

Native `<progress>` element with `max`, `value` and **`aria-valuetext`** (the raw value
"5" means nothing to a screen reader). The visible text next to it repeats the same
information in words: "N of 12 questions answered · M of 8 required · 4 optional
measurements can be skipped".

### 6.9 Factor bar (contribution magnitude)

A decorative 8 px bar. It is always `aria-hidden="true"` and is always accompanied by:

- the factor name in plain language,
- the direction as a **word** ("increases" / "decreases") plus a symbol (`▲` / `▼`),
- the magnitude in words ("88 % of the largest contribution in this example").

### 6.10 Chart legend

The legend states the line style, not only the colour: "Cardiovascular disease — solid
line", "Type 2 diabetes — dashed line".

---

## 7. Accessibility rules (summary)

| Rule | Implementation |
|---|---|
| Every text pair ≥ 4.5:1 | §2.2 table, all pairs measured from the token file |
| Every UI boundary ≥ 3:1 | `--color-border-strong` |
| Visible focus on every interactive element | `--focus-ring-width` outline, never removed |
| No meaning by colour alone | risk badge = symbol + text; deltas = word + number; chart legend = line style |
| Programmatic names for all controls | `<label for>`, `<fieldset>/<legend>`, `aria-label` |
| Errors linked to their field | `aria-describedby` + `aria-invalid` + error summary |
| Landmark structure | `header`, `nav[aria-label]`, `main`, `footer` + skip link |
| Language of the page | `lang="en"` on `<html>` |
| Charts have a text equivalent | `<svg role="img">` with `<title>`/`<desc>` + a data table |
| Motion can be switched off | `prefers-reduced-motion` |
| Target size ≥ 44 × 44 px | `--control-height-md` |

---

## 8. Using the tokens

Plain CSS (the prototype, the style guide):

```css
@import url("../src/styles/tokens.css");
@import url("../src/styles/components.css");

.card {
  background: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
}
```

The style guide ([`frontend/styleguide/index.html`](../../frontend/styleguide/index.html))
imports exactly these two files, so the components shown in the guide are the real
components and not a copy of them.

React (planned, DIP-35): the same file is imported once in the application entry point.
If the team prefers CSS-in-JS or a Tailwind theme, the token file stays the source of truth
and the mapping is generated from it — the values must not be duplicated by hand.

---

## 9. Open items

1. **Dark theme.** Not designed yet. When it is added, every pair must be re-measured; the
   dark surface will need its own risk ramp.
2. **Typography for Russian and Kazakh (FR-12).** The scale is defined in `rem`, so a
   different font with a different x-height may need a separate check; the interface has to
   grow by roughly 15–25 % in width for Russian.
3. **Icon set.** The prototype uses text symbols only (`● ◆ ▲ ■`). A real icon set must not
   become the only carrier of meaning either.
4. **Chart palette.** Two series are enough for v1 (CVD, diabetes). A third and fourth
   series would need a non-colour distinction as well (dash pattern, marker shape).
5. **Supervisor review.** The palette and the risk ramp should be confirmed with the
   supervisor and with the doctor-interview participant (DIP-44) — especially whether four
   risk levels are the right granularity for a lay audience.
