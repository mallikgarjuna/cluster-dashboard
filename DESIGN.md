---
version: alpha
name: Cluster Dashboard
description: >
  A light, restrained research administration dashboard that combines a neutral
  white canvas, soft zinc framing, and a single institutional blue accent.
colors:
  background: "#ffffff"
  on-background: "#09090b"
  surface: "#ffffff"
  surface-muted: "#fafafa"
  surface-subtle: "#f4f4f5"
  surface-brand-soft: "#bfdbfe"
  border: "#e4e4e7"
  border-strong: "#d4d4d8"
  text-primary: "#09090b"
  text-secondary: "#27272a"
  text-muted: "#71717a"
  text-link: "#3b82f6"
  text-link-active: "#1e3a8a"
  primary: "#3b82f6"
  primary-hover: "#60a5fa"
  primary-soft: "#bfdbfe"
  primary-strong: "#1e3a8a"
  neutral-inverse: "#18181b"
  on-neutral-inverse: "#fafafa"
  hover-row: "#e5e7eb"
  focus-ring: "#09090b"
  success: "#22c55e"
  warning: "#eab308"
  danger: "#dc2626"
  info-chart: "#0000ff"
  success-chart: "#008000"
  warning-chart: "#ffa500"
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: "700"
    lineHeight: 36px
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "700"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  "2xl": 24px
  "3xl": 32px
  "4xl": 48px
  "5xl": 64px
  nav-inline: 20px
  nav-block: 12px
  page-padding: 24px
  card-padding: 24px
  compact-card-padding: 16px
  form-padding: 8px
  field-gap: 8px
  cluster-gap: 12px
  action-gap: 20px
layout:
  content-max-width: 1400px
  auth-form-width: 384px
  hero-height-mobile: 80px
  hero-height-desktop: 208px
shadows:
  none: "none"
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  md: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
  lg: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
elevation:
  level-0: "{shadows.none}"
  level-1: "{shadows.sm}"
  level-2: "{shadows.md}"
  level-3: "{shadows.lg}"
motion:
  duration-fast: 150ms
  duration-standard: 200ms
  duration-slow: 300ms
  easing-standard: "cubic-bezier(0.4, 0, 0.2, 1)"
  easing-linear: "linear"
  spinner-duration: 1s
  spinner-duration-reduced: 1.5s
components:
  page-canvas:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    padding: "{spacing.page-padding}"
  hero-band:
    backgroundColor: "{colors.surface-brand-soft}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.page-padding}"
    height: "{layout.hero-height-desktop}"
  button-action:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-action-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#ffffff"
  button-neutral:
    backgroundColor: "{colors.neutral-inverse}"
    textColor: "{colors.on-neutral-inverse}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "0 16px"
  button-neutral-hover:
    backgroundColor: "#27272a"
    textColor: "{colors.on-neutral-inverse}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "0 16px"
  button-outline-hover:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.text-secondary}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "0 12px"
  auth-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "{spacing.form-padding}"
    width: "{layout.auth-form-width}"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.card-padding}"
  card-muted:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.compact-card-padding}"
  select-trigger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: "0 12px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    typography: "{typography.body-md}"
    padding: "0"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.text-link-active}"
  table-row-hover:
    backgroundColor: "{colors.hover-row}"
    textColor: "{colors.text-primary}"
---

## Overview
Cluster Dashboard should feel like a dependable internal product, not a brand campaign. The interface is light, sparse, and task-oriented: most surfaces are plain white, typography does the organizational work, and visual emphasis is reserved for a small number of actions and status cues.

The overall mood is professional and quiet. There is no dark mode styling in practice, no decorative gradients, and very little ornamental treatment. The strongest branded moment is the pale blue hero band on the homepage; elsewhere, blue is used more functionally for links, CTAs, and selected navigation.

## Colors
The color system is built from three layers:

- White and near-white surfaces create a clean administrative canvas.
- Zinc grays handle borders, muted text, hover fills, and low-priority chrome.
- A single medium blue acts as the primary accent for login actions, links, and key entry points.

