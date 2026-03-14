---
name: tailwind-css
description: Project-specific Tailwind CSS patterns and configurations for Litekart Admin.
---

# Tailwind CSS Skill

Litekart Admin uses Tailwind CSS 3 for styling. This skill documents custom configurations and project-specific patterns.

## Custom Theme Configuration
The project extends the default Tailwind theme in `tailwind.config.ts`.

### Custom Screen Sizes
- `mobiles`: 322px
- `mobilem`: 376px
- `mobilel`: 520px
- `tablet`: 765px
- `laptop`: 1075px
- `laptopl`: 1439px

### Typography
- The default sans-serif font is `Bricolage Grotesque`.

### Custom Colors
The project uses HSL variables for theming, allowing for easy dark mode support. Key colors include:
- `primary`, `secondary`, `destructive`, `muted`, `accent`, `popover`, `card`, `sidebar`.
- These are mapped to CSS variables in `src/app.css`.

## Styling Patterns

### Dark Mode
Dark mode is implemented using the `class` strategy. Use the `dark:` prefix for dark mode specific styles.

### Animation
The project includes `tailwindcss-animate` and custom keyframes for accordions and carets.

### Utilities
- `tailwind-merge` and `clsx` are used via the `cn` utility function (usually in `$lib/utils.ts`) to merge classes.

## Best Practices
- **Use HSL Variables**: When defining new colors, prefer using HSL variables to maintain consistency with the existing theme and dark mode support.
- **Prefer Standard Utilities**: Avoid creating custom CSS classes unless absolutely necessary. Stick to Tailwind's utility-first approach.
- **Responsive Design**: Utilize the custom screen sizes (`mobiles`, `tablet`, etc.) for fine-grained responsive control.
- **Container**: Use the `.container` class for centered, padded content areas.
