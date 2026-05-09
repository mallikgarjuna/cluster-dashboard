---
version: alpha
name: Cluster Dashboard
description: >
  An editorial precision interface for research administration where grants,
  funders, and operational records are presented with confident typography,
  warm light surfaces, disciplined spacing, and indigo-led interaction states.
colors:
  background: "#FAFAFA"
  on-background: "#0A0A0A"
  surface: "#FFFFFF"
  surface-muted: "#F5F5F7"
  surface-subtle: "#F1F1F4"
  surface-brand-soft: "#EEF2FF"
  border: "#E8E8EC"
  border-strong: "#D9D9DF"
  text-primary: "#0A0A0A"
  text-secondary: "#6B6B6B"
  text-muted: "#9C9C9C"
  text-link: "#6366F1"
  text-link-active: "#4F46E5"
  primary: "#6366F1"
  primary-hover: "#4F46E5"
  primary-soft: "#EEF2FF"
  primary-strong: "#4338CA"
  secondary: "#20970B"
  neutral-inverse: "#111111"
  on-neutral-inverse: "#FFFFFF"
  hover-row: "#F5F5F7"
  focus-ring: "#6366F1"
  success: "#10B981"
  warning: "#F59E0B"
  danger: "#EF4444"
  data-info: "#6366F1"
  data-success: "#10B981"
  data-warning: "#F59E0B"
typography:
  display-xl:
    fontFamily: General Sans
    fontSize: 72px
    fontWeight: "700"
    lineHeight: 76px
    letterSpacing: "-0.04em"
  headline-xl:
    fontFamily: General Sans
    fontSize: 60px
    fontWeight: "700"
    lineHeight: 64px
    letterSpacing: "-0.03em"
  section-heading:
    fontFamily: General Sans
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 38px
    letterSpacing: "-0.03em"
  subhead:
    fontFamily: General Sans
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 30px
    letterSpacing: "-0.02em"
  body-md:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 20px
  caption:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 18px
  overline:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: "0.14em"
    textTransform: uppercase
  code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 20px
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
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
  "4xl": 40px
  "5xl": 48px
  "6xl": 64px
  "7xl": 80px
  "8xl": 96px
  component-padding-small: "8px 12px"
  component-padding-medium: "10px 16px"
  component-padding-large: "12px 24px"
layout:
  content-max-width: 1280px
  page-padding-inline: 24px
  section-spacing-mobile: 32px
  section-spacing-tablet: 48px
  section-spacing-desktop: 64px
  card-grid-gap: 24px
shadows:
  none: "none"
  hover-card: "0 8px 30px rgba(0, 0, 0, 0.08)"
  hover-primary: "0 4px 12px rgba(99, 102, 241, 0.35)"
  popover: "0 10px 30px rgba(15, 23, 42, 0.12)"
focus:
  ring: "0 0 0 3px rgba(99, 102, 241, 0.12)"
elevation:
  level-0: "{shadows.none}"
  level-1: "{shadows.hover-card}"
  level-2: "{shadows.popover}"
motion:
  duration-fast: 150ms
  duration-standard: 200ms
  duration-slow: 300ms
  easing-standard: "cubic-bezier(0.4, 0, 0.2, 1)"
  hover-lift-card: "-2px"
  hover-lift-button: "-1px"
components:
  page-canvas:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    padding: "{layout.page-padding-inline}"
  navigation-bar:
    backgroundColor: "rgba(255, 255, 255, 0.82)"
    borderColor: "{colors.border}"
    height: 56px
    backdropFilter: "blur(16px)"
  hero-band:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.component-padding-large}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.component-padding-medium}"
    shadow: "{shadows.none}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    shadow: "{shadows.hover-primary}"
    transform: "translateY(-1px)"
  button-secondary:
    backgroundColor: "transparent"
    borderColor: "{colors.border}"
    textColor: "{colors.text-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.component-padding-medium}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.component-padding-medium}"
  button-danger:
    backgroundColor: "transparent"
    borderColor: "{colors.danger}"
    textColor: "{colors.danger}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.component-padding-medium}"
  card-default:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    shadow: "{shadows.none}"
  card-default-hover:
    shadow: "{shadows.hover-card}"
    transform: "translateY(-2px)"
  input-field:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    textColor: "{colors.text-primary}"
    placeholderColor: "{colors.text-muted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    focusRing: "{focus.ring}"
  chip-default:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  list-row:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    textColor: "{colors.text-primary}"
    padding: "12px 16px"
  list-row-hover:
    backgroundColor: "{colors.hover-row}"
  search-bar:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.component-padding-medium}"
---

## Overview
Cluster Dashboard should move away from plain black-and-white austerity and toward a more editorial, quietly expressive interface. The right reference mood is professional and modern without becoming sterile: bold heading typography, warmer light surfaces, indigo-led interaction states, and enough spacing to make dense administrative content feel curated rather than cramped.

This is still an internal research administration product, not a marketing site. So the Genesis-inspired direction should be adapted rather than copied. What transfers especially well is the sense of precision: confident headings, restrained borders, intelligent use of one strong accent color, and cards that feel like framed content rather than generic admin boxes.

## Colors
The palette should become warmer, richer, and more intentional than the current monochrome scheme.

