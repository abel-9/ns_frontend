# Design Token Usage Guide

A reference for applying design tokens consistently across a professional website. This guide covers every token, explains its intent, and shows exactly when and where to use it.

---

## Philosophy

This token system is built around a single hierarchy: **one dominant primary, one warm accent, neutral surfaces, and semantic states.** The teal brand primitives (`--lagoon`, `--palm`) are reserved for brand expression and decoration — they never compete with the navy primary for authority. Brass (`--accent`) is used sparingly, only when something genuinely needs to stand out.

A page that uses all tokens equally is a page without hierarchy. Use tokens with restraint.

---

## Token Groups

### 1. Page Backgrounds

These three tokens cover the full range of page-level backgrounds. Never use a raw color value where one of these applies.

| Token          | Light value | Dark value | When to use                                                                                                                                                                                     |
| -------------- | ----------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--background` | `#ffffff`   | `#1c1c22`  | Default page background. The canvas everything sits on. Use on `<body>` or root layout wrappers.                                                                                                |
| `--bg-base`    | `#e7f3ec`   | `#0a1418`  | Slightly tinted base, gives the page a subtle green-tinted warmth. Use on full-bleed section backgrounds, app shells, or as an alternative page background when `--background` feels too stark. |
| `--bg-light`   | `#ffffff`   | `#1a2e33`  | Elevated surface background. Use on cards, panels, modals, and any component that needs to lift off the page background.                                                                        |
| `--bg-dark`    | `#1a2e33`   | `#050d10`  | Deepest background. Use on footers, dark hero sections, sidebars, and elements that anchor the page visually.                                                                                   |

**Layering rule:** `--bg-dark` → `--bg-base` → `--background` → `--bg-light`. Each step reads as slightly elevated from the previous.

```css
/* Example: a typical page layout */
body {
  background: var(--background);
}
.app-shell {
  background: var(--bg-base);
}
.card {
  background: var(--bg-light);
}
footer {
  background: var(--bg-dark);
}
```

---

### 2. Text

| Token                    | When to use                                                                                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--foreground`           | All primary body text. Headings, paragraphs, labels, any text that carries meaning. Default for `color` on all text elements.                                                           |
| `--muted-foreground`     | Supporting, secondary, or de-emphasised text. Timestamps, helper text, placeholder text, meta information, caption text, disabled labels. Do not use for text the user needs to act on. |
| `--primary-foreground`   | Text that sits on top of a `--primary` background (e.g. inside a navy button). Always white in light mode.                                                                              |
| `--secondary-foreground` | Text inside secondary-coloured containers.                                                                                                                                              |
| `--accent-foreground`    | Text sitting on an `--accent` (brass) background.                                                                                                                                       |
| `--card-foreground`      | Text inside card components. Usually maps to `--foreground` but gives you a separate override point.                                                                                    |

**Rule:** If a user needs to read it to complete a task, use `--foreground`. If it is contextual or supplemental, use `--muted-foreground`. Never use brand primitives (`--lagoon`, `--palm`) as text colors on body copy — they are for decoration only.

```css
h1,
h2,
h3,
p {
  color: var(--foreground);
}
.timestamp,
.caption {
  color: var(--muted-foreground);
}
.btn-primary span {
  color: var(--primary-foreground);
}
```

---

### 3. Primary — Navy

The primary is the most authoritative color in the system. Deep navy reads as trusted, established, and serious. It should be the dominant interactive color: the color users associate with "this is what I do next."

| Token                  | When to use                                                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--primary`            | CTAs, primary buttons, active navigation states, selected states, progress bars, focus rings on critical inputs, links on dark backgrounds, pricing highlights. |
| `--primary-light`      | Hover state for primary buttons, secondary/ghost button borders, interactive row highlights on hover, the tint of an active sidebar item background.            |
| `--primary-foreground` | Any text or icon rendered directly on a `--primary` background.                                                                                                 |

