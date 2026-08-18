# Chef.ai Design System ("Culinary Sophistication")

Extracted directly from Google Stitch project `ChefAI-Production-UI` (`projects/3238284907772011213`).

---

## 1. Brand & Aesthetic Overview
- **Aesthetic**: Hybrid of **Modern Corporate** reliability and **Glassmorphism** depth set against deep, dark charcoal backdrops.
- **Vibe**: High-end culinary studio atmosphere with warm amber glow accents evoking heat, craftsmanship, and appetite.
- **Core Principle**: Food photography and AI-driven recipe intelligence take center stage against clean, elevated, contrast-rich surfaces.

---

## 2. Color Palette & Tokens

### Primary & Accent Tokens
| Token | Value | Role / Usage |
|---|---|---|
| `--color-primary` | `#ffe2ab` | Primary light text / soft amber highlights |
| `--color-primary-container` | `#ffbf00` | Warm Amber accent for CTAs, active pills, badges, and focal points |
| `--color-on-primary` | `#402d00` | Text on primary containers |
| `--color-on-primary-container` | `#6d5000` | Dark amber contrast text |
| `--color-surface-tint` | `#fbbc00` | Surface amber tint |

### Surface & Neutral Tokens
| Token | Value | Role / Usage |
|---|---|---|
| `--color-background` | `#131313` | Root page background |
| `--color-surface` | `#131313` | Base canvas surface |
| `--color-surface-dim` | `#131313` | Dimmed surface tier |
| `--color-surface-bright` | `#393939` | Brightest interactive surface tier |
| `--color-surface-lowest` | `#0e0e0e` | Deepest contrast background |
| `--color-surface-low` | `#1c1b1b` | Recessed containers |
| `--color-surface-container` | `#201f1f` | Standard card surface (`#1e1e1e` / `#201f1f`) |
| `--color-surface-high` | `#2a2a2a` | Elevated card surfaces / popovers |
| `--color-surface-highest` | `#353534` | Highly elevated dialogs / drawers |

### Secondary & Outline Tokens
| Token | Value | Role / Usage |
|---|---|---|
| `--color-secondary` | `#c8c8b0` | Warm cream / sage for typography & subtle borders |
| `--color-secondary-container` | `#494a38` | Muted secondary chip background |
| `--color-on-secondary` | `#303221` | Text on secondary elements |
| `--color-on-surface` | `#e5e2e1` | Primary text color (high contrast, warm white) |
| `--color-on-surface-variant` | `#d4c5ab` | Secondary text color (warm cream) |
| `--color-outline` | `#9c8f78` | 1px border stroke (5-10% opacity in UI) |
| `--color-outline-variant` | `#504532` | Subtle divider / separator lines |

### Feedback & Status Tokens
| Token | Value | Role / Usage |
|---|---|---|
| `--color-error` | `#ffb4ab` | Expiry warnings / missing items alert text |
| `--color-error-container` | `#93000a` | Urgent alert chip background (e.g., "Expired Yesterday") |
| `--color-on-error` | `#690005` | High-contrast error text |
| `--color-success` | `#22c55e` | "All Ingredients Available" green badge |

---

## 3. Typography Hierarchy

- **Headline Font**: `Montserrat`, sans-serif (Geometric, high-impact, editorial)
- **Body & Label Font**: `Inter`, sans-serif (Clean, systematic legibility)

| Scale | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `display / headline-xl` | Montserrat | 48px | 700 (Bold) | 56px | `-0.02em` |
| `headline-lg` | Montserrat | 32px | 600 (SemiBold) | 40px | `-0.01em` |
| `headline-lg-mobile` | Montserrat | 28px | 600 (SemiBold) | 34px | Normal |
| `headline-md` | Montserrat | 24px | 600 (SemiBold) | 32px | Normal |
| `body-lg` | Inter | 18px | 400 (Regular) | 28px | Normal |
| `body-md` | Inter | 16px | 400 (Regular) | 24px | Normal |
| `label-md` | Inter | 14px | 500 (Medium) | 20px | `0.01em` |
| `label-sm` | Inter | 12px | 600 (SemiBold) | 16px | `0.05em` (Uppercase tracking) |

---

## 4. Spacing & Layout Tokens

- **Base Unit**: `8px`
- **Grid Layout**: 4-column (Mobile), 8-column (Tablet), 12-column (Desktop)

| Token | Value | Description |
|---|---|---|
| `--space-base` | `8px` | Base modular unit |
| `--space-sm` | `12px` | Tight gap between related elements |
| `--space-gutter` | `16px` | Standard grid gutter / card padding |
| `--space-md` | `24px` | Container padding & section gaps |
| `--space-lg` | `48px` | Major section vertical separation |

---

## 5. Border Radius & Elevation

### Border Radii
| Token | Value | Applied To |
|---|---|---|
| `--radius-sm` | `4px` (`0.25rem`) | Small badges, sub-tags |
| `--radius-default`| `8px` (`0.5rem`) | Input fields, small buttons, status chips |
| `--radius-md` | `12px` (`0.75rem`) | Dropdowns, tooltips, list cards |
| `--radius-lg` | `16px` (`1.0rem`) | Standard recipe cards |
| `--radius-xl` | `24px` (`1.5rem`) | Hero banners, modal overlays |
| `--radius-2xl` | `28px` / `32px` | Main content cards & bottom sheets |
| `--radius-full` | `9999px` | Filter pills, avatars, action icons, countdown timer pills |

### Shadows & Depth
- **Level 1 (Flat/Base)**: `#131313` background canvas.
- **Level 2 (Cards & Tiles)**: Background `#1E1E1E` / `#201f1f`, 1px inner stroke `rgba(200, 200, 176, 0.05)`, shadow `0 8px 24px rgba(0, 0, 0, 0.4)`.
- **Level 3 (Floating Bars / Drawers)**: Background `#2a2a2a` with `backdrop-filter: blur(20px)`, 1px border `rgba(255, 191, 0, 0.15)`, shadow `0 16px 40px rgba(0, 0, 0, 0.6)`.
- **Amber Glow (Active CTA)**: `box-shadow: 0 0 20px rgba(255, 191, 0, 0.35)`.

---

## 6. Core Component Standards

1. **Primary Buttons**: Solid Amber (`#ffbf00`) background with dark `#121212` Montserrat bold text and smooth hover scale/glow.
2. **Secondary Buttons**: Ghost-style with Cream/Amber 1px border (`rgba(200, 200, 176, 0.3)`), transparent background.
3. **Filter Pills**: Pill-shaped (`rounded-full`) toggles with subtle dark grey background, transitioning to solid Amber background with `#121212` text when active.
4. **Recipe Cards**: `rounded-2xl` elevated cards with full-width top photography, cuisine chip overlay, pantry match indicator ring, and macro badges.
5. **AI Substitution Drawers**: High-contrast bottom sheets with a central drag handle, urgency chips, ingredient replacement comparisons (1:1 swap ratios), and instant "Apply" actions.
6. **Active Cook-Along Timer**: Capsule pill with circular countdown indicator, elapsed time readout, and quick pause/resume controls.
