# Design System Inspired by Bewakoof

## 1. Visual Theme & Atmosphere
The Bewakoof website presents a vibrant and youthful aesthetic, characterized by a clean layout that emphasizes product imagery. The use of bright accent colors against neutral backgrounds creates an inviting shopping experience, while playful typography adds to the brand's casual and fun identity.

Key Characteristics:
- Bright accent colors such as #207bb4 and #339d9c.
- Clean, grid-based layout focusing on product displays.
- Use of the Montserrat font family for a modern feel.
- High contrast between text and background for readability.
- Minimalist approach with ample whitespace around elements.
- Interactive elements like buttons and filters enhance user engagement.
- Responsive design that adapts well across devices.

## 2. Color Palette & Roles
### Primary
- **#207bb4** — Used for accent elements and buttons.
- **#339d9c** — Another primary accent color, featured prominently in buttons and highlights.

### Accent Colors
- **#0000ff** — Used sparingly for accents.
- **#008000** — Additional accent color for highlights.
- **#fdd835** — Bright accent color for calls to action.

### Interactive
- **#ffffff** — Text on dark backgrounds for high visibility.
- **#363537** — Primary text color for body and headings.
- **#676767** — Secondary text color for less emphasized text.

### Neutral Scale
- **#f1f2f4** — Light background color used for sections.
- **#c7cbd4** — Neutral color for subtle borders and backgrounds.
- **#000000** — Dark background elements.

### Surface & Borders
- **#eaeaea** — Light neutral used for subtle borders.
- **#292d35** — Dark text for headings and important information.

## 3. Typography Rules
- **Font Family**: Montserrat, sans-serif; fallback: Arial, sans-serif.
- **Hierarchy**:

| Role   | Font       | Size   | Weight | Line Height | Letter Spacing | Notes           |
|--------|------------|--------|--------|-------------|----------------|------------------|
| H1     | Montserrat | 24px   | 600    | 1.2         | Normal         | Main headings    |
| H2     | Montserrat | 22px   | 400    | 1.5         | Normal         | Subheadings      |
| H3     | Montserrat | 20px   | 400    | 1.5         | Normal         | Section titles    |
| Body   | Montserrat | 18px   | 400    | 1.5         | Normal         | Main body text   |
| Caption| Montserrat | 14px   | 400    | 1.5         | Normal         | Small text       |
| Code   | Montserrat | 16px   | 400    | 1.5         | Normal         | Monospace fallback|

### Principles
- Consistent use of Montserrat across headings and body text.
- Emphasis on readability through appropriate line heights.
- Clear differentiation between headings and body text using size and weight.

## 4. Component Stylings

### Buttons
**Primary Button**
```css
.button-primary {
  background-color: #339d9c;
  color: #ffffff;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.button-primary:hover {
  background-color: #207bb4;
}

.button-primary:disabled {
  cursor: default;
}
```

**Secondary Button**
```css
.button-secondary {
  background-color: transparent;
  color: #339d9c;
  padding: 12px 24px;
  border: 2px solid #339d9c;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.button-secondary:hover {
  background-color: #f1f2f4;
}

.button-secondary:disabled {
  cursor: default;
}
```

### Cards & Containers
**Standard Card**
```css
.card {
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}
```

### Inputs & Forms
**Text Input**
```css
.input {
  border: 1px solid #c7cbd4;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
}

.input:focus {
  border-color: #339d9c;
  outline: none;
}
```

**Checkbox**
```css
.checkbox {
  accent-color: #339d9c;
}
```

### Navigation
**Top Navigation Bar**
```css
.navbar {
  background-color: #ffffff;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: #363537;
  padding: 8px 16px;
}

.nav-link:hover {
  text-decoration: underline;
}
```

### Links
**Standard Link**
```css
.link {
  color: #207bb4;
  text-decoration: none;
}

.link:hover {
  color: #339d9c;
}
```

### Badges
**Status Badge**
```css
.badge-success {
  background-color: #278c03;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 12px;
}

.badge-alert {
  background-color: #fdd835;
  color: #000000;
  padding: 4px 8px;
  border-radius: 12px;
}
```

