# Frontend Design Implementation Skill

Your role is Senior Frontend Developer. Convert the entire design into a production-ready website using only SvelteKit, shadcn, Tailwind, and Svelte 5 runes. Use existing Svelte components.

First build the theme's own `themes/<theme>/DESIGN.md` from the design. Each theme keeps its own
DESIGN.md inside its theme folder — never write or overwrite a shared root `DESIGN.md`, because a new
theme would clobber the previous theme's design doc.

## Requirements

### Pixel Perfect Development

- Maintain exact spacing, typography, colors, borders, shadows, and layout.
- Follow proper visual hierarchy.
- Use exact font sizes when specified in the design.
- Recreate each section exactly as it appears in the specified template input. For every source
  section, preserve the same section order, layout structure, content hierarchy, visible text/casing,
  images, icons, backgrounds, colors, typography, spacing, borders, shadows, responsive behavior,
  hover states, and interactions. Do not skip, merge, reorder, simplify, or substitute sections
  unless the user explicitly approves it.
- Borders, font boldness, icons, and spacing are not approximations. Capture and reproduce computed
  `font-weight`, icon asset/type/size/stroke/fill/color/placement, border width/style/color/radius on
  every side, divider lines, button outlines, card outlines, and all padding/margin/gap values.
  Never change regular text to bold, bold text to regular, line icons to filled icons, source image
  icons to generic icons, or bordered elements to unbordered elements.
- Font family names are exact design requirements. If the source uses a named `@font-face` family
  such as `queens`, download/use that source font asset and wire it locally; do not substitute a
  lookalike Google/system font such as Cormorant unless the source font is unavailable and the
  exception is explicitly documented.
- Implement and verify section by section. Before moving to the next section, compare the rendered
  section against the template input and fix mismatches in layout, content, spacing, imagery, and
  behavior.
- Treat container width, gutters, section padding, margins, gaps, grid columns, and card spacing as
  exact design contract values. Do not approximate them with `clamp()`, guessed Tailwind classes, or
  visually similar spacing unless the source itself uses responsive/clamped values.
- When the source design uses framework utilities such as Bootstrap `container-*`, `row`, `col-*`,
  `g-*`, `p-*`, `px-*`, `py-*`, `m-*`, `mb-*`, or `my-*`, translate them to their computed pixel
  values at each required breakpoint before implementation. Preserve those values in the Svelte
  component or Tailwind classes.
- Before calling a design match complete, verify rendered container width, left/right gutters,
  section top/bottom padding, header margins, card gaps, grid item dimensions, border widths/colors,
  font weights, and icon dimensions/strokes against the source at desktop, laptop, tablet, and mobile
  breakpoints.

### Fully Responsive

- Desktop: 1440px+
- Laptop: 1024px+
- Tablet: 768px+
- Mobile: 375px+
- Use responsive units where appropriate.

### Animations

- Recreate all hover effects.
- Recreate all transitions.
- Recreate all micro-interactions from Figma.
- Use CSS animations when possible.

### Planning And Output

- Identify all sections.
- Create a development plan.
- List required assets.
- Explain responsive behavior.
- Then generate:
  - Step 1: Project Structure
  - Step 2: HTML
  - Step 3: CSS
  - Step 4: JavaScript
  - Step 5: Responsive Breakpoints
  - Step 6: Final Optimization
- Do not skip any section.

### Implementation Rules

- Always use loading indicators inside buttons when clicked.
- Never create your own page or component. Always modify the existing one.
- Use existing Svelte components.
- Use Svelte 5 runes.
- Use shadcn and Tailwind for UI implementation.

## Sequence For New Designs

0. Use the colors from settings:
   - primary
   - primary foreground
   - secondary
   - secondary foreground
   - accent
   - accent foreground
1. Start with header and footer.
2. Build product component.
3. Build home, PLP, and PDP using parallel agents.
4. Build all other pages in parallel.
