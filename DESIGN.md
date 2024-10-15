---
name: Svelte Commerce
description: A lightning-fast, headless e-commerce storefront.
colors:
  primary: "#111827"
  accent: "#ff3e00"
  background: "#ffffff"
  foreground: "#020817"
  muted: "#f1f5f9"
  border: "#e2e8f0"
typography:
  display:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
rounded:
  md: "8px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: Svelte Commerce

## 1. Overview

**Creative North Star: "The Frictionless Boutique"**

Svelte Commerce is designed for speed and clarity. The aesthetic is "invisible UI"—a minimalist framework that exists solely to stage and sell products. It prioritizes high-contrast typography, generous whitespace, and snappy transitions to create an atmosphere of expert confidence.

The system explicitly rejects the "clunky enterprise" look. There are no heavy borders, no unnecessary shadows, and no decorative gradients. Every element has a functional purpose in the shopper's journey from discovery to checkout.

**Key Characteristics:**
- **High Information Density**: Clean grids that show more products with less scrolling.
- **Typographic Hierarchy**: Bold headings paired with legible, airy body text.
- **Color Constraint**: A restricted palette where color is used only for meaning (actions, status, branding).

## 2. Colors

The palette is anchored in deep neutrals to provide a sophisticated, professional backdrop for vibrant product photography.

### Primary
- **Deep Midnight Navy** (#111827): Used for primary navigation, headings, and core UI structural elements. It conveys stability and trust.

### Secondary
- **Vibrant Svelte Orange** (#ff3e00): The high-energy accent color. Reserved for "add to cart" actions, sale badges, and critical interactive paths.

### Neutral
- **Paper White** (#ffffff): The canvas for the entire experience.
- **Slate Foreground** (#020817): High-contrast text for maximum legibility.
- **Muted Cloud** (#f1f5f9): Used for subtle backgrounds, secondary buttons, and section dividers.

### Named Rules
**The Rarity Rule.** The Vibrant Svelte Orange accent should appear on less than 5% of the total screen area. Its power comes from its isolation.
**The High-Contrast Rule.** All text must maintain a contrast ratio of at least 4.5:1 against its background. Accessibility is not optional.

## 3. Typography

**Display Font:** DM Sans (with sans-serif fallback)
**Body Font:** DM Sans (with sans-serif fallback)
**Label/Mono Font:** Fira Mono (for technical data and order IDs)

**Character:** Modern, geometric, and highly legible. DM Sans provides a clean, neutral voice that works across diverse product categories.

### Hierarchy
- **Display** (700, 2.25rem, 1.2): Used for hero sections and major landing page headlines.
- **Headline** (600, 1.5rem, 1.3): Product titles on detail pages and category headers.
- **Title** (500, 1.125rem, 1.4): Product names in grids and card titles.
- **Body** (400, 1rem, 1.5): Descriptions and general content. Max line length is 70ch.
- **Label** (500, 0.875rem, normal, uppercase): Used for small UI labels, badges, and metadata.

## 4. Elevation

The system is "flat-by-default," relying on tonal layering (light gray on white) and borders rather than heavy shadows to indicate depth.

### Shadow Vocabulary
- **Interactive Lift** (box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)): Applied only on hover to cards and buttons to provide tactile feedback.

### Named Rules
**The Flat-at-Rest Rule.** All elements sit on the same plane until interacted with. Depth is a response to user action, not a decorative state.

## 5. Components

### Buttons
- **Shape:** Rounded (8px)
- **Primary:** Deep Midnight Navy background with white text. Horizontal padding is 1.5x the vertical padding.
- **Hover:** Slight background darken or lift.
- **Ghost:** No background, border-only or text-only until hover.

### Cards
- **Corner Style:** Rounded (8px)
- **Background:** White
- **Border:** 1px Slate (10% opacity)
- **Internal Padding:** 1rem (16px)

### Navigation
- Sticky top-bar with transparent or white background. Minimalist icons (24px) for cart and search.

## 6. Do's and Don'ts

### Do:
- **Do** use generous whitespace (32px+) between major sections.
- **Do** prioritize large, high-quality product imagery.
- **Do** keep button labels short and action-oriented (e.g., "Buy Now", "Add to Bag").

### Don't:
- **Don't** use border-left greater than 1px as a colored stripe on cards or alerts.
- **Don't** use neon gradients or "glassmorphism" effects.
- **Don't** use more than two distinct font families on a single screen.
- **Don't** hide critical shopping information (price, shipping) behind tooltips or hovers.
