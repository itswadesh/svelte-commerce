---
name: storefront-originality
description: Build or reskin production-grade ecommerce storefronts while avoiding copyright, plagiarism, copied branding, dead links, weak UX, and incomplete flows. Use when creating a new theme, cloning or adapting a reference storefront, applying a static-site design, building a demo ecommerce site, or auditing a storefront for originality and completeness.
---

# Storefront Originality

Use this skill before implementing a new storefront/theme or adapting a reference design.

The root `PROMPT.md` mirrors the standing project prompt for humans and non-skill workflows.

## Required Setup

Before writing implementation code:

1. Create or update `PRODUCT.md` with users, success criteria, one-sentence brand personality,
   anti-references, and 3-5 design principles.
2. Create or update `themes/<theme>/DESIGN.md` with color tokens, type scale, spacing, radius,
   shadow/border rules, component rules, accent-color rules, responsive rules, and originality
   checklist.
3. Read the source/reference only to identify layout patterns, interaction ideas, commerce flows,
   component roles, and visual proportions.

## Originality Rules

- When creating a new theme, clone the source header and footer layout as required sections. Include
  desktop header, mobile nav/drawer, announcement/top bars, logo placement area, action icons,
  footer columns, newsletter/legal rows, social/payment areas, responsive behavior, and interaction
  states. Do not call the theme complete if header or footer is missing or still using the previous
  theme's chrome.
- Do not copy proprietary logos, logo marks, brand names, domains, product names, campaign slogans,
  long-form copy, photography, illustrations, icon sets, reviews, policies, urgency tactics, or
  distinctive trade dress wholesale.
- Replace source identity with target-store identity or clearly different placeholders.
- Do not copy the source logo. Change source names to something different, including the domain name,
  email addresses, phone numbers, addresses, copyright text, metadata, page titles, and footer legal
  identity.
- Use original copy, licensed/local assets, generated/owned assets, API data, or clearly different
  placeholders.
- Clone header/footer layout and behavior when needed, but never copy the source logo, source brand
  name, source domain, source contact details, source address, or source copyright text.
- Keep the final work inside one coherent design system. When borrowing an idea such as a spec table,
  second CTA, trust row, or mobile drawer, rebuild it using the current theme tokens and components.

## Storefront Completeness

For a complete demo ecommerce storefront, include working versions of:

- Homepage with full-bleed hero, promo/category tiles, featured products, trust/story band, and
  newsletter signup.
- Shop/catalog with category filters, sorting, item count, and responsive product grid.
- Product detail with variants, quantity stepper, add to bag, buy now, wishlist, share, live spec
  table, trust row, FAQ accordion, reviews, review form, and related products.
- Cart with persisted items, quantity edits, remove, and subtotal.
- Checkout with validated shipping form, order summary, persisted order record, and confirmation.
- Account with order history, persisted profile, and persisted saved address.
- Wishlist page with remove action and synced header count.
- Footer-linked pages: contact, FAQ, shipping/returns, about/story, sustainability, careers, press,
  store locator, gift cards, size guide, order tracking, terms, privacy, and cookie preferences.
- Mobile navigation with a real drawer/menu containing the same core links as desktop.
- Motion that respects `prefers-reduced-motion` and leaves content visible when JavaScript is absent.

## Verification

Before calling the work complete:

1. Run an originality search for source brand names, domains, emails, phone numbers, addresses,
   copied policy/review text, copyright strings, and unlicensed asset filenames.
2. Verify all footer links point to real pages, never dead `#` links.
3. Check desktop, tablet, and mobile widths for horizontal overflow.
4. Verify forms validate, localStorage persists after reload, and add/remove/update actions really
   mutate state.
5. Run a usability critique using Nielsen heuristics, identify P0/P1 issues, and fix them first.

## Reference Prompt

For the full source prompt that inspired this workflow, read:

- `references/demo-ecommerce-storefront-prompt.md`