## 5. Layout Principles
- **Spacing System**: Base unit 4px → 4, 8, 12, 16, 20, 24, 32, 40.
  - **Usage Context**:
    - 4px: Minor adjustments.
    - 8px: Small element spacing.
    - 12px: Medium element spacing.
    - 16px: Standard padding for containers.
    - 20px: Larger gaps between sections.
    - 24px: Spacing around buttons.
    - 32px: Major section margins.
    - 40px: Large container margins.

- **Grid & Container**  
_Note: container widths and column counts are not extracted from the source. The values below are reasonable defaults inferred from the visible layout density._  
Max width: 1200px, Columns: 12, Gutter: 16px, Section padding: 24px.

- **Whitespace Philosophy**: Whitespace is used generously to separate different sections and elements, promoting a clean and organized appearance.

- **Border Radius Scale**: 
  - 4px: Small elements (buttons).
  - 8px: Standard elements (cards).
  - 24px: Large elements (containers).

## 6. Depth & Elevation
| Level | Treatment                       | Use                     |
|-------|---------------------------------|------------------------|
| z-0   | None                            | Background elements     |
| z-1   | 0 2px 4px rgba(0, 0, 0, 0.1)  | Cards                   |
| z-2   | 0 4px 8px rgba(0, 0, 0, 0.1)  | Dropdown menus          |
| z-10  | 0 6px 12px rgba(0, 0, 0, 0.15) | Modals                  |

### Shadow Philosophy
Shadows are used sparingly to create depth, primarily for cards and dropdowns, enhancing the visual hierarchy without overwhelming the design.

## 7. Do's and Don'ts

### Do's
- Use **#339d9c** for primary button backgrounds.
- Maintain **14px** font size for captions.
- Ensure at least **16px** padding around text inputs.
- Use **#363537** for body text on **#ffffff** backgrounds.
- Keep **24px** spacing between card elements.
- Use **#292d35** for secondary text on **#f1f2f4** backgrounds.
- Apply **8px** border radius for buttons.
- Use **24px** margins around sections.

### Don'ts
- Never use **#8f98a9** for body text on **#ffffff**; it fails contrast.
- Avoid less than **16px** font size for primary text.
- Don't mix button colors; stick to **#339d9c** for primary actions.
- Avoid using **#f1f2f4** for text on light backgrounds.
- Don't use less than **40px** spacing for large sections.
- Avoid using **#ffffff** for text on dark backgrounds.
- Do not use border radius larger than **24px** on buttons.
- Never place elements closer than **16px** apart.

## 8. Responsive Behavior
_Note: breakpoints below are industry-standard recommendations, not measurements from the source. Adjust to the brand's actual media queries when implementing._

| Breakpoint Name   | Width | Key Changes                     |
|-------------------|-------|---------------------------------|
| Mobile Small      | 640px | Single column layout            |
| Mobile Large      | 768px | Two column layout               |
| Tablet            | 992px | Grid layout with larger items   |
| Desktop           | 1200px| Multi-column layout             |
| Desktop Large     | 1440px| Enhanced grid density           |

- **Touch Targets**: Minimum sizes of **48px** for buttons and links.
- **Collapsing Strategy**: 
  - Navigation: Collapse into a hamburger menu on mobile.
  - Cards: Stack vertically on smaller screens.
  - Typography: Scale down to maintain readability.
  - Padding: Reduce to **16px** on mobile.

## 9. Agent Prompt Guide
- **Quick Color Reference**:
  - Primary: #207bb4
  - Accent: #339d9c
  - Background: #ffffff
  - Text: #363537

- **Iteration Guide**:
  1. Always use **#339d9c** for primary button backgrounds.
  2. Maintain **14px** font size for captions.
  3. Use **16px** padding for text inputs.
  4. Keep at least **24px** spacing between elements.
  5. Ensure **#363537** for body text on **#ffffff** backgrounds.
  6. Use **8px** border radius for buttons.
  7. Apply **#f1f2f4** for background sections.
  8. Maintain responsive breakpoints as defined.
