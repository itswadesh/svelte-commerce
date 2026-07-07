# Frontend Design Implementation Skill

Your role is Senior Frontend Developer. Convert the entire design into a production-ready website using only SvelteKit, shadcn, Tailwind, and Svelte 5 runes. Use existing Svelte components.

First build the theme's own `themes/<theme>/DESIGN.md` from the design. Each theme keeps its own
DESIGN.md inside its theme folder — never write or overwrite a shared root `DESIGN.md`, because a new
theme would clobber the previous theme's design doc.

## Requirements

- Every new theme must clone the source header and footer layout as first-class design sections, but
  must not copy the source brand identity. Extract their desktop and mobile HTML/CSS, nav structure,
  logo placement, announcement/top bars, menus,
  cart/account/search actions, social/payment links, newsletter blocks, legal rows, spacing, colors,
  borders, typography, hover/focus states, and responsive breakpoints into
  `themes/<theme>/DESIGN.md` before building page sections. Replace the source logo, brand name,
  domain name, email addresses, phone numbers, physical address, copyright text, and other unique
  identity marks with the target store/theme identity or a clearly different placeholder. Do not call
  a theme complete while the app is still using the previous theme's header, navigation, mobile nav,
  or footer chrome.
- Avoid copyright and plagiarism risk. References, screenshots, static templates, and competitor
  sites may be used only to understand layout patterns, interaction ideas, component roles, and
  commerce expectations. Rebuild the result inside this project's own theme identity and design
  system. Do not copy proprietary logos, brand names, domains, product names, campaign slogans,
  long-form copy, photography, illustrations, icon sets, reviews, policies, urgency tactics, or
  distinctive trade dress wholesale. Replace them with original target-store content, licensed/local
  assets, API data, or clearly different placeholders.

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

- Before writing implementation code for a new storefront/theme, create or update the theme's
  strategy and visual system docs. `PRODUCT.md` should define users, success criteria, brand
  personality, anti-references, and design principles. `themes/<theme>/DESIGN.md` should define
  color tokens, type scale, spacing/radius/shadow rules, component rules, accent-color usage, and a
  copyright/plagiarism checklist for identity, copy, images, icons, reviews, policies, and domains.
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
1. Start with header and footer. Clone their structure from the source theme, including
   desktop/mobile navigation, announcement bars, logo placement, action icons, footer columns,
   newsletter/legal rows, responsive behavior, and interaction states. Do not copy the source logo,
   names, domain, contact details, address, or copyright identity; replace them with different
   target-theme values.
2. Build product component.
3. Build home, PLP, and PDP using parallel agents.
4. Build all other pages in parallel.
5. Before calling the theme complete, run an originality check: search the codebase for source brand
   names, domains, email addresses, phone numbers, copied policy/review text, and unlicensed asset
   filenames. Replace any remaining source identity or copied content.
6. Verify the commerce flow works without errors: PLP/category or `/products`, PDP/product detail,
   add to cart, cart page quantity/remove/subtotal behavior, checkout address/payment/process/success
   flow, and any API/localStorage state needed by those pages.

## Existing SvelteKit Pages To Cover

When creating or applying a new theme, account for these current routes:

- `/`
- `/[slug]`
- `/products`
- `/products/[slug]`
- `/auth/change-password`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/signup`
- `/blog`
- `/blog/[slug]`
- `/checkout/address`
- `/checkout/cart`
- `/contact-us`
- `/faqs`
- `/my`
- `/my/address`
- `/my/addresses/[id]`
- `/my/orders`
- `/my/orders/[id]`
- `/my/profile`
- `/my/wishlist`
- `/p/[slug]`
- `/privacy-policy`
- `/profile`
- `/refund-policy`
- `/shipping-policy`
- `/terms-and-conditions`