**Rule:** Primary should appear on one dominant element per section — typically the main CTA. If everything is navy, nothing is authoritative.

```css
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
}
.btn-primary:hover {
  background: var(--primary-light);
}
.nav-item.active {
  color: var(--primary);
  border-left: 2px solid var(--primary);
}
```

---

### 4. Secondary

Secondary is a near-neutral, low-contrast surface used for supporting UI chrome — not for meaningful interaction.

| Token                    | When to use                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `--secondary`            | Ghost button backgrounds, pill/badge backgrounds, tag backgrounds, inactive tab backgrounds, toolbar backgrounds. |
| `--secondary-foreground` | Text inside secondary elements.                                                                                   |

**Rule:** Secondary should never draw the eye. It is background furniture. If you catch yourself making something secondary because primary feels like too much, consider whether the element needs a different pattern (muted text, a border, smaller size) rather than a secondary color.

```css
.badge {
  background: var(--secondary);
  color: var(--secondary-foreground);
}
.tab:not(.active) {
  background: var(--secondary);
}
```

---

### 5. Accent — Brass

The accent is warm brass. It is the single "look here, but not urgently" color — used for highlights, callouts, and moments of editorial emphasis. It must never be used for error or success states.

| Token                 | When to use                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--accent`            | Featured or highlighted callout banners, "new" or "featured" badges, pull quotes, decorative underlines on section headings, the active indicator dot on a timeline, testimonial borders. |
| `--accent-foreground` | Text sitting on an `--accent` background.                                                                                                                                                 |

**Rule:** Accent should appear at most once or twice per page. Its warmth makes it naturally magnetic — overuse flattens it into wallpaper.

```css
.callout-featured {
  border-left: 3px solid var(--accent);
}
.badge-new {
  background: var(--accent);
  color: var(--accent-foreground);
}
blockquote {
  border-left-color: var(--accent);
}
```

---

### 6. Semantic States

These are strictly functional tokens. Never repurpose them for decoration.

| Token                       | When to use                                                                                                                                                                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--error` / `--destructive` | Form validation errors, destructive action buttons (delete, remove), inline error messages, toast notifications for failure. Both tokens share the same value — use `--error` for inline states and `--destructive` for shadcn/Tailwind component compatibility. |
| `--destructive-foreground`  | Text on a destructive/error background.                                                                                                                                                                                                                          |
| `--warning`                 | Non-blocking alerts, deprecation notices, quota warnings ("you have 1 seat left"), things the user should act on but that are not broken.                                                                                                                        |
| `--success`                 | Form submission confirmations, payment success, completed states, online/active indicators.                                                                                                                                                                      |

**Rule:** These colors must only appear in response to a system event. Never use `--success` green as a brand color or decorative element — users will interpret it as a status signal.

```css
.input-error {
  border-color: var(--error);
}
.msg-error {
  color: var(--error);
}
.toast-success {
  background: var(--success);
  color: #fff;
}
.alert-warning {
  border-color: var(--warning);
  background: color-mix(in oklch, var(--warning) 10%, transparent);
}
```

---

### 7. Surfaces & Overlays

These tokens are for component-level backgrounds and translucent overlays. They are separate from page backgrounds because they often involve transparency.

