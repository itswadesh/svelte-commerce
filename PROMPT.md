# Storefront Theme Prompt

Use this standing prompt when creating, adapting, or reskinning ecommerce storefront themes in this
project.

## Core Workflow

- Before implementation, create or update `PRODUCT.md` with users, success criteria, brand
  personality, anti-references, and 3-5 design principles.
- Before implementation, create or update `themes/<theme>/DESIGN.md` with color tokens, type scale,
  spacing, radius, shadow/border rules, component rules, accent-color usage, responsive behavior, and
  a copyright/plagiarism checklist.
- Keep each theme's `DESIGN.md` inside that theme folder. Do not create a shared root `DESIGN.md`
  that overwrites other themes.

## Header And Footer

- When creating a new theme, clone the source header and footer layout as required sections.
- Include desktop header, mobile nav/drawer, announcement/top bars, logo placement area, action
  icons, footer columns, newsletter/legal rows, social/payment areas, responsive behavior, and
  interaction states.
- Do not call a theme complete if the header or footer is missing or still using the previous
  theme's chrome.

## Originality And Branding

- Do not copy the source logo.
- Change source names to something different, including brand name, domain name, email addresses,
  phone numbers, addresses, copyright text, metadata, page titles, and footer legal identity.
- Use references only for layout patterns, interaction ideas, component roles, and commerce
  expectations.
- Do not copy proprietary logos, logo marks, brand names, domains, product names, campaign slogans,
  long-form copy, photography, illustrations, icon sets, reviews, policies, urgency tactics, or
  distinctive trade dress wholesale.
- Use original target-store content, licensed/local assets, generated or owned assets, API data, or
  clearly different placeholders.

## Complete Storefront Expectations

- Homepage: full-bleed hero, promo/category tiles, featured products, trust/story band, newsletter.
- Shop/catalog: category filters, sort, item count, responsive product grid.
- Product detail: variants, quantity stepper, add to bag, buy now, wishlist, share, live spec table,
  trust row, FAQ accordion, reviews, review form, and related products.
- Cart: persisted items, quantity edits, remove, subtotal.
- Checkout: validated shipping form, order summary, persisted order record, confirmation.
- Account: order history, editable persisted profile, editable persisted saved address.
- Wishlist: dedicated page with remove action and synced header count.
- Long-tail pages: contact, FAQ, shipping/returns, about/story, sustainability, careers, press,
  store locator, gift cards, size guide, order tracking, terms, privacy, and cookie preferences.
- Mobile nav: real drawer/menu with the same core links as desktop.

## Final Checks

- Search for source brand names, domains, emails, phone numbers, addresses, copied policy/review
  text, copyright strings, and unlicensed asset filenames.
- Verify every footer link points to a real page, never a dead `#`.
- Check desktop, tablet, and mobile widths for horizontal overflow.
- Verify forms validate, localStorage persists after reload, and add/remove/update actions really
  mutate state.
- Run a usability critique, prioritize P0/P1 issues, and fix them first.

## Project Skill

The same workflow is also saved as a project skill:

- `.claude/skills/storefront-originality/SKILL.md`
- `.claude/skills/storefront-originality/references/demo-ecommerce-storefront-prompt.md`