- **Indigo** is the primary interaction color. Use it for CTAs, active states, links, focus rings, selected chips, and high-priority interactive feedback.
- **Green** is available, but should be reserved for specific brand or positive highlights rather than spread across the full shell.
- **Warm gray** should replace flat white as the page canvas so the app feels softer and less stark.
- **White surfaces** should remain the card and panel layer, creating a framed editorial effect against the warmer background.
- **Semantic colors** should stay available for confirmations, warnings, and destructive states, but they should be secondary to the indigo-led interaction system.

The result should feel more alive than pure monochrome, but still controlled. Indigo is the main visual voice; other colors exist in support, not in competition.

## Typography
The strongest transferable idea from Genesis is its editorial type contrast. Cluster Dashboard should adopt that logic:

- **General Sans** for display and section headings
- **DM Sans** for body text, labels, and UI copy
- **JetBrains Mono** for IDs, codes, CLI strings, and machine-readable values

Headings should feel assertive and compact, with tight negative tracking. Body text should stay practical and readable. This creates a more designed and premium feeling than using one neutral font for everything.

The type system should be applied selectively:

- Dashboard hero, page titles, and section headings can use the stronger editorial display tone.
- Tables, forms, metadata, and descriptive copy should remain grounded in DM Sans for clarity.
- Avoid mixing too many font weights on a single screen. One regular weight and one medium or bold weight is usually enough.

## Layout
The layout system should preserve the 4px spacing grid and keep strong sectional rhythm:

- 24px horizontal padding at the shell level
- 32px to 64px between major sections depending on breakpoint
- 20px to 24px gaps in card grids
- 10px by 16px or 12px by 24px internal component padding depending on density

Genesis’s best layout idea is not just “more space,” but “better controlled space.” High-density content is acceptable as long as each block has a clear frame and enough breathing room around it.

## Elevation
Depth should remain minimal, but not flat to the point of feeling unfinished.

- Static cards should usually rest flat with a 1px border.
- Hover can introduce a subtle editorial lift: a soft shadow plus a small vertical movement.
- Primary buttons can use a restrained indigo glow on hover.
- Focus should rely on a 3px tinted ring rather than thick borders or dramatic glows.
- Navigation should communicate elevation through translucency and backdrop blur rather than heavy shadow.

This gives the app more sophistication without pushing it into flashy territory.

## Components
### Buttons
The Genesis button system is a strong fit and should be adapted directly:

- Primary: indigo fill, white text, 6px radius
- Secondary: transparent with subtle border
- Ghost: no border, hover by text/background shift only
- Destructive: red text and red border, used only when destructive meaning matters

Buttons should feel slightly more alive than the current neutral controls. A small upward shift on hover helps them feel precise and tactile.

### Cards
Cards should feel like gallery frames for information:

- white surface
- 1px subtle border
- 12px radius for larger content cards
- minimal static shadow
- gentle lift and shadow increase on hover where interactivity exists

This is one of the best Genesis ideas for your app because it makes dense admin content feel intentionally presented.

### Inputs
Inputs should use the Genesis pattern almost verbatim:

- white surface
- subtle border
- 6px radius
- 14px text
- muted placeholder
- indigo border/focus ring on focus

This is a cleaner and more memorable interaction model than neutral-only focus states.

### Chips and Status
Genesis has a good distinction between generic chips and semantic status chips. That is worth carrying over:

- neutral chips for filters, categories, and inactive states
- indigo active chips for selected states
- semantic chips only where status meaning matters

This is better than making every badge a different loud color.

### Lists and Tables
Rows should behave like stacked editorial list items:

- subtle dividers
- white surface
- 12px vertical and 16px horizontal padding
- hover through a soft background shift only

Tables should read more like structured content lists and less like software-default data grids.

### Navigation
Genesis’s navigation rules are highly transferable:

- sticky top nav
- 56px height
- 1px bottom border
- backdrop blur instead of shadow
- restrained active-state treatment

For Cluster Dashboard, the nav should still feel product-like and utilitarian, but this treatment will make it more polished.

### Search
The Genesis `⌘K` search pattern is worth considering for a future pass. It is not required immediately, but it would be one of the most valuable product-level upgrades if you want the app to feel more premium and efficient.

## Best Things To Adopt
The strongest Genesis ideas for this app are:

- Indigo as the clear primary interaction color
- Warm light-gray page background instead of hard white everywhere
- Editorial display typography paired with a cleaner body font
- Minimal static shadows with hover-only lift
- Backdrop-blurred sticky navigation
- Better framed cards and list rows
- Indigo focus rings instead of purely neutral focus treatment

## Best Things To Skip
Some Genesis traits should be adapted carefully or avoided:

- Don’t import community-gallery aesthetics that imply a marketplace or media product.
- Don’t use green as a second broad UI accent across the shell.
- Don’t overuse hover lift on every single card or row.
- Don’t let typography become so expressive that dense admin screens become harder to scan.

## Do's and Don'ts
- Do use indigo only for interactive emphasis, active states, focus, and key CTAs.
- Do keep the warm gray background and white-card layering consistent.
- Do use the 4px spacing grid everywhere.
- Do use General Sans for display moments and DM Sans for the bulk of product UI.
- Do reserve green for selective highlights and positive emphasis only.
- Do keep semantic red, amber, and green available, but secondary to indigo.
- Don't fall back to flat pure black-and-white everywhere.
- Don't use more than one filled primary button in the same local view section unless the flow clearly needs it.
- Don't add decorative gradients, glossy effects, or illustration-heavy branding.
- Don't let shadows become permanent decoration; save them for hover, focus, and popovers.