| Token              | When to use                                                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--surface`        | Default translucent component backgrounds — frosted-glass cards over image backgrounds, floating panels, overlay drawers with a backdrop.                  |
| `--surface-strong` | Higher-opacity surface — use when the content behind would make text illegible at `--surface` opacity. Modals, critical popups, confirmation dialogs.      |
| `--inset-glint`    | Subtle white glint on inset elements — inner border highlights, the top edge of embossed buttons, the rim of an avatar ring. Creates depth without shadow. |
| `--header-bg`      | Navigation bar / top header background. Semi-transparent so the page bleeds through slightly on scroll.                                                    |
| `--chip-bg`        | Background for filter chips, tag pills, keyboard shortcut badges.                                                                                          |

```css
.modal {
  background: var(--surface-strong);
  backdrop-filter: blur(12px);
}
.glass-card {
  background: var(--surface);
  backdrop-filter: blur(8px);
}
header {
  background: var(--header-bg);
}
.chip {
  background: var(--chip-bg);
  border: 1px solid var(--chip-line);
}
```

---

### 8. Lines & Borders

| Token         | When to use                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--border`    | Default border for all UI components: inputs, cards, tables, dividers, separators. The go-to border color.                                            |
| `--input`     | Border/background for form inputs specifically. Gives inputs their own override point separate from general borders.                                  |
| `--line`      | Decorative structural lines — section dividers, rule lines between content blocks, table row borders. Lower contrast than `--border`, more recessive. |
| `--chip-line` | Border for filter chips and tag pills. Slightly green-tinted to tie chips back to the brand palette.                                                  |
| `--ring`      | Focus ring color. Applied via `outline` or `box-shadow` on focused interactive elements for accessibility.                                            |

**Rule:** Use `--border` for structural component boundaries. Use `--line` when the separator is purely visual (e.g. between paragraphs or list sections). Never remove focus rings — use `--ring` consistently on all interactive elements.

```css
input,
select,
textarea {
  border: 1px solid var(--input);
}
.card {
  border: 1px solid var(--border);
}
hr,
.divider {
  border-color: var(--line);
}
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

---

### 9. Brand Primitives

These are the raw brand colors. They are used for expressive, decorative, or brand-identity purposes — not for interactive UI patterns.

| Token            | What it is       | When to use                                                                                                                                                 |
| ---------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--sea-ink`      | Deep teal-green  | Main brand text color for large display headings in hero sections, logo text, or brand wordmarks. Not for body copy.                                        |
| `--sea-ink-soft` | Muted mid teal   | Subheadings in brand-heavy sections, icon fills in marketing contexts, kicker labels.                                                                       |
| `--lagoon`       | Bright teal      | Decorative highlights — gradient mesh background spots, animated blob backgrounds, tag badge accents in marketing contexts.                                 |
| `--lagoon-deep`  | Saturated teal   | Hover state for lagoon elements, active state on brand-colored icons.                                                                                       |
| `--palm`         | Forest green     | Secondary brand color used in illustrations, gradient stops, and nature-themed visual motifs.                                                               |
| `--sand`         | Pale green-white | Section tint backgrounds, alternating row colors in dense tables, subtle page section differentiators.                                                      |
| `--foam`         | Near-white green | Lightest surface tint. Use in place of pure white when you want a barely-there warmth — inline code backgrounds, blockquote fills, empty state backgrounds. |

**Rule:** Brand primitives are expressive, not functional. Never use `--lagoon` to indicate "clickable" — that is `--primary`'s job. Never use `--palm` to indicate "success" — that is `--success`'s job.

```css
.hero-heading {
  color: var(--sea-ink);
}
.section-kicker {
  color: var(--sea-ink-soft);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.gradient-blob {
  background: var(--hero-a);
  filter: blur(80px);
}
.code-inline {
  background: var(--foam);
}
.section-alt {
  background: var(--sand);
}
```

---

### 10. Decorative & Hero Tokens