The rendered UI confirms that the product lives almost entirely on a bright white background. The pale blue banner is a soft supporting surface, not a dominant brand wash. Black and near-black text carry most of the visual weight.

Semantic color does appear, but mainly in status communication rather than broad layout. Success, warning, error, and chart-series hues should remain isolated to badges, alerts, and data visualization, so the main dashboard shell stays calm and neutral.

## Typography
Inter is the only font family and should remain the entire system's voice. Its role here is straightforward: crisp, neutral, and highly legible for administrative tables and forms.

Typography hierarchy is simple and practical:

- Large headings use bold weights and moderate negative tracking.
- Form labels, buttons, and compact metadata stay in the 12px to 14px range.
- Body copy is standard 16px with comfortable but not luxurious line height.

This is not an expressive editorial system. Avoid stylized type treatments, condensed headings, or oversized display moments outside of page titles and the homepage welcome block.

## Layout
The layout model is a centered application shell with a wide maximum content width and generous empty space around primary content blocks. The homepage and auth screens both use large amounts of open white space, which makes the product feel calmer and less dense even when the underlying workflows are operationally complex.

Spacing follows a practical 4px and 8px rhythm:

- 8px and 12px for field stacks, inline controls, and compact grouping.
- 16px to 24px for cards, sections, and navigation padding.
- 48px and above for major separation on entry screens.

Forms should stay structurally tight and centered. Data-heavy screens can expand horizontally, but should still feel contained inside the 1400px shell rather than stretching edge to edge.

## Elevation & Depth
Depth is subtle. Most components rely on light borders and small Tailwind-style shadows rather than dramatic layering. The system should feel flat-first, with just enough lift to distinguish cards, inputs, and popovers from the white page.

- Standard cards use a soft low shadow plus a light border.
- Inputs and select triggers use small control shadows, mostly to separate them from white backgrounds.
- Popovers and dropdowns can step up one level in elevation, but should still feel restrained and system-like.

Heavy glass effects, colored shadows, and dramatic floating panels would be off-brand for this product.

## Shapes
The shape language is gently rounded but not playful. Most inputs and buttons sit at 6px to 8px radii, while larger cards stretch to 12px. The effect is modern and approachable without becoming soft or consumer-app-like.

- Inputs, buttons, and selects: use the `md` and `lg` radii.
- Larger summary cards and grouped containers: use `xl`.
- Avoid pill-heavy styling except for badges and small semantic indicators.

## Components
### Entry Screens
The homepage pairs a large pale blue banner with a plain text welcome block and a single blue CTA. Keep this composition airy and uncomplicated. It should feel like a concise gateway into the product, not a marketing landing page.

The login screen uses a centered, lightly bordered form card on a white background with minimal decoration. Inputs are full-width, standard height, and visually subordinate to the form title and submit action.

### Navigation
Top navigation is understated. Links sit on a plain horizontal strip with bottom border separation. Inactive items are muted gray; the active route deepens to a darker blue rather than introducing a larger shape or background pill.

### Data Surfaces
Cards, tables, and filter controls should read like reliable administrative furniture:

- White surfaces
- thin borders
- soft shadows
- restrained hover fills

Hover feedback should be visible but quiet, usually through a light gray background shift rather than motion-heavy transitions or glow effects.

### Buttons & Inputs
There are effectively two button families:

- Blue action buttons for public-facing or entry-point CTAs.
- Near-black utility buttons from the shared control set for authenticated forms and dashboard actions.

That contrast is part of the current product identity. Do not collapse everything into one accent family unless the broader UI is being intentionally redesigned.

## Do's and Don'ts
- Do keep the UI bright, minimal, and operationally focused.
- Do use blue sparingly so it retains meaning as an action and navigation accent.
- Do prefer border, spacing, and typography hierarchy over decorative containers.
- Do preserve the centered, open composition of auth and entry flows.
- Don't introduce saturated multi-color palettes into the main shell.
- Don't rely on large shadows, glass effects, or gradient-heavy surfaces.
- Don't make data screens feel playful; they should stay clear, neutral, and dependable.
- Don't over-style navigation with pills, underlines, or segmented-control treatments unless the entire design language is being upgraded.
