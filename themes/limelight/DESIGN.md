# Limelight Diamonds Theme Design

## Source

- Template input: https://limelightdiamonds.com/
- Captured audit: `themes/limelight/source-audit/audit.json`
- Desktop screenshot: `themes/limelight/source-audit/home-desktop.png`
- Mobile screenshot: `themes/limelight/source-audit/home-mobile.png`

## Visual Contract

- Brand color: deep plum `#460032`
- Accent/footer gradient: plum/wine gradient from the source footer
- Page background: white with pale grey trust band `#f5f5f5`
- Heading style: source `queens`, implemented with local `Queens` font asset
- Body style: source `YsabeauInfant`, implemented with local `YsabeauInfant` font asset
- Main desktop content width: source sections use 40px page gutters with a 1360px working width at 1440px viewport
- Radius: square image/banner treatment, no card rounding
- Fine-detail rule: preserve computed border width/style/color, divider lines, button outlines, font
  weight, icon source/type, icon size, icon stroke/fill, icon color, and exact spacing. The
  Limelight source navigation uses regular-weight text, thin line icons, square buttons, and
  hairline dividers; these must not be made bolder, thicker, rounded, or generic.
- Font rule: never replace a named source font such as `queens` with a lookalike Google font. Use
  the source `@font-face` asset or record an explicit missing-font exception before substituting.

## Sections

1. Top utility bar with `Find a Store`
2. Header with Limelight logo, uppercase category nav, search/wishlist/account/cart icons
3. Full-width hero image with luxury CTA overlay
4. Shop by Category heading, subheading, and seven category tiles
5. Two-column campaign collage: large jewellery banner plus stacked watch/refine banners
6. Two-column campaign split: mangalsutra bracelet and men's jewellery banners
7. Most in Demand area: static editorial image plus live API product grid
8. Trust band with Limelight trust heading and six trust badges
9. Our Story section with diamond image and text
10. Store locator section with copy and store interior image
11. FAQ accordion
12. Plum gradient footer with logo, assistance CTAs, link columns, and contact info

## Assets

All homepage assets are theme-owned static files under `static/limelight`. Product list data must stay API-owned; the product grid uses `featuredProducts` and does not invent live products.

## Responsive Behavior

- Desktop 1440px+: preserve 40px page gutters, 1360px content width, two-column campaign/story layouts, seven category tiles.
- Laptop 1024px+: reduce nav spacing while preserving header/logo structure.
- Tablet 768px+: collapse campaign/story/store sections to one column and keep category cards scrollable.
- Mobile 375px+: compact top/header, horizontal category scroll, stacked banners, two-column product grid, collapsed footer columns.

## Implementation Steps

1. Project Structure: add `limelight` to theme registry, content resolver, CSS variables, static assets, and homepage component.
2. HTML: compose each source section in order inside `LimelightHomepage.svelte`.
3. CSS: preserve source gutters, section spacing, typography, color, square imagery, and footer gradient.
4. JavaScript: add button loading state for newsletter-style subscription action; preserve Svelte 5 runes.
5. Responsive Breakpoints: implement desktop, laptop, tablet, and mobile behavior in component CSS.
6. Final Optimization: run build and Playwright render checks for theme, assets, static sections, and API product ownership.
