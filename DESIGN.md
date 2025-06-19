# Design System

## 1. Visual Theme & Atmosphere

The design system is built around a stark, high-contrast aesthetic that combines a minimalist monochrome foundation with vibrant, attention-grabbing accents. It emphasizes modern typography, generous whitespace, and a stable, motion-efficient interaction model.

Key Characteristics:

- **High-Contrast Palette**: Pure black and white foundation for maximum readability and a clean, modern look.
- **Vibrant Accents**: Use of a specific Yellow (rgb(255, 186, 25)) for primary actions, hover states, and focal points.
- **Typography-First**: Reliance on the Montserrat font family for a bold, contemporary feel.
- **Minimalist Depth**: Sparing use of shadows and borders; relying on whitespace for hierarchy.
- **Stable Interactions**: Intentional removal of hover/active scale animations to ensure a stable, distraction-free user experience.
- **Standardized Radius**: Consistent use of `rounded-md` across all non-circular elements.

## 2. Color Palette & Roles

### Primary & Accent
- **Yellow (Primary)**: `HSL 42 100% 55%` / `rgb(255, 186, 25)` — Used for primary buttons, active states, hover transitions, and critical notifications.
- **Yellow Foreground**: `HSL 0 0% 0%` — Pure black text/icons on yellow backgrounds.

### Monochrome Foundation (Light Mode)
- **Background**: `#ffffff` (White) — Primary page background.
- **Foreground**: `#000000` (Black) — Primary text and heading color.
- **Muted**: `HSL 0 0% 96.1%` — Subtle backgrounds for secondary sections or cards.
- **Border/Input**: `HSL 0 0% 89.8%` — Soft borders for inputs and structural separation.

### Monochrome Foundation (Dark Mode)
- **Background**: `#000000` (Black) — Primary page background.
- **Foreground**: `#ffffff` (White) — Primary text and heading color.
- **Muted**: `HSL 0 0% 14.9%` — Dark gray for secondary sections or cards.
- **Border/Input**: `HSL 0 0% 14.9%` — Subtle separation in dark environments.

## 3. Typography Rules

- **Font Family**: Montserrat, sans-serif; fallback: system-ui.
- **Hierarchy**:

| Role    | Font       | Size | Weight | Line Height | Notes              |
| ------- | ---------- | ---- | ------ | ----------- | ------------------ |
| H1      | Montserrat | 24px | 700    | 1.2         | Main page headings |
| H2      | Montserrat | 20px | 700    | 1.5         | Section titles     |
| Body    | Montserrat | 16px | 400    | 1.5         | Main body text     |
| Caption | Montserrat | 12px | 600    | 1.5         | Metadata / Labels  |

### Principles
- **Bold Headers**: Headings should always be bold or black (weight 700+) to contrast with body text.
- **Uppercase Labels**: Use uppercase with tracking for secondary buttons and metadata labels to enhance the professional feel.

## 4. Component Stylings

### Buttons
- **Primary Button**: `bg-primary` (Yellow), `text-primary-foreground` (Black), `rounded-md`.
- **Outline Button**: `border-2 border-primary`, `text-foreground`, `rounded-md`.
- **Interaction**: Transition colors on hover (e.g., `hover:bg-black` or `hover:bg-gray-100`), but **never scale**.

### Cards & Containers
- **Border Radius**: Strictly `rounded-md` (approx. 4px) for all boxes.
- **Circular Elements**: Use `rounded-full` only for avatars, checkmarks, or status badges.
- **Elevation**: Use `shadow-sm` for static cards and `shadow-md` for interactive states.

### Inputs & Forms
- **Radius**: `rounded-md`.
- **Focus**: `ring-2 ring-primary` with no offset for a clean, sharp look.

## 5. Layout Principles

- **Spacing**: Base unit 4px. Standard gaps: `gap-4` (16px) or `gap-8` (32px).
- **Whitespace**: Generous margins around sections (`py-12` to `py-20`) to prevent visual clutter.
- **Grid**: 12-column responsive grid with a max-width container of `1200px`.

## 6. Interaction & Motion

### Scale Animations (STRICT RULE)
- **Do Not Use**: `hover:scale-*`, `active:scale-*`, or any transition that modifies the size of elements upon interaction.
- **Reasoning**: To maintain layout stability and a fast, tool-like feel for the shopping experience.

### Color & Opacity
- Use smooth color transitions (`transition-all duration-300`) for hover states.
- Use subtle shifts in background opacity (e.g., `bg-primary/90`) for feedback.

## 7. Do's and Don'ts

### Do's
- Use **Yellow** specifically for "Attention" or "Action".
- Stick to **Black and White** for all structural elements.
- Use **rounded-md** for almost everything.
- Maintain high contrast ratios for accessibility.
- Use **Montserrat** for all text elements.

### Don'ts
- Never use **Blue**, **Teal**, or other brand colors from legacy versions.
- Never use **scale animations** on buttons or images.
- Avoid using **rounded-lg** or larger radii on structural components.
- Don't use light grays on white backgrounds for important text.

## 8. Agent Prompt Guide

- **Color Reference**: Primary: `HSL 42 100% 55%`, Base: Black/White.
- **Radius Reference**: Default to `rounded-md`.
- **Motion Reference**: Colors only, no scaling.
- **Typography Reference**: Bold headings, clean body, Montserrat everywhere.