| Token             | When to use                                                                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--hero-a`        | Translucent teal blob / radial gradient in hero sections. Layer two of these at different positions for a subtle ambient glow behind hero text.          |
| `--hero-b`        | Translucent green blob for the secondary hero gradient layer. Pair with `--hero-a` at a different position and size.                                     |
| `--kicker`        | The small uppercase label above a section heading ("About us", "Our services"). Slightly transparent green gives it brand character without being heavy. |
| `--link-bg-hover` | The background flash on a hovered link in a list or nav. Use as `background-color` on `:hover` for list items and inline nav links.                      |

```css
.hero-glow-1 {
  position: absolute;
  width: 600px;
  height: 600px;
  background: var(--hero-a);
  border-radius: 50%;
  filter: blur(100px);
}
.hero-glow-2 {
  background: var(--hero-b);
  filter: blur(120px);
}
.section-kicker {
  color: var(--kicker);
}
.nav-link:hover {
  background: var(--link-bg-hover);
}
```

---

### 11. Charts

Chart tokens are ordered by visual weight. Use them in sequence to avoid adjacent similar colors.

| Token       | Suggested use                     |
| ----------- | --------------------------------- |
| `--chart-1` | Primary data series (orange-warm) |
| `--chart-2` | Secondary data series (teal)      |
| `--chart-3` | Tertiary data series (deep blue)  |
| `--chart-4` | Quaternary data series (yellow)   |
| `--chart-5` | Quinary data series (gold)        |

Never use semantic state colors (`--error`, `--success`, `--warning`) in charts — users will interpret them as alerts.

---

### 12. Sidebar

Sidebar tokens mirror the global semantic tokens but give the sidebar its own override layer. This lets the sidebar have a slightly different surface treatment without breaking global tokens.

| Token                          | When to use                                                          |
| ------------------------------ | -------------------------------------------------------------------- |
| `--sidebar`                    | Sidebar panel background                                             |
| `--sidebar-foreground`         | Text inside the sidebar                                              |
| `--sidebar-primary`            | Active / selected sidebar item indicator, icon fill for active items |
| `--sidebar-primary-foreground` | Text on a primary-colored sidebar element                            |
| `--sidebar-accent`             | Hover background on sidebar items                                    |
| `--sidebar-accent-foreground`  | Text on hovered sidebar items                                        |
| `--sidebar-border`             | Sidebar outer border or item separator lines                         |
| `--sidebar-ring`               | Focus ring inside the sidebar                                        |

---

## Decision Tree

Use this when you're unsure which token to reach for:

```
Is it the main page canvas?
  └─ Yes → --background or --bg-base

Is it a component that floats above the page?
  └─ Yes → --bg-light (opaque) or --surface (translucent)

Is it the darkest anchor (footer, dark hero)?
  └─ Yes → --bg-dark

Is it text?
  ├─ Primary / must-read → --foreground
  ├─ Supporting / meta   → --muted-foreground
  └─ On a colored bg     → use the matching -foreground token

Is it the main interactive element (CTA, primary button)?
  └─ Yes → --primary

Is it a supporting/ghost element?
  └─ Yes → --secondary

Does it need to catch the eye in an editorial/featured context?
  └─ Yes → --accent (use sparingly)

Is it a system state (error/warning/success)?
  └─ Yes → --error / --warning / --success (never for decoration)

Is it a border?
  ├─ Component structure → --border
  ├─ Form input          → --input
  ├─ Decorative line     → --line
  └─ Focus ring          → --ring

Is it a brand expression / hero / decoration?
  └─ Yes → brand primitives (--sea-ink, --lagoon, --palm, etc.)
```

---

## Common Mistakes to Avoid

**Using `--lagoon` or `--palm` as interactive colors.** These are brand colors, not UI colors. Users don't associate teal or green with "click me" in this system — navy (`--primary`) holds that role.

**Using `--success` green for brand decoration.** If a green section background uses `--success`, users will subconsciously read the section as a confirmation state. Use `--palm`, `--sand`, or `--bg-base` for green-tinted brand sections instead.

**Putting `--muted-foreground` text on interactive elements.** Muted text signals "this doesn't matter." Buttons, links, and labels the user acts on must use `--foreground` or a proper foreground token.

**Stacking too many accent appearances.** The brass `--accent` loses its signal value quickly. If it appears more than twice on a page, audit each use — most can be replaced with `--primary-light` or a border treatment.

**Forgetting `--ring` on focus states.** Every interactive element must have a visible focus ring using `--ring`. This is non-negotiable for accessibility.
