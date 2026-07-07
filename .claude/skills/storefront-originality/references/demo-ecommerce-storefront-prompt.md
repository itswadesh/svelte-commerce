# Demo Ecommerce Storefront Prompt

Build a complete, working demo e-commerce storefront for `[BRAND NAME]`, a `[PRODUCT CATEGOR]`. It should feel production-grade, not like a mockup. Buttons
should perform real actions, with state persisted in localStorage where appropriate.

Do not use exact real logos, copied logo marks, or lookalike logo artwork. Replace logo marks with
the website name as a text wordmark. By default, rename the brand/site to `Website-$1`, where `$1`
is the user-provided or inferred source brand/site identifier.

Before coding, establish the strategy and visual system:

- Write `PRODUCT.md` covering users, success criteria, brand personality, anti-references, and
  3-5 strategic design principles.
- Write `DESIGN.md` covering real color tokens, type scale, named checkable rules, one restricted
  accent color, corner treatment, and shadow/border decisions.

Build:

1. Homepage: full-bleed hero, promo/category tiles, featured products, trust/story band, newsletter.
2. Shop/catalog: filters, sort, item count, responsive grid.
3. Product detail: variants, quantity, add to bag, buy now, wishlist, share, live specs, trust row,
   FAQ, reviews, average rating, star breakdown, review form, related products.
4. Cart: persisted list, quantity edits, remove, subtotal.
5. Checkout: validated shipping form, order summary, persisted order record, confirmation.
6. Account: order history, editable persisted profile, editable persisted saved address.
7. Wishlist: dedicated saved-items page with synced header badge count.
8. Long-tail pages: contact, FAQ, shipping/returns, about/story, sustainability, careers, press,
   store locator, gift cards, size guide, order tracking, terms, privacy, cookie preferences.
9. Mobile nav: hamburger plus real drawer/menu with desktop-equivalent links.
10. Motion: selective fade/rise reveals, `.js` gate, content visible without JavaScript, respect
    `prefers-reduced-motion`.

Run a structured critique after the core flow exists:

- Score against Nielsen's 10 usability heuristics.
- Check for generic AI design patterns.
- Walk through as a first-time user and a distracted mobile user.
- Produce P0-P3 bug list and fix P0/P1 first.
- When one bug class appears, grep the codebase for the same pattern.

Verify at desktop, tablet, and mobile widths using measurements and DOM checks:

- `scrollWidth <= clientWidth`
- responsive layout at desktop, laptop, tablet, and mobile widths
- computed contrast ratios
- class/state changes after clicks
- form validation
- localStorage persistence across reload
- item removal/update behavior

Keep one consistent design system. Borrow only useful ideas from references, then rebuild them
inside the project's own rules. Never copy a reference's colors, branding, urgency tactics, domain,
copy, logo, or identity wholesale. Fix overflowing layouts, images, grids, absolute elements, and
long text instead of hiding unresolved horizontal overflow.
