# Svelte Commerce UX audit

Date: 2026-09-03. Scope: the whole storefront in this repository, every shipped theme.
Rulebook: [UX_SYSTEM.md](../UX_SYSTEM.md). Every finding names the rule it breaks.

This audit is the "audit first" step that [UX_SYSTEM.md](../UX_SYSTEM.md) section 8 requires before
any redesign. Use it by picking finding ids into a page task, in the wording of section 9 of that
document. The design plan near the end sequences the first five page tasks.

## Method

Sixteen agents audited one dimension each, reading 1463 files in full and screenshotting
292 route-and-width combinations. Five development servers ran, one per shipped theme, at
360, 390, 768, 1024, 1280 and 1440 pixels wide.

Every finding was then challenged by a reviewer whose instruction was to refute it, working from
the cited code and, where the storefront could show it, from a browser reproduction. Findings rated
Critical or High went to a second, independent reviewer. Anything unproven was dropped rather than
softened. An editor per area then merged duplicates and re-ranked severity for consistency.

Evidence base: 161 findings reproduced in a browser, 52
confirmed by two independent reviewers, 193 verified against the code alone.

One limitation is worth stating up front. The development server for the wine theme reverted to the
default theme partway through the audit, after an unrelated write to a local environment file
triggered a reload. Wine findings therefore rest on code review, not on a rendered page.

The backend during the audit was a local GoCommerce store with three products, no product images,
no accounts and no server-side sort or filter parameters. Behaviour that catalogue cannot exercise
was verified from code, and is marked as such. A missing product image is treated as data, not as a
defect, except where the storefront itself handles the empty state badly.

## Summary

| Severity | Findings |
| :-- | --: |
| Critical | 22 |
| High | 89 |
| Medium | 235 |
| Low | 60 |
| **Total** | **406** |

| Area | Critical | High | Medium | Low | Total |
| :-- | --: | --: | --: | --: | --: |
| Global navigation | 4 | 4 | 21 | 7 | 36 |
| Homepage | 3 | 17 | 25 | 6 | 51 |
| Checkout | 3 | 9 | 27 | 7 | 46 |
| Search | 3 | 5 | 15 | 5 | 28 |
| Product detail page | 2 | 9 | 21 | 5 | 37 |
| Product card | 2 | 5 | 13 | 1 | 21 |
| Footer, legal pages and plugins | 2 | 3 | 23 | 8 | 36 |
| Product listing and filters | 1 | 9 | 24 | 2 | 36 |
| Cart | 1 | 9 | 20 | 4 | 34 |
| Loading, empty and error states | 1 | 3 | 4 | 1 | 9 |
| Accessibility |  | 4 | 2 | 1 | 7 |
| Account and authentication |  | 3 | 25 | 6 | 34 |
| Design tokens and theming |  | 3 | 6 | 2 | 11 |
| Performance and layout stability |  | 2 | 3 | 4 | 9 |
| Consistency and duplication |  | 2 | 4 |  | 6 |
| Other |  | 2 | 2 | 1 | 5 |

## Demo findings

The brief listed sixteen findings observed on the public Litekart demo. Their status in this
repository:

| Demo finding | Status | Audit ids | Note |
| :-- | :-- | :-- | :-- |
| D1 | Partly | UX-051, UX-022, UX-203, UX-092 | First load is SSR-seeded and never blanks; filter, sort and page changes still ship no skeletons. |
| D2 | Partly | UX-195, UX-198, UX-200, UX-193, UX-205 | Facets built from the pre-filter window, but counts are never rendered; visible conflict is page totals. |
| D3 | Partly | UX-060, UX-247, UX-243 | No WebGL, 3D or AR anywhere; the gallery still renders nothing when a product lacks images. |
| D4 | Confirmed | UX-043, UX-044, UX-173, UX-185, UX-155 | Wine is 9,157px with a duplicated contact form; empty heading-only bands; editorial precedes products. |
| D5 | Confirmed | UX-008, UX-419, UX-423 | Drawer lists Home and All Products twice; mega-menu footer reads "View all All Products". |
| D6 | Confirmed | UX-114, UX-115 | mega-menu.svelte:103 renders the panel with no backdrop sibling; it also stays open after mouseleave. |
| D7 | Partly | UX-052, UX-195 | No filter value is ever rendered disabled; zero-result values appear as ordinary, unhidden, uncounted checkboxes. |
| D8 | Confirmed | UX-047, UX-049, UX-140 | Applied-filters block is commented out; the only Clear is a 67x16px link inside the sidebar. |
| D9 | Refuted | UX-447 | product-card.svelte:30 derives categoryName, but no card template in any theme renders brand or vendor. |
| D10 | Confirmed | UX-143, UX-136, UX-129, UX-259 | Hardcoded gray-400 supporting text and icons at 2.3-2.5:1, rescued only under the default theme. |
| D11 | Partly | UX-206, UX-231, UX-441 | Default and lime clamp titles to two lines; wine, organic and noor never clamp at all. |
| D12 | Partly | UX-119, UX-177, UX-189 | Slides are 100%-wide with mandatory snap, so no bleed; the wine ticker clips and cannot pause. |
| D13 | Confirmed | UX-153, UX-023 | "Explore categories" points at /products; wine's "Browse Categories" points at /about-us. |
| D14 | Refuted | UX-442, UX-236 | No cookie or consent banner exists; three bottom-fixed layers overlap instead (mobile-filter.svelte:45). |
| D15 | Confirmed | UX-218 | product-variation.svelte:34 renders option values uncapped — no cap, "+N more", select or grouping. |
| D16 | Partly | UX-248, UX-247 | Fixed 50/50 grid cannot over-space alone; `top-28` lacks `sticky`, so the panel scrolls away. |

## Findings

### Global navigation

Every shipped theme loses its header navigation at some common viewport, no store ships a search control, and the mobile drawer is not an accessible dialog.

#### UX-007 · Lime and noor desktop headers have no navigation
- **Evidence** — `src/lib/theme/lime/LimeNav.svelte:28` "const navLinks = $derived(themeContent?.nav?.links ?? [])"; `src/lib/theme/noor/NoorNav.svelte:27` same line; `src/lib/theme/homepage-content.ts:13` "const CONTENT_BY_THEME: Record<string, ThemeHomepageContent> = {"; `src/lib/theme/noor/NoorNav.svelte:162` ".noor-mobile-trigger { display: none;"; `src/lib/theme/noor/NoorNav.svelte:187` ".noor-nav { display: flex;"; screenshots header-nav-r4-lime-1280-crop.png, header-nav-r4-noor-1280-crop.png, header-nav-r4-noor-390-crop.png.
- **Impact** — Desktop shoppers on lime and noor get a wordmark and two icons, with no route to a category or the product list. The hamburger is hidden above 900px, and the header menu that the other three themes render never reaches these two. Noor also paints the empty category row as a ruled 25 to 29px band on every page. Also reported as UX-118.
- **Fix** — Fall back to the store's header menu when theme content supplies no links, and render the shared mega-menu in the category row as the default header does. Guard the noor category row on link count, the way the announcement band above it already is.
- **Rule** — 5 Permanent UX rules > Global navigation, "Keep the desktop header to a compact utility row plus a clearly organised category row". **Themes** — lime, noor. **Verified** — two reviewers.

#### UX-010 · Mobile listing pages swap all navigation for a back arrow that can exit the site
- **Evidence** — `src/lib/components/nav/nav.svelte:209` "{#if navModule.isProductListingPage}"; `src/lib/components/nav/nav.svelte:211` "<Button variant="ghost" size="icon" aria-label="Go back" onclick={navModule.goBack}>"; `src/lib/components/nav/nav.svelte:225` "{(navModule.productsCount ?? 0).toLocaleString('en-US')} products"; screenshot header-nav-r4-plp-390-crop.png.
- **Impact** — Below 640px on the product list and category pages the logo, menu button and search are all replaced by a back arrow. Opening the product list in a fresh tab and pressing it lands on about:blank, which is the ordinary path from an ad, a search result or a shared link. The row also repeats the heading the page prints directly below it.
- **Fix** — Keep the persistent header on listing routes and leave the title and count to the listing page heading that already carries them. If a back control stays, point it at the parent category or the product list rather than browser history.
- **Rule** — 5 Permanent UX rules > Global navigation, "Navigation and search must make product discovery immediate"; 10 Definition of done, "No new console errors or broken navigation". **Themes** — default, wine, organic. **Verified** — two reviewers.

#### UX-011 · No store ships a search control
- **Evidence** — `src/lib/core/connectors/default-store.json:298` ""search": { "active": false"; `src/lib/components/nav/ms-search.svelte:60` "{#if searchPlugin?.active !== false}"; `kitcommerce.config.ts:49` "export default {}"; `node_modules/@misiki/gocommerce-connector/dist/services/index.js:1441` "async searchAutoComplete(params = {})"; screenshots search-home-default-1280.png, search-home-default-390.png.
- **Impact** — The shipped static store turns search off, nothing overrides it, and the only trigger is gated on that flag. Probing the homepage at 390px and 1280px on all five theme servers found no search control at all. Shoppers are left with browsing, even though the connector implements autocomplete and term search.
- **Fix** — Default the search plugin on for static-store connectors, and keep the trigger in the existing header action group so desktop shows it and mobile reaches it in one tap.
- **Rule** — 5 Permanent UX rules > Global navigation, "Make search immediately visible on desktop and reachable in one tap on mobile". **Themes** — all. **Verified** — browser.

#### UX-012 · Tablet widths lose the header menu entirely
- **Evidence** — `src/lib/components/nav/nav.svelte:198` "class="md:hidden""; `src/lib/components/nav/nav.svelte:233` "class="md:hidden""; `src/lib/components/nav/main-nav.svelte:47` "<div class="ml-6 hidden items-center space-x-6 lg:flex">"; `src/lib/components/nav/nav.svelte:244` "{#if navModule.megaMenuPluginActive}"; screenshots header-nav-r4-default-768.png, header-nav-r4-plp-768-crop.png.
- **Impact** — The menu button hides from 768px and the inline header links only appear from 1024px. Between those widths the header holds the wordmark, cart and account and nothing else. The category row would cover the gap, but it renders only when the megamenu plugin is on, which is off on this store and on most connectors.
- **Fix** — Make the two breakpoints agree, either by keeping the menu button until the inline links appear or by showing the links from the medium breakpoint. Render one category row from the existing mega-menu component, with a flat fallback when categories have no children.
- **Rule** — 5 Permanent UX rules > Global navigation, "Keep the desktop header to a compact utility row plus a clearly organised category row". **Themes** — default, wine, organic. **Verified** — two reviewers.

#### UX-006 · Header action icons are far below the minimum target size
- **Evidence** — `src/lib/components/nav/cart-sidebar.svelte:98` "<button class="flex rounded-full px-2""; `src/lib/components/nav/ms-search.svelte:61` "<button class="ed-search-trigger flex rounded-full px-2""; `src/lib/components/nav/nav.svelte:286` "<div class="ed-action flex items-center justify-center text-muted-foreground"; `src/lib/theme/lime/LimeNav.svelte:202` "width: 18px;"; screenshots header-nav-r4-actions-default-390.png, header-nav-r4-actions-lime-390.png, a11y-w-header-targets-390.png.
- **Impact** — Measured at 390px, the default cart box is 36 by 20 and account 20 by 20, the lime hamburger is 18 by 18 and its cart 34 by 18, and the noor hamburger is 20 by 20. The same sizes hold at 1280px. Phone shoppers repeatedly miss the two highest intent controls in the header.
- **Fix** — Route every header action through the ghost icon button in src/lib/components/ui/button, which is already 36px, and raise it to 44px below the small breakpoint. Delete the global 18px icon rule in the lime header, or it keeps shrinking the glyph inside the new button.
- **Rule** — 4 Implementation architecture > Density rules, "Mobile interactive controls are normally at least 44px high"; 7 Accessibility and performance, "about 44px for important mobile actions". **Themes** — all. **Verified** — two reviewers.

#### UX-009 · The noor desktop header puts the logo and icons in the wrong columns
- **Evidence** — `src/lib/theme/noor/NoorNav.svelte:131` "grid-template-columns: 1fr auto 1fr;"; `src/lib/theme/noor/NoorNav.svelte:162` ".noor-mobile-trigger { display: none;"; `src/lib/theme/noor/NoorNav.svelte:138` "justify-self: center;"; `src/lib/theme/noor/NoorNav.svelte:134` "padding: 0 44px;"; screenshot header-nav-r4-noor-1280-crop.png.
- **Impact** — Above 900px the hidden menu button stops being a grid item, so only two children remain in a three column grid. At 1280px the store name sits at x 291 instead of centred and the cart and account icons sit at x 600, leaving about 600px of empty header. The cart is nowhere near the top right corner shoppers reach for, and the hand written padding puts the header 56px outside the shared content rail at 1440px.
- **Fix** — Keep the menu button in the grid above 900px by hiding it with visibility rather than display, so the logo lands in the centre column and the actions are pushed right. Wrap the header row in the shared page-width container instead of the hand written padding.
- **Rule** — 2 Codebase map > Page container, ".page-width in src/app.css … Use it; do not add another max-width"; 10 Definition of done, "Works at all defined breakpoints without clipping". **Themes** — noor. **Verified** — two reviewers.

#### UX-013 · The mobile menu drawer is not an accessible dialog
- **Evidence** — `src/lib/components/nav/nav.svelte:299` "<aside class:ed={activeThemeName === 'default'} class="fixed inset-0 z-[100]"; `src/lib/components/nav/nav.svelte:301` "role="button""; `src/lib/components/nav/cart-sidebar.svelte:134` "role="dialog""; `src/lib/actions/dialog.ts:2` "Modal a11y for the hand-rolled overlays"; screenshots a11y-w-navdrawer-390.png, header-nav-r4-drawer-default-390.png.
- **Impact** — On open the drawer has no dialog role, no name and no focus, so the first three Tab presses walk the header behind it. Escape does not close it, the page scrolls underneath, and closing leaves focus on the body. On mobile this drawer is the only navigation, so keyboard and screen reader users are stranded.
- **Fix** — Give the panel the dialog role, modal flag, label and the shared dialog action the cart drawer already uses, make the backdrop a non-focusable hidden element with only a click handler, and lock background scroll while it is open. The sheet primitive in src/lib/components/ui provides all of this if the drawer is rebuilt.
- **Rule** — 7 Accessibility and performance, "Visible keyboard focus, logical focus order, dialog focus trapping, Escape-to-close". **Themes** — all. **Verified** — two reviewers.

#### UX-014 · Shared components are dressed for the default theme only
- **Evidence** — `src/app.css:106` "--ed-canvas: #f6f3ee;"; `src/lib/components/product-catalogue/listing-header.svelte:36` "tracking-widest text-gray-400">Sort by"; `src/lib/components/product-catalogue/listing-header.svelte:88` ":global([data-theme='default']) .ed-lh__sortlabel"; `src/lib/components/nav/mega-menu.svelte:104` "border-gray-100 bg-white"; `src/lib/components/nav/mega-menu.svelte:172` "border-t border-gray-100 bg-gray-50"; `src/lib/components/nav/main-nav.svelte:64` "tracking-widest text-gray-500"; `src/lib/components/nav/profile-dropdown.svelte:147` "text-red-500"; screenshots tokens-theming-r5-plp-default-1280.png, header-nav-r4-mega-organic-1280.png.
- **Impact** — A second token set is declared only inside the default theme block and gated into shared components 191 times. On the other four themes those variables resolve to nothing, so header links, the mega-menu, the account menu, the filters and the listing header fall back to raw Tailwind greys. The listing heading measures 43.5px on default and 20px elsewhere, and the sort label drops to 2.54:1 contrast. Also reported as UX-116.
- **Fix** — Map the editorial variables onto the existing semantic tokens, give every theme values for those in its own block, and swap the literal greys for the mapped utilities. The theme-gated rules then become ungated rules each theme inherits correctly.
- **Rule** — 2 Codebase map for UX work, "Do not add a second token vocabulary; extend src/app.css and tailwind.config.ts when a primitive is genuinely missing". **Themes** — all. **Verified** — browser.

#### Medium

- **UX-008 · Mobile drawer lists Home and All Products twice** — `src/lib/components/nav/nav.svelte:386`, `:416`. A phone shopper sees the same two destinations under two headings with different icons and has to work out whether they differ. Dedupe the store menu against the hardcoded pair by destination, keeping the hardcoded pair as the fallback. (default, wine, organic)
- **UX-107 · Change password drops out of the account shell** — `src/routes/(www)/auth/change-password/+page.svelte:14`, `src/lib/components/nav/nav.svelte:94`. The account menu links to a full-viewport centred card with no sidebar or breadcrumb, so there is no way back into the account area. Move it under the account routes so it inherits the shell, and restyle the card with the surface, border and radius tokens. (all)
- **UX-108 · Every visitor downloads all five themes** — `src/lib/theme/homepages.ts:6`, `src/lib/components/nav/nav.svelte:36`. The homepage route ships a 101 KB script and a 74 KB stylesheet holding all five theme homepages, of which about a fifth is the active one. Split theme code per deployment and load only below-the-fold theme surfaces dynamically, leaving header, hero and product card static. (all)
- **UX-109 · Category row clips with no scrollbar or overflow control** — `src/lib/components/nav/mega-menu.svelte:45`. With eleven categories the row scrolls 2139px inside 832px and hides its scrollbar, so most top-level categories are unreachable and nothing hints they exist. Roll the overflow into a More entry that opens the existing panel, or wrap the row at the page rail, and drop the extra max-width. (default, wine, organic)
- **UX-110 · Eighteen orphaned components, including a complete mobile bottom navigation** — `src/lib/components/nav/bottom-nav.svelte:98`, `src/routes/styles.css:1`. Nothing imports them, so it is unclear which implementation is canonical, and the starter stylesheet would override the body font and colours if anyone imported it. Delete the orphans, including the bottom navigation whose destinations the header and drawer already carry, and stop the layout budgeting z-index for it. Also reported as UX-416. (all)
- **UX-111 · Escape in the mega-menu drops focus to the page body** — `src/lib/components/nav/mega-menu.svelte:68`, `:102`. Escape destroys the panel holding focus, so a keyboard user loses their place and the next Shift+Tab jumps to the end of the document. Move focus back to the category trigger before closing, as the shared dialog action already does for the other overlays. (default, wine, organic)
- **UX-112 · Five logo implementations, none of them the shared one** — `src/lib/components/nav/main-nav.svelte:35`, `src/lib/theme/lime/LimeNav.svelte:54`. The brand mark differs in size, source, sharpness and accessible name per theme, and the two shared headers pin only its height, so the menu shifts when the image decodes. Consume the shared logo component in all four headers, passing a size class per theme, with one accessible name and a reserved box. (all)
- **UX-113 · Header motion and the hello bar ignore reduced motion** — `src/lib/components/nav/nav.svelte:655`, `:673`. Under reduced motion the header still animates its height and the announcement grid, and the hello bar ticker scrolls forever with no way to pause it. Extend the existing reduced-motion block to the scroll chrome and the ticker, and add a pause control built from the existing button primitive. (default, wine, organic)
- **UX-114 · Mega-menu panel opens with no backdrop** — `src/lib/components/nav/mega-menu.svelte:104`. The panel drops onto live hero content with nothing dimmed, so it reads as an accidental overlay and a mis-aimed click hits a hero action instead of closing it. Add the same fixed scrim the search overlay uses, rendered outside the hoverable list item so the backdrop does not hold the menu open. (default, wine, organic)
- **UX-115 · Mega-menu trigger stays marked open after the pointer leaves** — `src/lib/components/nav/mega-menu.svelte:58`. Only CSS hides the panel while the state stays open, so the trigger keeps its underline and flipped chevron and still reports itself expanded to assistive technology. Restore the close call on mouse leave, with a short delay so a diagonal path into the panel survives. (default, wine, organic)
- **UX-117 · Six competing z-index values across the nav layer** — `src/lib/theme/lime/LimeNav.svelte:149`, `src/lib/components/nav/cart-sidebar.svelte:132`. Lime's header sits below every other theme's, so the product gallery share control paints inside the header band. Add the named z-index scale the rulebook already asks for, apply it to every nav overlay, and give all themes one header level. (all)
- **UX-119 · Wine's homepage ticker never stops and renders empty** — `src/lib/theme/wine/WineHomepage.svelte:132`, `:939`. It animates forever with no pause control and no reduced-motion guard, and with no items it is a bare red band under the hero. Guard it on item count, add a reduced-motion rule and a pause control, or reuse the default theme's wrapping ribbon. (wine)
- **UX-120 · Account menu items are nested inside links and a button** — `src/lib/components/nav/profile-dropdown.svelte:98`, `:144`. Assistive technology sees a link containing a menu item, activation depends on which of the two nested controls has focus, and the wishlist row misses the classes its siblings carry. Let the menu item be the link through the primitive's child snippet, make sign out a menu item with a select handler, and add the missing classes. (all)
- **UX-121 · Six per-theme colour vocabularies, one reading a variable that is never declared** — `src/app.css:204`, `src/lib/theme/noor/NoorNav.svelte:151`. None is mapped to a utility, and the noor header reads a variable declared only in the footer's scope, so it silently uses a literal and ignores the theme value. Collapse each theme's private set into the semantic tokens and delete the local aliases. (default, wine, lime, noor)
- **UX-122 · Sub-12px text is blessed by a config token and used 89 times** — `tailwind.config.ts:143`, `src/lib/components/product-catalogue/listing-header.svelte:36`. The sort label is 10px, bold, uppercase, widely tracked and at 2.54:1 contrast, so shoppers cannot read the label for the control that reorders the catalogue. Remove the 10px step, define 12px and 13px supporting sizes, and move those call sites onto the muted foreground token. (all)
- **UX-123 · Three of five headers expose no navigation landmark** — `src/lib/components/nav/main-nav.svelte:30`, `src/lib/components/nav/nav.svelte:253`. Screen reader users on default, wine and organic get no landmark to jump to, while the only navigation role in the header wraps a single wishlist link. Wrap the header link list and the category row in one consistently named navigation element, and drop the role from the wishlist wrapper. (all)
- **UX-124 · Undefined shadow and easing classes leave the cart drawer flat** — `src/lib/components/nav/cart-sidebar.svelte:132`, `tailwind.config.ts:129`. The drawer slides over the page as an unshaded white rectangle with no edge separating it from the content behind, and the documented elevation steps have almost no call sites. Replace the undefined classes with the existing elevation tokens and adopt those three steps as the only elevation scale. (all)
- **UX-125 · The header collapse jumps page content up mid-scroll** — `src/lib/components/nav/nav.svelte:52`, `:192`. On the homepage everything below the header moves up by 72px at 390px and 46px at 1280px as the shopper scrolls past 90px. Give the sticky header a fixed outer height and animate the rows inside it, and keep the announcement bar present on every route. (default, wine, organic)
- **UX-126 · The menu button is called Sidebar and never reports its state** — `src/lib/components/nav/nav.svelte:197`, `src/lib/theme/lime/LimeNav.svelte:47`. Screen reader users hear an implementation detail on three themes and a different name on the other two, with no signal that the drawer opened. Use one name across all three headers, with expanded state and a control reference, matching the cart trigger. (all)
- **UX-127 · The share popover ships three buttons with no accessible name** — `src/lib/core/components/plugins/share-button.svelte:102`, `:164`. A screen reader user hears "button" three times, including the only way to copy the product link and the only way to close the mobile sheet. Add labels, or render them through the icon button variant with screen-reader-only text as the header already does. (all)
- **UX-128 · Wishlist and account icons differ by theme and breakpoint** — `src/lib/components/nav/nav.svelte:253`, `src/lib/theme/lime/LimeNav.svelte:249`. At 390px the default header drops wishlist while lime and noor drop account at a 900px breakpoint used nowhere else, so controls disappear when a shopper changes device or a merchant changes theme. Define one header action set, render it at every breakpoint, and drive it from the shared breakpoints. (all)

#### Low

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-417 | Buy again shows its empty state while data is still loading | `src/routes/(my)/my/buy-again/+page.svelte:27` | Add loading and error states using the skeleton primitive, or remove the unlinked route |
| UX-418 | Hello bar renders an empty coloured band when only the second or third message is set | `src/lib/components/nav/nav.svelte:184` | Drop the else branch and let the sliding list render whichever messages exist |
| UX-419 | Mega-menu footer link reads "View all All Products" | `src/lib/components/nav/mega-menu.svelte:177` | Use a fixed "View all" label, since the trigger above already names the category |
| UX-420 | A mistyped category shows the slug as the mobile title with "0 products" | `src/lib/components/nav/nav.svelte:225` | Fall back to the store name and hide the count when the page has an error status |
| UX-421 | The announcement bar shows only on the homepage, and noor reads a different content key | `src/lib/components/nav/nav.svelte:143` | Render it on every storefront route and read one key in both headers |
| UX-422 | The cart page offers no way back to shopping once it holds items | `src/routes/(www)/checkout/cart/+page.svelte:108` | Add a "Continue shopping" link below the summary action, using the existing link button variant |
| UX-423 | The header renders the menu button and the main nav twice in every document | `src/lib/components/nav/nav.svelte:193` | Render one copy and swap only the title area on listing routes |

### Search

Search is switched off in the shipped store defaults, and where a merchant turns it on the panel ignores the typed term while Enter lands on a 404.

#### UX-001 · Pressing Enter in the search box lands on a 404

- **Evidence** — `src/lib/components/nav/ms-search-renderer.svelte:111` "goto(\`/${slug}\`)"; `src/routes/(www)/[slug]/+page.ts:20` "if (!resolved && !narrowed) error(404, 'Not found')"; `src/lib/components/product-catalogue/listing-header.svelte:19` "Search Results: "{page.url.searchParams.get('search')}""; `src/routes/(www)/+page.svelte:158` "urlTemplate: \`${origin}/{search_term_string}\`"; screenshots `shots/search-f-enter-mug-default-1280.png`, `shots/search-f-listing-search-default-1280.png`.
- **Impact** — Enter is the only way to submit a search, and it routes to a category slug that does not exist. Typing "mug" renders the 404 page, while the listing route renders the matching product and a result count. Every plural or multi-word query dead-ends the same way, and the homepage publishes this dead URL to search engines as its site-search target.
- **Fix** — Point submit at the listing route the storefront already renders for a term, `/products?search=` with the term encoded, and match the homepage search-action template to it. Robots rules and the canonical already keep that URL out of the index, so no new route or component is needed.
- **Rule** — Section 8, storefront-specific rules, "Navigation and search must make product discovery immediate." **Themes** — all. **Verified** — browser.

#### UX-015 · Autocomplete ignores the typed term and returns the same eight products

- **Evidence** — `src/lib/components/nav/ms-search-renderer.svelte:47` "await meilisearchService.searchAutoComplete({ query })"; `node_modules/@misiki/gocommerce-connector/dist/index.js:1441` "q: params.q || """; network log shows one unchanging request per keystroke, `/proxy/gocommerce/api/products?page=1&limit=8`; screenshot `shots/search-f-mug-default-1280.png`.
- **Impact** — The shared panel sends one parameter name and the active connector reads another, so the query never reaches the backend. Typing "mug", "tee" or "zzzqqq" returns the identical three products on default and lime. A shopper reads those rows as matches and concludes the store stocks items it does not carry.
- **Fix** — Adapt the parameter name in the in-repo connector wrapper at `src/lib/core/connectors/gocommerce.ts`, which already wraps connector behaviour, rather than in the shared panel, which must stay backend-neutral. The existing result list renders correctly once real hits arrive.
- **Rule** — Section 5, search and product listing, "Useful autocomplete: query suggestions, categories, recent searches, and a few products." **Themes** — all. **Verified** — two reviewers.

#### UX-018 · Search is switched off in the shipped defaults, so no theme has a search entry point

- **Evidence** — `src/lib/core/connectors/default-store.json:298` ""search": { "active": false"; `src/lib/components/nav/ms-search.svelte:60` "{#if searchPlugin?.active !== false}"; `src/lib/components/nav/nav.svelte:250` "<MsSearch />"; `src/lib/theme/lime/LimeNav.svelte:67`; `src/lib/theme/noor/NoorNav.svelte:57`; `src/lib/components/nav/bottom-nav.svelte:57`; screenshot `shots/search-f-home-default-1280.png`.
- **Impact** — A shopper on any of the five shipped themes has no way to search. There is no magnifier in the header at 390 or 1280, no search field in the mobile drawer, and the bottom nav that would carry a search tab is imported nowhere. The backend does return results for a term, so the only route to a known product is browsing the whole catalogue.
- **Fix** — Turn the search plugin on in the shipped store defaults so the existing header trigger renders, since that trigger is the one-tap mobile entry point. Ship it with the submit-route and query-parameter fixes above, because enabling it alone exposes both.
- **Rule** — Section 5, global navigation, "Make search immediately visible on desktop and reachable in one tap on mobile." **Themes** — all. **Verified** — two reviewers.

#### UX-016 · Autocomplete offers products only, with no headings, categories, recent searches or a route to full results

- **Evidence** — `src/lib/components/nav/ms-search.svelte:120` "{:else if searchResults.length > 0}" over one flat list; `src/lib/components/nav/ms-search-renderer.svelte:75` "await autoComplete('')"; `src/lib/components/nav/ms-search.svelte:145` "{#if result.price}" against a connector hit map that carries no price; screenshot `shots/search-f-open-default-390.png`.
- **Impact** — The rulebook names four kinds of autocomplete content and the panel ships one, unlabelled. Opening search drops the shopper into three unexplained products under no heading. Prices never render because the suggestion payload has no price field, so a suggestion cannot be judged before clicking. There is no row leading to the full result set. Also reported as UX-133.
- **Fix** — Group the panel with the vendored command primitive: recent searches, matching categories, a few products, then a persistent see-all row pointing at the listing route. Enrich the suggestion payload in the in-repo connector wrapper instead of styling around the missing price.
- **Rule** — Section 5, search and product listing, "Useful autocomplete: query suggestions, categories, recent searches, and a few products." **Themes** — all. **Verified** — two reviewers.

#### UX-017 · The homepage fires eight product and category requests after hydration

- **Evidence** — request log for `/`: `products?page=1&limit=200` three times, `categories?flat=true` three times, a collections list, `products?page=1&limit=8`, and an identity call; `src/routes/(www)/+page.svelte:41` "const homepageModule = new HomepageModule()"; `src/routes/(www)/+page.svelte:27` "setCollectionState()"; `src/lib/core/stores/collection.svelte.ts:12` onMount list; `src/lib/components/nav/ms-search-renderer.svelte:71` "$effect(() => { debouncedSearch(search) })"; `src/lib/components/nav/nav.svelte:250` "<MsSearch />".
- **Impact** — A store with a real catalogue downloads up to 200 full product records three times for a page that shows at most eight cards. The category tree arrives three times and a collections list nothing renders. The search component also fires an empty autocomplete query on every route in the site, before the shopper types and even when the panel is never opened. Also reported as UX-424.
- **Fix** — Stop constructing the homepage module and keep the load-more accumulator in the page component, since the core package cannot be edited here. Guard the search effect on the panel being open, keeping the deliberate open-time recommendations call.
- **Rule** — Section 7, "Optimise images, fonts, API waterfalls and hydration." **Themes** — all. **Verified** — browser.

#### UX-019 · The search term cannot be removed without clearing every filter

- **Evidence** — `src/lib/components/product-catalogue/listing-header.svelte:19` "Search Results: "{page.url.searchParams.get('search')}""; `src/lib/components/product-catalogue/mobile-filter.svelte:110` "{#if filterModule.anyFilterApplied}"; `src/lib/components/product-catalogue/mobile-filter.svelte:149` "Clear All"; `src/lib/components/product-catalogue/listing-grid.svelte:116` "Clear all filters"; screenshots `shots/search-v2-results-default-1280.png`, `shots/search-results-default-390.png`.
- **Impact** — The term appears only in the heading, and the filter module counts it as an applied filter while offering no way to drop just that one. The two controls available are 16px text links that wipe every filter at once. Refining a search means editing the URL or reopening the panel. Also reported as UX-140.
- **Fix** — Render an active-filter chip row above the grid with the outline button variant and an X icon, one chip per applied value plus a clear-all chip, sized for touch on mobile. Exclude the search term from the applied-filter labels in the mobile bar.
- **Rule** — Section 5, search and product listing, "Active filters as removable chips above the grid, with Clear all." **Themes** — all. **Verified** — code.

#### UX-021 · The search overlay is not a dialog

- **Evidence** — `src/lib/components/nav/ms-search.svelte:71` "fixed inset-0 z-[100] ... bg-black/40 backdrop-blur-sm"; `src/lib/components/nav/ms-search.svelte:96` "onkeydown={handleKeyDown}" on the input alone; `src/lib/components/nav/ms-search-renderer.svelte:112` "} else if (e.key === 'Escape') closeSearch()"; measured on default at 390: role and aria-modal null on every ancestor, Tab walks from the last result out to the cart and login links, body overflow stays visible and a wheel moves the page behind to 600.
- **Impact** — A keyboard or screen-reader shopper tabs out of the open panel into the page underneath, cannot dismiss it with Escape once focus sits on a result, and is never returned to the search button after closing. A touch shopper scrolls the page behind the overlay. That is the dialog contract broken in all four of its parts.
- **Fix** — Rebuild the overlay on the installed dialog primitive under `src/lib/components/ui/dialog`, which gives focus trapping, focus restore, Escape and scroll lock, or on the vendored command palette. No new dependency is required.
- **Rule** — Section 7, "Visible keyboard focus, logical focus order, dialog focus trapping, Escape-to-close." **Themes** — all. **Verified** — two reviewers.

#### UX-137 · The search box on the error page leads to a second 404

- **Evidence** — `src/routes/+error.svelte:13` "goto(\`/search?q=${encodeURIComponent(searchQuery.trim())}\`)"; `src/routes/+error.svelte:49` "placeholder="Search for products...""; no search route exists, so the URL falls to the `(www)/[slug]` catch-all; probe log "404 search submit -> url=http://127.0.0.1:5173/search?q=mug h1=404"; screenshot `shots/states-feedback-404-search-result-1280.png`.
- **Impact** — With header search off in the shipped defaults, this box is the only search field a shopper can reach. Submitting a term produces a second "Not found" page. A shopper who mistyped a URL is left with no working recovery path.
- **Fix** — Point the form at the listing route the storefront renders for a term, the same destination as the header fix, and build the field from the input and button primitives with tokens instead of hardcoded border greys.
- **Rule** — Section 10, "No new console errors or broken navigation", with section 8 on immediate discovery. **Themes** — all. **Verified** — browser.

**Medium**

- **UX-020 · The search trigger is a 20px tall tap target** — `src/lib/components/nav/ms-search.svelte:61`. The only entry point to search carries horizontal padding and no height, measuring 36x20 on four themes and 34x18 on lime, well under the project's 44px mobile rule, though the spacing exception keeps it inside the WCAG minimum. Render it with the ghost icon button primitive and give it a 44px hit area below the small breakpoint, using the radius scale instead of a pill that square themes never asked for. (all)
- **UX-129 · Supporting text is hardcoded to grey-400 and corrected only on the default theme** — `src/lib/components/product-catalogue/listing-header.svelte:36` and `:88`; `src/lib/components/product-catalogue/mobile-filter.svelte:263`; `src/lib/theme/default/DefaultHomepage.svelte:1206`. The sort label is 10px grey at roughly 2.5:1 on wine, organic, lime and noor, the mobile filter's empty lines fail on every theme, and the homepage newsletter placeholder measures 2.29:1 because the field declares no placeholder colour. Replace the literal greys with the muted-foreground token and give the newsletter field an explicit placeholder colour, so all five themes read from one value. Also reported as UX-143. (all)
- **UX-130 · A 404 on a legal page drops the whole storefront chrome** — `src/routes/(legal)/+layout.svelte:15`; `src/routes/+error.svelte:20`. About us, privacy, refund, shipping and terms all 404 on a store that has not authored them, and the root boundary sits above the layout that mounts the header and footer, so the shopper gets a recovery card with no navigation, cart or footer. Add an error boundary inside the legal group, ideally rendering a shared error-state component that all five boundaries use. (all)
- **UX-131 · A failed autocomplete request is shown as "No products found"** — `src/lib/components/nav/ms-search-renderer.svelte:50`; `src/lib/components/nav/ms-search.svelte:161`. The catch clause empties the result list, so a dropped connection or a 500 tells the shopper the store does not stock an item it does stock, with no retry. Track a failed flag beside loading and render a distinct branch with a retry button. (all)
- **UX-132 · Mobile listings print the title and count twice** — `src/lib/components/nav/nav.svelte:218` and `:225`; `src/lib/components/product-catalogue/listing-header.svelte:18`. At 390px a search result states the term and the count in the sticky bar, then repeats both in the listing header above the grid. Give the pair one owner: keep the compact sticky bar and make the listing heading screen-reader only below the large breakpoint, as the component's own comment requires. (all)
- **UX-134 · Sign-in, contact and profile fields carry no autocomplete tokens** — `src/lib/components/auth/login-modal.svelte:286` and `:318`; `src/routes/(legal)/contact-us/+page.svelte:139`; `src/lib/components/address/address-form-modal.svelte:52`; `src/lib/components/common/newsletter.svelte:66`. Password managers cannot fill or save credentials, and shoppers retype name, email and address by hand on a phone, while the signup forms already do this correctly. Add the standard tokens through the existing input and textbox props, matching the signup page. Also reported as UX-141. (all)
- **UX-135 · The messages page has unlabelled inputs, an uncompilable class and unsanitised message bodies** — `src/routes/(www)/messages/+page.svelte:184`, `:142`, `:111`, `:115`. Neither the conversation search field nor the composer has an accessible name, the bubble width class can never be generated by the compiler, and message text from the API is injected as HTML. Label both fields with the existing label primitive, drop the dynamic width class, and render message text as text. (all)
- **UX-136 · The search panel is built from literal greys, so it ignores every theme and its close icon fails contrast** — `src/lib/components/nav/ms-search.svelte:83`, `:86`, `:105`, `:132`, `:158`. The panel is the same white and grey card on all five themes, with pill controls in themes whose radius is zero, and the only visible dismiss control measures 2.54:1 against white. Map the surface, border, icon and text colours to the popover, border, muted and foreground tokens, use the shadow and radius scales, and drop the blurred backdrop and the arbitrary z-index. Also reported as UX-138 and UX-147. (all)
- **UX-139 · Suggestions are buttons, not links** — `src/lib/components/nav/ms-search.svelte:124`; `src/lib/components/nav/ms-search-renderer.svelte:119`; `src/app.css:367`. A shopper cannot middle-click a suggestion into a new tab or see its URL before committing, and the default theme's button styling renders product names as tracked capitals that differ from the same names on cards. Pass an href to the same button primitive, which then renders an anchor, and keep the click handler for closing the panel. Also reported as UX-426. (all)
- **UX-142 · Suggestions have no combobox semantics, arrow-key navigation or announcement** — `src/lib/components/nav/ms-search.svelte:87` and `:121`; `src/lib/components/nav/ms-search-renderer.svelte:105`. Measured on all five themes at 390 and 1280: the field has no combobox role or expanded state, the list has no listbox or option roles, no live region reports results, and arrow keys leave focus in the input. Adopt the vendored command palette, which ships those roles and arrow selection, and announce the result count in a polite live region. (all)
- **UX-144 · The loading skeleton is invisible and resizes the panel on every keystroke** — `src/lib/components/nav/ms-search.svelte:114`; `src/lib/components/nav/ms-search-renderer.svelte:64`. Five fixed rows at 1.03:1 against the panel cover the whole debounce window, so the floating panel grows 114px and snaps back with each letter typed. Use the skeleton primitive with a muted fill, draw as many rows as the previous result set, and hold the container height steady between the loading and loaded branches. (all)
- **UX-145 · The no-results state offers nothing to do next** — `src/lib/components/nav/ms-search.svelte:156`. A term that matches nothing produces an icon and two sentences, with no link to all products, no categories and no way to send the term to the listing page. Add secondary actions with the button link variant: browse all products, the top-level categories, and see all results for the term. (all)
- **UX-146 · The search field suppresses the design system focus ring** — `src/lib/components/nav/ms-search.svelte:89`; `src/app.css:277`. A one-off ring-0 override beats the input primitive's ring, so a keyboard shopper returning to the field sees no focus indicator while every other control in the panel draws one. Drop the override and let the global focus token apply. (all)
- **UX-148 · Two different address forms can appear on the checkout address step** — `src/routes/(www)/checkout/address/+page.svelte:278` and `:547`; `src/lib/components/address/address-form-modal.svelte:113`. A guest editing an address sees the modal form over the inline one, with a different field set, no autocomplete attributes, and a red "Save Contact" button where the page's primary action is navy. Align the modal with the inline form's field schema, autocomplete tokens and inline error display, and relabel its submit. (all)
- **UX-149 · The results page is titled "All products" and its empty state never repeats the query** — `src/routes/(www)/products/+page.svelte:28`; `src/lib/components/product-catalogue/listing-grid.svelte:115`. Browser tabs, history and page announcements read "All products" for every search, and a zero-result page offers only "Clear all filters" when the shopper set no filter. Branch the meta title on the search term, and give the empty block search-aware copy that repeats the term with one clear next step. Also reported as UX-430. (all)

**Low**

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-425 | The results heading on the default theme renders at 43.5px, above the 40px page-title ceiling | `src/lib/components/product-catalogue/listing-header.svelte:82` | Clamp the editorial title into the 28 to 40px band of the type scale |
| UX-427 | The overlay fade and scale transitions ignore reduced-motion preferences | `src/lib/components/nav/ms-search.svelte:76`, `:81` | Gate the transitions on the media query, or move to the dialog primitive whose animation classes already respect it |
| UX-428 | A one-hit listing reads "1 Products" | `src/lib/components/product-catalogue/listing-header.svelte:30` | Pluralise from the count inside the existing count span |
| UX-429 | The field is a plain text input with no clear control, and the only X closes the panel | `src/lib/components/nav/ms-search.svelte:88` | Use a search input inside a form with a search role, keeping the X as close |
| UX-431 | Suggestion names truncate to one line, hiding where similar variants differ | `src/lib/components/nav/ms-search.svelte:142` | Allow two lines and show a secondary line such as category, instead of hard truncation |

### Homepage

The homepage is the weakest route in the storefront: two themes ship placeholder grids instead of the products the server already loaded, three render empty section shells, and four have no content of their own.

#### UX-024 · Featured product grid is server-rendered as skeletons
- **Evidence** — `src/routes/(www)/+page.svelte:198` "loading={homepageModule.loading}"; `src/lib/theme/default/DefaultHomepage.svelte:460` "{#if loading}"; `src/lib/theme/wine/WineHomepage.svelte:151` "{#if homepageModule.loading}"; `src/lib/theme/wine/WineHomepage.svelte:228` "{#if homepageModule.loadingFeaturedProducts}"; `node_modules/@misiki/kitcommerce-core/dist/composables/use-homepage.svelte.js:18` "loading = $state(true);"; `src/routes/(www)/+page.ts:17` "const [featuredProducts, featuredCategories] = await Promise.all(["
- **Impact** — Shoppers on the default and wine themes see eight pulsing placeholders where the catalogue should be, then a grid that swaps in after hydration and shifts the page by about 340px. The server HTML carries no product name and no product link, so a visitor without JavaScript and every crawler get a homepage with nothing to buy. Also reported as UX-026 and UX-029.
- **Fix** — Gate the skeleton on loading with no data in hand, so the products the load function already fetched render on the server. Keep the existing skeleton primitive for the client refetch and set its reserved box to the store image ratio.
- **Rule** — Section 6, states and feedback: stable skeletons for first load, subtle progress for later updates. **Themes** — default, wine. **Verified** — browser.

#### UX-025 · Default hero paints transparent until JavaScript hydrates
- **Evidence** — `src/lib/theme/default/DefaultHomepage.svelte:1270` ".ed-hero__body > * {" (opacity 0 on the next line); `src/lib/theme/default/DefaultHomepage.svelte:1295` ".ed-hero__media {"; `src/lib/theme/default/DefaultHomepage.svelte:216` "let inView = $state(false)"; `src/lib/theme/default/DefaultHomepage.svelte:276` "<div class="ed" class:is-in={inView}>"
- **Impact** — Every first-time shopper on the default theme gets a blank cream band where the headline, the copy, both buttons and the hero image should be. The band stays blank for the whole hydration window, and with JavaScript blocked it never fills, so the store's only story and primary action never appear.
- **Fix** — Render the hero visible by default and let the hydration class add the entrance motion, rather than using the visible state as the animation end state. Set the initial hidden state from the same mount hook that flips the class.
- **Rule** — Section 5, homepage: one primary story and one primary action above the fold. **Themes** — default. **Verified** — two reviewers.

#### UX-041 · Quick add puts a variant the shopper never chose into the cart
- **Evidence** — `node_modules/@misiki/kitcommerce-core/dist/composables/product-card-renderer.svelte:88` "variantId: product?.variants[0]?.id"; `src/lib/theme/lime/LimeProductCard.svelte:82` "onclick={() => addToCart(product)}"; `src/lib/theme/noor/NoorProductCard.svelte:79` "onclick={() => addToCart(product)}"; `src/lib/theme/lime/LimeProductCard.svelte:19` "hideCartControls = false"
- **Impact** — A shopper adding a five-variant tee from the lime homepage gets the first size and colour, and the cart drawer shows neither. No card on any theme shows variant or stock information, so a sold-out product looks the same as an available one.
- **Fix** — When a product has more than one variant, send the card action to the product page or open the existing drawer primitive for option choice, keeping single-variant quick add as it is. Show availability on the card from the stock the connector already returns.
- **Rule** — Section 5, search and product listing: product cards prioritise meaningful variant information and availability. **Themes** — all. **Verified** — browser.

#### UX-022 · A slow listing navigation is covered by a blocking scrim instead of progress
- **Evidence** — `src/routes/+layout.svelte:159` "<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm" role="status">"; `src/lib/components/product-catalogue/listing-grid.svelte:113` "{#if !data.products?.data?.length}"; screenshot `demo-findings-d1-overlay.png`
- **Impact** — A shopper who taps through to the listing on a slow connection keeps the previous page, blurred and unclickable, until the search resolves. The listing grid has only a full grid and an empty state, so nothing reserves the grid space and no products appear to be forming.
- **Fix** — Replace the full-viewport scrim with a thin top progress bar built from the primary token and the elevation scale, keeping the delay and the status role. Add a skeleton branch to the listing grid using the existing skeleton primitive at the real card ratio.
- **Rule** — Section 6, states and feedback: never show a blank region while data loads. **Themes** — all. **Verified** — browser.

#### UX-023 · Above-the-fold buttons do not go where their labels promise
- **Evidence** — `src/lib/theme/wine/WineHomepage.svelte:101` "<a href="/about-us" class="story-button">"; `src/lib/theme/default/homepage-content.ts:99` "primaryCta: "Shop the collection","; `src/lib/theme/default/homepage-content.ts:102` "secondaryHref: "/products","; `src/lib/theme/default/DefaultHomepage.svelte:379` "<a class="ed-link" href={ed.hero.secondaryHref}>"
- **Impact** — A wine shopper who taps "Browse Categories", one of only two actions above the fold, lands on the about page, which itself returns 404 on this backend. On the default theme both hero actions and the section link resolve to the same listing, so the labels teach shoppers that wording does not predict destination. Also reported as UX-153.
- **Fix** — Point category-labelled actions at the categories route, as the organic hero already does, and add the missing href fields to the shared hero content type. Keep one filled button and one quiet link so the hero carries a single primary action.
- **Rule** — Section 5, homepage: match every headline and call to action to the imagery shown. **Themes** — default, wine. **Verified** — browser.

#### UX-027 · Display type runs two to three times above the type scale
- **Evidence** — `src/lib/theme/default/DefaultHomepage.svelte:631` "font-size: clamp(2.6rem, 5.6vw, 4.9rem);"; `src/lib/theme/default/DefaultHomepage.svelte:922` "font-size: clamp(2rem, 4vw, 3.2rem);"; `src/lib/theme/wine/WineHomepage.svelte:650` "font-size: clamp(2.7rem, 6vw, 4.8rem);"; `src/lib/theme/wine/WineHomepage.svelte:984` "font-size: clamp(1.9rem, 4vw, 2.7rem);"
- **Impact** — Page titles render at 72px, 77px and 99px at 1280px against a documented 40px ceiling, and section titles reach 51px against a 32px ceiling. The headline plus its paragraph fills the first screen, so the products sit further down on every theme that does this.
- **Fix** — Cap the heading sizes at the documented scale, roughly 28 to 40px for the page title and 22 to 32px for section titles. Declare the clamps once per theme in the stylesheet so every homepage inherits them.
- **Rule** — Section 4, type scale: page title 28 to 40px, section title 22 to 32px. **Themes** — default, wine, organic. **Verified** — code.

#### UX-028 · Homepage forms discard the submission and say nothing
- **Evidence** — `src/lib/theme/wine/WineHomepage.svelte:438` "<form class="source-form" onsubmit={(event) => event.preventDefault()}>"; `src/lib/theme/organic/OrganicHomepage.svelte:279` "<form class="organic-newsletter-form" onsubmit={(e) => e.preventDefault()}>"; `src/lib/theme/sections/newsletter.svelte:30` "<form onsubmit={(e) => e.preventDefault()}>"; `src/lib/theme/default/DefaultHomepage.svelte:242` "async function onSubscribe(e: Event) {"
- **Impact** — A shopper who signs up on wine, organic or noor gets no request, no message and no change of state, so they believe they subscribed when nothing happened. Wine also invites a seven-field reservation and a five-field contact message that vanish on submit. Also reported as UX-037.
- **Fix** — Reuse the existing shared newsletter component, which already validates, disables while sending, reports errors and confirms, and point the wine reservation and contact forms at the contact submission path. Keep every form and give each the loading, success and error states the system requires.
- **Rule** — Section 6, states and feedback: every component defines loading, error and success. **Themes** — wine, organic, noor. **Verified** — browser.

#### UX-030 · Footer and policy links land on bare 404 pages
- **Evidence** — `src/lib/theme/default/homepage-content.ts:83` "{ label: "About Us", href: "/about-us" },"; `src/routes/(legal)/cms-page-load.ts:14` "if (!data?.page?.content && !data?.page?.layouts?.length) error(404, 'Page not found')"; `src/routes/(legal)/contact-us/+page.svelte:204` "<a href="/terms-and-conditions" class="text-primary hover:underline">Terms</a>"
- **Impact** — On all five themes five of the eleven footer links, including privacy, terms, shipping and refunds, reach a 404 page with no header and no footer. A shopper who wants to check the returns policy before buying cannot, and the contact form links its own consent line to the same dead pages.
- **Fix** — Build the footer columns from the menu the backend actually serves and filter the static policy links against the pages that exist. Render the 404 inside the normal layout so a shopper who lands there can carry on.
- **Rule** — Section 10, definition of done: no broken navigation. **Themes** — all. **Verified** — browser.

#### UX-031 · Product cards show cart and wishlist controls that do nothing
- **Evidence** — `src/lib/theme/organic/OrganicHomepage.svelte:186` "<a href="/products/{product.slug}" class="organic-product-card">"; `src/lib/theme/organic/OrganicHomepage.svelte:225` "<button class="organic-add-to-cart">"; `src/lib/theme/wine/WineHomepage.svelte:249` "<span class="menu-heart"><Heart class="h-4 w-4" /></span>"; `src/lib/theme/wine/WineHomepage.svelte:258` "<b><Plus class="h-4 w-4" /></b>"
- **Impact** — A shopper who taps the cart icon, the quantity stepper or the heart on a wine or organic card is navigated to the product page with an empty cart and no saved item. On organic the button sits inside the card link, which gives the card two tab stops and swallows the click; on wine the controls are not focusable at all. Also reported as UX-184.
- **Fix** — Render both cards through the shared product card renderer, which already supplies wishlist and add-to-cart with loading states, following the noor card structure. Let the store image ratio size the media box instead of the fixed height wine applies.
- **Rule** — Section 5, search and product listing: cards prioritise image, name, price, variant information, availability and wishlist. **Themes** — wine, organic. **Verified** — two reviewers.

#### UX-032 · Homepage actions fall below the minimum touch target
- **Evidence** — `src/lib/theme/default/DefaultHomepage.svelte:863` ".ed-link {"; `src/lib/theme/lime/LimeHomepage.svelte:216` ".lime-story a,"; `src/lib/theme/organic/OrganicHomepage.svelte:759` ".organic-add-to-cart {"; `src/lib/theme/sections/section-heading.svelte:33` "<a href={options.ctaHref ?? '/products'}>{cta}</a>"; `src/lib/theme/default/DefaultHomepage.svelte:808` ".ed-dot {"
- **Impact** — Measured at 390px the secondary actions are 22px on default, 34px and 40px on lime, 32px on organic and 19px on noor. The default slider's only touch controls are 7px dots and a 20px pause button, because the arrows are hidden below 767px. Also reported as UX-152.
- **Fix** — Give homepage actions a 44px minimum height on mobile using the button primitive's large size, and pad bare text links to the same hit area. Expand the slider dot and pause targets with a transparent pseudo-element so the painted control keeps its size.
- **Rule** — Section 4, density rules: mobile interactive controls are normally at least 44px high. **Themes** — all. **Verified** — code.

#### UX-033 · Lime and noor heroes carry no visible headline or action
- **Evidence** — `src/lib/theme/lime/LimeHomepage.svelte:69` "<h1 class="lime-hero-title sr-only">"; `src/lib/theme/noor/NoorHomepage.svelte:137` "<h1 class="sr-only">{pageTitle}</h1>"; `src/lib/theme/noor/NoorHomepage.svelte:47` "type: 'banner',"; `src/lib/theme/sections/banner.svelte:49` "{#if options.href}"; screenshot `homepage-fold-noor-1280.png`
- **Impact** — At 1280px the noor fold is one 960px image with no visible text and no button, and the lime fold is a 620px image band above an empty heading. The value proposition exists only in a hidden heading, so it cannot be read, translated or edited per store even once real artwork is uploaded. Also reported as UX-034.
- **Fix** — Add optional heading, text and call-to-action fields to the shared banner section and render them over the image with the theme's own button treatment. Keep the hidden heading as the fallback when the overlay copy is blank, and constrain the hero height so the action stays in the first screen.
- **Rule** — Section 5, homepage: one primary story and one primary action above the fold. **Themes** — lime, noor. **Verified** — browser.

#### UX-035 · Lime shows one and a half products in a rail with no scrollbar
- **Evidence** — `src/lib/theme/lime/LimeHomepage.svelte:346` ".lime-product-grid {"; `src/lib/theme/lime/LimeHomepage.svelte:360` ".lime-product-grid :global(.ll-card) {"; `src/lib/theme/lime/LimeHomepage.svelte:323` ".lime-demand {"; screenshot `homepage-lime-1280.png`
- **Impact** — The rail holds 353px cards in a 646px column, so two of the three products sit off-screen behind a suppressed scrollbar with no arrows, dots or peeking card. The other half of the section is blank whenever the optional feature tile is absent, which is the shipped state. Also reported as UX-036.
- **Fix** — Collapse the section to a single column when the feature tile is missing and render the products as the stable grid the mobile breakpoint already uses. If a scroll rail is kept, use the existing carousel primitive with visible previous and next controls.
- **Rule** — Section 5, homepage: limit repeated carousels and prefer a stable grid for comparison. **Themes** — lime. **Verified** — browser.

#### UX-038 · Four of five themes render another theme's copy
- **Evidence** — `src/lib/theme/homepage-content.ts:13` "const CONTENT_BY_THEME: Record<string, ThemeHomepageContent> = {"; `src/lib/theme/default/homepage-content.ts:20` "ticker: [],"; `src/lib/theme/wine/WineHomepage.svelte:438` "<form class="source-form" onsubmit={(event) => event.preventDefault()}>"; `src/lib/theme/lime/LimeHomepage.svelte:176` "<h2>{faq?.label}</h2>"
- **Impact** — Only the default theme registers bundled content, so on any backend that does not serve theme content the other four fall back to the default headline and empty section objects. Shoppers get the wrong hero copy, blank bands, a zeroed countdown and, on wine, form fields whose labels render as empty strings.
- **Fix** — Register a complete content module per theme alongside the default one, so the payload from the backend becomes an override rather than a requirement. Until then, no section should render when its content keys are absent.
- **Rule** — Section 10, definition of done: the page feels like the same product in every shipped theme. **Themes** — wine, organic, lime, noor. **Verified** — two reviewers.

#### UX-039 · Organic's primary colour fails contrast everywhere it is used
- **Evidence** — `src/app.css:159` "--primary: 104 38% 51%;"; `src/app.css:160` "--primary-foreground: 0 0% 100%;"; `src/app.css:170` "--ring: 104 38% 51%;"; `src/lib/theme/organic/OrganicHomepage.svelte:423` ".organic-btn-primary {"
- **Impact** — White on the organic green measures 2.60:1, so the announcement bar, the hero button, the highlighted hero words and the listing filter apply button all fall below AA. The focus ring uses the same value, so keyboard users get an indicator that is hard to see on light surfaces.
- **Fix** — Darken the organic primary token until white text clears 4.5:1 and update the ring token with it, leaving the accent token as it is. The hardcoded green on the homepage should then read from the token.
- **Rule** — Section 7, accessibility: sufficient text, icon, border and focus contrast. **Themes** — organic. **Verified** — browser.

#### UX-040 · Organic's view all link has no accessible name
- **Evidence** — `src/lib/theme/organic/OrganicHomepage.svelte:149` "<a href="/products" class="organic-view-all">"; `src/lib/theme/organic/OrganicHomepage.svelte:54` "const labels = $derived(themeContent.labels ?? {})"
- **Impact** — The label object is absent from the shipped content, so the link renders as a bare arrow with no text, no title and no label. A screen reader announces a link with no name, and everyone aims at a 16px target, which is the product section's only link to the full catalogue.
- **Fix** — Give the label a literal fallback the way the lime card does for its cart button, and set a minimum hit area on the link from the density rules. Apply the same at both call sites.
- **Rule** — Section 7, accessibility: understandable labels and pointer targets that meet WCAG minimums. **Themes** — organic. **Verified** — two reviewers.

#### UX-042 · Reduced motion is ignored and the wine marquee cannot be stopped
- **Evidence** — `src/lib/theme/default/DefaultHomepage.svelte:1275` ".ed.is-in .ed-hero__body > * {"; `src/lib/theme/default/DefaultHomepage.svelte:1365` "@media (prefers-reduced-motion: reduce) {"; `src/lib/theme/wine/WineHomepage.svelte:948` "animation: ticker 28s linear infinite;"; `src/lib/theme/wine/WineHomepage.svelte:132` "<div class="ticker" aria-label="Popular menu categories">"; `src/lib/theme/wine/WineHomepage.svelte:596` "animation: hero-float 8s ease-in-out infinite;"
- **Impact** — The default theme's reduced-motion rule is less specific than the rule it tries to cancel, so six entrance animations still run for a shopper who asked the system for less motion. Wine has no reduced-motion rule at all and its marquee runs forever with no pause control, which fails the pause requirement for moving content. Also reported as UX-177 and UX-189.
- **Fix** — Write the reduced-motion overrides at equal or higher specificity, or opt into motion under a no-preference query, and add the same guard to the wine keyframes. Give the marquee the pause control the default slider already ships, and guard the band on having ticker content.
- **Rule** — Section 4, motion: respect reduced motion; section 7, reduced motion support. **Themes** — default, wine. **Verified** — browser.

#### UX-043 · Sections render headings and padding over empty content
- **Evidence** — `src/lib/theme/wine/WineHomepage.svelte:307` "<section class="wine-section gallery-section" id="gallery">"; `src/lib/theme/wine/WineHomepage.svelte:344` "<section class="wine-section chefs-section" id="chefs">"; `src/lib/theme/organic/OrganicHomepage.svelte:110` "<section class="organic-stats">"; `src/lib/theme/lime/LimeHomepage.svelte:175` "<section class="lime-faq">"
- **Impact** — Wine renders five bands that contain only an eyebrow and a heading plus empty panels, about 4,470px of a 9,157px page, and the phone version passes ten thousand pixels. Organic shows five bands with no text at all and lime shows an empty category row and an empty heading, so shoppers read the page as broken and the products sit far down it. Also reported as UX-044.
- **Fix** — Wrap each content-driven section in a length guard, the way the shared product grid and tile grid sections already do, and let the empty state components render where a section is required. Set the empty promo grid rows to auto so nothing reserves height.
- **Rule** — Section 5, homepage: remove duplicated content and low-value sections. **Themes** — wine, organic, lime. **Verified** — browser.

#### UX-045 · Wine paints a broken image over every product card without a photo
- **Evidence** — `src/lib/theme/wine/WineHomepage.svelte:243` "src={product.image || product.img || product.thumbnail}"; `src/lib/theme/noor/NoorProductCard.svelte:32` "{#if image}"
- **Impact** — Wine emits the image tag with no guard, so a product with no photo drops the source and the browser paints its broken-image glyph plus the raw product name across the card. Every product on the row then reads as a failed page rather than as merchandise.
- **Fix** — Guard the image the way the sibling themes do, or route it through the placeholder helper this file already imports, which returns deterministic artwork for exactly this case. Better still, render wine's cards through the shared product card.
- **Rule** — Section 5, search and product listing: reserve image dimensions and show a placeholder rather than a broken box. **Themes** — wine. **Verified** — two reviewers.

#### UX-186 · Wine's supporting text is far below the contrast minimum
- **Evidence** — `src/lib/theme/wine/WineHomepage.svelte:1526` ".category-card span {"; `src/lib/theme/wine/WineHomepage.svelte:823` ".hero-stats span,"; `src/lib/theme/wine/WineHomepage.svelte:1655` ".menu-desc {"
- **Impact** — Category card actions, hero statistic labels, product descriptions and blog meta are 10 to 12.5px greys measuring between 1.9:1 and 3.7:1 on white and cream. These are the lines that explain what each card does, and low-vision shoppers cannot read them.
- **Fix** — Use the muted foreground token for secondary text, which the stylesheet already tunes per theme to pass AA. Remove the hardcoded greys rather than adjusting them by eye.
- **Rule** — Section 7, accessibility: sufficient text, icon, border and focus contrast. **Themes** — wine. **Verified** — code.

#### UX-187 · Wine's homepage filter buttons filter nothing
- **Evidence** — `src/lib/theme/wine/WineHomepage.svelte:222` "<div class="filter-row" aria-label="Menu filters">"; `src/routes/(www)/+page.svelte:76` "const filterButtons = $derived(["
- **Impact** — The pills carry no click handler and no state, and the grid below always renders the same six products. A shopper who tries to narrow the selection gets no response, no result count and no empty state, and the number of dead pills grows with the catalogue.
- **Fix** — Make each pill a link to its category, the destination the theme's own category cards already use, and keep the existing hover and active styling with the global focus ring. If real filtering is wanted, it belongs on the listing route.
- **Rule** — Section 6, states and feedback: every control defines its states, including the result of pressing it. **Themes** — wine. **Verified** — browser.

**Medium**

- **UX-150 · Banner section reserves the wrong height** — `src/lib/theme/sections/banner.svelte:32`. The noor hero reserves 810px and settles at 1080px once the real image decodes, which jolts the page as it loads. Enforce the declared ratio on the image box through the store stylesheet hook instead of letting the intrinsic ratio win. (noor)
- **UX-151 · Four content rails compete with the shared page container** — `src/lib/theme/wine/WineHomepage.svelte:555`; `src/lib/theme/organic/OrganicHomepage.svelte:325`; `src/lib/theme/lime/LimeFooter.svelte:112`; `src/lib/theme/noor/NoorFooter.svelte:51`; `src/routes/(legal)/faqs/+page.svelte:38`. Homepage content sits 16px off the header rail on wine and organic, the lime and noor footers misalign with the content above them, and the policy pages run four different widths. Replace each hardcoded width with the container tokens the page container already reads, since every theme block defines them. Also reported as UX-159, UX-174 and UX-183. (wine, organic, lime, noor)
- **UX-154 · Default newsletter band ignores the plugin switch** — `src/lib/theme/default/DefaultHomepage.svelte:556`. The section invites sign-up on a store that cannot subscribe anyone, so submitting returns an error toast while the footer correctly hides its own form. Gate the section on the same plugin flag the footer uses and share one newsletter component between them. (default)
- **UX-155 · Default theme states the same trust claims four times** — `src/lib/theme/default/homepage-content.ts:56`. Free shipping and seven-day returns appear in the announcement bar, under the hero buttons, in the ribbon below and again near the footer, which costs about 110px of the mobile fold and dilutes the hero. Change the shipped defaults so each claim is made once, keeping every component and its admin switch. (default)
- **UX-156 · Default category fallback is unreachable** — `src/lib/theme/default/DefaultHomepage.svelte:79`. A leftover empty array discards the theme's own tiles, so a store with no featured categories loses the category band entirely and the homepage offers no category entry point. Restore the fallback the way the organic and lime themes do, with destinations that resolve. (default)
- **UX-157 · Default fallback content is apparel stock photography** — `src/lib/theme/default/homepage-content.ts:96`. A store selling a gift card, a mug and a tee opens on a clothes rack under fashion copy, so the imagery contradicts the catalogue for every non-apparel merchant. Drive the fallback hero and banner from the first catalogue image with neutral copy, and use the generated placeholder art when nothing is set. (default)
- **UX-158 · Theme imagery bypasses the shared image pipeline** — `src/lib/theme/default/homepage-content.ts:103`; `src/lib/theme/sections/tile-grid.svelte:45`; `src/lib/theme/organic/OrganicHomepage.svelte:84`. The default hero loads a 1400px third-party file for a 350px phone slot, lime and wine images all download at once with no priority or lazy hint, and organic's hero is a background image the preload scanner cannot see. Route theme artwork through the image helper the banner section already uses, mark the one above-the-fold image eager and high priority, and lazy-load the rest. Also reported as UX-169 and UX-178. (all)
- **UX-160 · Form inputs switch off the global focus ring** — `src/lib/theme/organic/OrganicHomepage.svelte:884`; `src/lib/theme/wine/WineHomepage.svelte:1421`. A keyboard user tabbing into the organic or wine newsletter field sees no change at all, and on default only a one pixel border shift. Delete the outline overrides and use the input primitive, which already carries the focus ring. (organic, wine, default)
- **UX-161 · The homepage fetches its products twice** — `src/routes/(www)/+page.ts:17`. The browser downloads the page and then downloads the same product and category lists again during hydration, which lengthens the blank hero and the skeleton grid on slow connections. Hand the server payload to the homepage module instead of letting it refetch, so the client call only runs when there is nothing to show. (all)
- **UX-162 · Lime's fonts are never loaded** — `src/app.css:201`. The theme names two faces that no stylesheet fetches, so every lime heading and product title falls back to the operating system serif and the theme loses its typographic identity. Register a lime entry in the theme font map, pointing at an available pairing until the licensed files exist. (lime)
- **UX-164 · Noor cards reserve no media box** — `src/lib/theme/noor/NoorProductCard.svelte:103`. The ratio sits on the image rather than its container, so a product with no photo collapses the media area and leaves a zero height focusable link. Move the ratio onto the container so the tinted surface reads as the theme's empty state and late images do not shift the grid. (noor)
- **UX-165 · Noor's section link looks like body copy** — `src/lib/theme/sections/section-heading.svelte:33`. The shared heading emits its link with no class hook, so noor cannot style it and the only route from the product section to the catalogue reads as a caption. Style the heading link from the theme's existing global rules with its small-caps link treatment and hover state. (noor)
- **UX-166 · Organic drops to one product per row on phones** — `src/lib/theme/organic/OrganicHomepage.svelte:1065`. A mobile shopper scrolls a full screen per product and cannot compare anything, while every other theme keeps two columns. Use two columns at 768px and below, matching the noor and lime grids. (organic)
- **UX-167 · Organic's hero has two equally weighted buttons** — `src/lib/theme/organic/OrganicHomepage.svelte:96`. Both actions are filled, uppercase and the same size, so attention splits at the moment the page should point at products. Use the button primitive's default variant for the shop action and an outline or link variant for the category action. (organic)
- **UX-168 · Organic fades the focus ring in over 300ms** — `src/lib/theme/organic/OrganicHomepage.svelte:420`. The transition covers all properties including the focus ring, so a keyboard user moving at normal speed never sees a settled indicator. Name the properties actually being animated and keep the focus ring out of the fade. (organic)
- **UX-170 · Theme homepages hardcode colour instead of reading tokens** — `src/lib/theme/organic/OrganicHomepage.svelte:423`; `src/lib/theme/wine/WineHomepage.svelte:741`. A merchant who recolours a theme sees the header, listing and product page change while the homepage keeps the demo palette, its gradient buttons and its frosted cards. Map these values onto the semantic tokens, or onto per-theme variables declared in the stylesheet as the wine and lime themes already do. Also reported as UX-179. (wine, organic, lime, noor)
- **UX-171 · Page blocks duplicate the section library and render worse** — `src/lib/components/page-blocks/blocks.svelte:14`; `src/lib/components/page-blocks/blocks/image-block.svelte:6`; `src/lib/components/page-blocks/blocks/banner-block.svelte:55`; `src/lib/components/page-blocks/blocks/rich-text-block.svelte:6`. Admin-built pages render every device layout and hide the wrong ones with media queries, fetch products once per hidden copy, offer nameless buttons and focusable slides with no keyboard action, and inject merchant HTML unsanitised. Re-express the block types as section instances, which already reserve image dimensions and define empty states, and sanitise rich text the way the footer does. Also reported as UX-181 and UX-437. (all)
- **UX-172 · The radius scale is bypassed by pill and fixed radii** — `tailwind.config.ts:99`; `src/app.css:140`. Nearly two hundred full-round utilities and thirty-three literal radii never consult the radius token, so the three square themes still render pills and their visual argument breaks. Split the token into control, card and surface steps, map them in the config, and replace the literals. (wine, lime, noor, organic)
- **UX-173 · Editorial sections come before the products** — `src/lib/theme/wine/WineHomepage.svelte:178`; `src/lib/theme/lime/LimeHomepage.svelte:91`. A wine shopper passes a full-screen hero, a ticker, categories and a two-photo story before the first product at about 2,300px, and lime places 1,388px of campaign tiles ahead of its rail. Reorder each theme to hero, category discovery, product collection, trust, then editorial, and let the hero height follow its content. (wine, lime, organic)
- **UX-175 · The footer newsletter has no visible label and leaves the page** — `src/lib/components/common/newsletter.svelte:66`. The field is labelled only by its placeholder, validation errors appear as a toast far from the input, and success replaces the whole page, so a shopper subscribing from a product page loses their place. Add a visible label, show validation under the field, and confirm in place as the homepage form does. (default, wine, organic)
- **UX-176 · Two component libraries are dead code** — `src/lib/components/home/collections.svelte:10`; `src/lib/components/image/image-overlay.svelte:37`. Nothing imports these files, so a redesign reaching for a banners or brands section finds components that reserve no image height, mismatch their own skeletons and ship a competitor's demo image, and the store's news ticker plugin has no renderer at all. Delete them or repair them against the current primitives before anything adopts them. Also reported as UX-439. (all)
- **UX-180 · Three select implementations compete and the primitive is unused** — `src/lib/components/ui/select/index.ts:1`; `src/lib/components/form/select.svelte:45`. Sort by is a bespoke combobox with an arbitrary stacking value and no size or variant API, while the same conceptual control appears as a native dropdown elsewhere in one flow. Pick one implementation, keeping the searchable variant only for long option sets, and delete the unused set. (all)
- **UX-182 · Wine's countdown is not tied to a real offer** — `src/lib/theme/wine/WineHomepage.svelte:68`. The timer restarts from a configured duration on every page load, and with nothing configured the band shows three zeroed boxes with blank unit labels and an empty price badge. Render the offer only when it has content, drive the countdown from an absolute end time, and take the price from a real product. (wine)
- **UX-185 · Wine repeats a near-identical contact form** — `src/lib/theme/wine/WineHomepage.svelte:421`; `src/lib/theme/wine/WineHomepage.svelte:500`. The same fields appear twice under different headings on a page that runs 9,157px on desktop, which makes the storefront feel unfinished. Render one enquiry block and keep the second entry point as a link to it, without removing the reservation feature. (wine)
- **UX-188 · Wine's homepage scrolls sideways on phones and tablets** — `src/lib/theme/wine/WineHomepage.svelte:1537`. A decorative photo offset past the gutter pushes the page ten pixels wide at 360, 390 and 768, so the page rocks under a thumb swipe and the header no longer spans the visible width. Contain the overflow on the story block at the breakpoint where it starts rather than only on small phones. (wine)

**Low**

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-432 | The homepage route uses the one component API the stack contract forbids | `src/routes/(www)/+page.svelte:184` | Render the derived component directly, as the sections wrapper already does |
| UX-433 | Decorative content is announced: a watermark, a duplicated ticker run and labels on plain containers | `src/lib/theme/wine/WineHomepage.svelte:85` | Hide decoration from assistive technology and give blank alt text to decorative images |
| UX-434 | Scoped CSS describes states that never render, including the lime accordion icon and removed wine markup | `src/lib/theme/lime/LimeHomepage.svelte:538` | Target component icons through a global selector and delete the legacy rules |
| UX-435 | An unrecognised assurance icon key crashes the default homepage | `src/lib/theme/default/DefaultHomepage.svelte:542` | Fall back to a default icon as the organic theme already does |
| UX-436 | Noor cards never receive theme labels, and its newsletter heading renders at body size | `src/lib/components/product-catalogue/product-card.svelte:45` | Forward the content prop through the card wrapper and style the newsletter heading with the section heading rule |
| UX-438 | Restaurant vocabulary reaches shoppers and screen readers | `src/lib/theme/wine/WineHomepage.svelte:106` | Rename the labels and the recent-order fallback to commerce-neutral wording |

### Product listing and filters

The grid itself is dependable, but nearly every control around it breaks a listing rule, from missing filter chips and counts to a sort control no keyboard can reach.

#### UX-054 · Apply in the mobile filter panel double-encodes the query and empties the results
- **Evidence** — `src/lib/components/product-catalogue/mobile-filter.svelte:158` "onclick={filterModule.handleApply}>Apply</Button"; `node_modules/@misiki/kitcommerce-core/dist/composables/use-desktop-filters.svelte.js:161` "url.searchParams.set(key, encodeURIComponent(this.selectedGeneralFilters[key].join(',')));"; `node_modules/@misiki/kitcommerce-core/dist/composables/use-desktop-filters.svelte.js:345` "this.selectedGeneralFilters = { ...this.selectedGeneralFilters, [key]: decodeURIComponent(values || '')?.split(',') };"; screenshot `listing-apply-breaks-search-390.png`.
- **Impact** — A mobile shopper who searches two words, opens the filter panel and taps the primary Apply button loses every result and lands on "No products found". A sorted listing reverts to unsorted order while the toolbar still names the old sort, and the same encoding loop runs behind every desktop facet checkbox.
- **Fix** — Have Apply write only the parameters the panel owns, and pass raw values to the URL API, which percent-encodes on its own. Reuse the existing navigator wrapper in src/lib/components/product-catalogue rather than forking the package.
- **Rule** — 5 Search and product listing, "Result counts accurate and synchronised with filters", with section 1 "Must preserve: URL and query-parameter contracts". **Themes** — all. **Verified** — two reviewers.

#### UX-047 · No active filter chips and no clear all above the grid
- **Evidence** — `src/lib/components/product-catalogue/desktop-filter.svelte:61` "<!-- Applied filters -->"; `src/lib/components/product-catalogue/desktop-filter.svelte:62` "<!-- <div class="flex w-full max-w-56 flex-col flex-wrap intra-gap text-[11px] text-gray-600">"; `src/lib/components/product-catalogue/desktop-filter.svelte:52` "<Button variant="link" size="sm" class="ed-df__clear h-auto p-0" onclick={filterState.clearFilters}>"; `src/lib/components/product-catalogue/listing-page.svelte:35` "<ListingHeader bind:selectedSort />"; screenshots `demo-findings-d8-filtered-1280.png`, `listing-filtered-nochips-1280.png`.
- **Impact** — A shopper who narrows the catalogue gets no summary of what they narrowed it to, because nothing renders between the header and the grid. The only removal control is a small sidebar link that clears everything at once, it sits inside the closed panel on mobile, and a filter whose facet group is absent has no representation to remove at all.
- **Fix** — Render a chip row directly above the grid from the badge or button primitives in src/lib/components/ui, with the close icon already imported in the sidebar and a clear all that calls the existing clear handler. Derive the chips from the URL parameters so a filter with no facet group still appears and stays removable.
- **Rule** — 5 Permanent UX rules > Search and product listing, "Active filters as removable chips above the grid, with 'Clear all'". **Themes** — all. **Verified** — two reviewers.

#### UX-048 · The desktop sort control cannot be operated by keyboard
- **Evidence** — `src/lib/components/product-catalogue/listing-header.svelte:37` "<Select class="!mb-0 ed-lh__select" id="sort-by" value={selectedSort} data={sortOptions} optionSelected={(value: string) => selectSort(value)} />"; `src/lib/components/form/select.svelte:61` "<Popover.Content class="relative z-[1000000000] p-0" align="start">"; `src/lib/components/form/select.svelte:63` "{#if showSearch}"; screenshot `listing-sort-kbd-1280.png`.
- **Impact** — Tab and Enter open the sort popover, but focus lands on a wrapper that never forwards keys, so arrows move nothing and Enter is swallowed. A keyboard-only or switch-device shopper cannot change the sort order on any listing in any theme, and only Escape closes the popup.
- **Fix** — Render sort with the select primitive under src/lib/components/ui/select, keeping the same selection callback, so roving focus and Enter activation come from the primitive. Keep the searchable component only for lists that genuinely need a search field.
- **Rule** — 7 Accessibility and performance, "Visible keyboard focus, logical focus order, dialog focus trapping, Escape-to-close". **Themes** — all. **Verified** — two reviewers.

#### UX-049 · Every query parameter counts as an applied filter, so clear wipes the search
- **Evidence** — `node_modules/@misiki/kitcommerce-core/dist/composables/use-desktop-filters.svelte.js:345` "this.selectedGeneralFilters = { ...this.selectedGeneralFilters, [key]: decodeURIComponent(values || '')?.split(',') };"; `node_modules/@misiki/kitcommerce-core/dist/composables/use-desktop-filters.svelte.js:290` "for (const key of Object.keys(this.selectedGeneralFilters)) { url.searchParams.delete(key); }"; `src/lib/components/product-catalogue/desktop-filter.svelte:51` "{#if filterState.anyFilterApplied}"; `src/lib/components/product-catalogue/mobile-filter.svelte:112` "{Object.keys(filterModule.appliedFiltersCountByKey)"; screenshot `listing-search-emptyrail-1280.png`.
- **Impact** — Sort and page number are filed as facets, so a clear control appears when nothing is filtered and the mobile filter button lists "Page" or "Search" as applied filters. A genuinely active price filter gets no label, and clearing on a searched listing deletes the query and drops the shopper into the full catalogue with no undo.
- **Fix** — Derive applied-filter state from an explicit list of facet keys instead of the whole query string, and never let clear touch search, sort or page. Wrap the shared composable in src/lib/components/product-catalogue, as the repo already does for the page-stripping navigator.
- **Rule** — 5 Search and product listing, "Active filters as removable chips above the grid, with 'Clear all'". **Themes** — all. **Verified** — two reviewers.

#### UX-050 · No sort control exists between 768px and 1023px
- **Evidence** — `src/lib/components/product-catalogue/listing-header.svelte:35` "<div class="ed-lh__sort hidden items-center gap-2 lg:flex">"; `src/lib/components/product-catalogue/mobile-filter.svelte:45` "class="ed-mf__bar fixed bottom-0 left-0 right-0 z-40 grid h-12 w-full grid-cols-2 border-t border-gray-200 bg-white shadow-md md:hidden""; screenshot `listing-products-default-768.png`.
- **Impact** — The header sort block starts at 1024px while the fixed toolbar that carries the mobile sort stops at 768px, so neither renders in between. A shopper on a tablet in portrait, a split-screen laptop or a zoomed desktop can browse and filter but cannot reorder results by any means.
- **Fix** — Show the header sort block from the medium breakpoint up and leave the fixed toolbar where it is. The filter sidebar already appears from that width, so extending the toolbar instead would put a second filter entry point on screen.
- **Rule** — 5 Search and product listing, "Sticky mobile toolbar for Filter and Sort; filters open in a bottom sheet or full-height drawer". **Themes** — all. **Verified** — two reviewers.

#### UX-051 · Filter, sort and page changes give no feedback for about a second, then blur the whole page
- **Evidence** — `src/routes/+layout.svelte:158` "{#await new Promise((resolve) => setTimeout(resolve, 700)) then _}"; `node_modules/@misiki/kitcommerce-core/dist/utils/navigator.js:14` "setTimeout(() => this.resolveURLRequest(), 500);"; `node_modules/@misiki/kitcommerce-core/dist/utils/navigator.js:32` "if (!this.requestResolvers.length) await wait(500);"; `src/lib/components/product-catalogue/listing-grid.svelte:129` "<Skeleton class="h-2 w-20 bg-gray-200 dark:bg-gray-700" />"; screenshot `demo-findings-v2-plp-default-transition-1300ms-1280.png`.
- **Impact** — A price change took 1656ms and a sort choice 713ms before anything moved, with no skeleton, spinner or busy region in that window, so shoppers assume the click missed and click again. The whole page then blurs behind one modal spinner over stale results and a stale count, and on mobile the load-more indicator is two thin grey bars that reserve no space for the row about to arrive. Also reported as UX-199 and UX-203.
- **Fix** — Drive a pending state in the listing grid from the navigation store, mark the grid busy, and render the shared skeleton primitive as card-shaped placeholders at the current column count so every theme gets the state. Reuse the same card skeleton for load more, and scope the delayed full-page overlay to cross-route navigation.
- **Rule** — 6 States and feedback, "Never show a blank page or region while data loads: stable skeletons for first load, subtle progress for later updates". **Themes** — all. **Verified** — browser.

#### UX-053 · Scroll position is discarded when returning to a listing from a product page
- **Evidence** — `src/routes/+layout.svelte:90` "window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })"; `src/routes/+layout.svelte:84` "if (path === landedPath) return"; `src/lib/components/product-catalogue/listing-grid.svelte:38` "const SCROLL_CACHE_KEY = 'listing-infinite-scroll'".
- **Impact** — The layout resets scroll on every path change, back navigation included, overriding the framework's own restoration. A shopper comparing several products returns to the top of the grid every time, and on mobile the cached infinite-scroll pages come back without the shopper's place in them.
- **Fix** — Return early from the reset when the navigation is a history pop, keeping the existing guard for the product page's own URL replacement. Restoration then comes from the framework, and the listing grid's scroll cache finally pays off.
- **Rule** — 5 Permanent UX rules > Global navigation, "Preserve user context when returning from a product page to a list: filters, sort, pagination and scroll position". **Themes** — all. **Verified** — two reviewers.

#### UX-055 · The sort control has no visible focus ring in the default theme
- **Evidence** — `src/lib/components/product-catalogue/listing-header.svelte:104` ":global([data-theme='default'] .ed-lh__select button) {"; `src/lib/components/product-catalogue/listing-header.svelte:116` "box-shadow: none;"; `src/app.css:278` "@apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background;".
- **Impact** — The global focus ring is drawn as a box shadow, and the default theme's sort trigger removes box shadows outright. Tabbing to it computes a transparent outline and no ring, so keyboard users lose their place at the one control they already cannot operate.
- **Fix** — Scope the flat treatment to the resting state, or drop the shadow reset, so the global focus ring survives. No new tokens or utilities are needed.
- **Rule** — 7 Accessibility and performance, "Visible keyboard focus, logical focus order". **Themes** — default. **Verified** — two reviewers.

#### UX-204 · Mobile price sliders have no accessible name, no numeric entry and a 4px track
- **Evidence** — `src/lib/components/product-catalogue/mobile-filter.svelte:283` "bind:value={filterModule.minPrice}"; `src/lib/components/product-catalogue/mobile-filter.svelte:291` "bind:value={filterModule.maxPrice}"; `src/lib/components/product-catalogue/desktop-filter.svelte:312` "aria-label="Choose minimum price""; screenshot `listing-mobile-filter-open-390.png`.
- **Impact** — The desktop sliders carry names and the mobile ones carry none, so a screen-reader user hears two unlabelled sliders and cannot tell which one sets the lower bound. The mobile panel also omits the minimum and maximum number fields the desktop panel offers, so setting a budget on a phone means dragging two overlapping thumbs on a 4px track.
- **Fix** — Copy the desktop labels onto both mobile range inputs and add the same minimum and maximum text inputs the desktop panel uses. Pad the track with a taller transparent hit area so the thumbs reach the 44px mobile target.
- **Rule** — 7 Accessibility and performance, "Pointer targets meet WCAG minimums; about 44px for important mobile actions". **Themes** — all. **Verified** — browser.

#### UX-209 · Sort, filter and pagination all replace history, so back leaves the listing
- **Evidence** — `node_modules/@misiki/kitcommerce-core/dist/utils/index.js:62` "goto(url, { replaceState: true });"; `node_modules/@misiki/kitcommerce-core/dist/composables/use-desktop-filters.svelte.js:168` "this.navigator.goto(url, { replaceState: true });"; `node_modules/@misiki/kitcommerce-core/dist/composables/pagination-renderer.svelte:61` "await goto(url, { replaceState: true, invalidateAll: true })".
- **Impact** — Choosing a sort on the listing and then pressing back returns to the homepage rather than the unsorted listing. Every filter toggle, price change and page change behaves the same way, so the universal undo for a refinement a shopper regrets ejects them from discovery entirely.
- **Fix** — Extend the existing navigator wrapper in src/lib/components/product-catalogue so deliberate refinements push a history entry instead of replacing one. Keep replacement for continuous input such as slider drags, and let the pagination anchors navigate normally.
- **Rule** — 5 Permanent UX rules > Global navigation, "Preserve user context when returning from a product page to a list: filters, sort, pagination and scroll position". **Themes** — all. **Verified** — browser.

#### Medium

- **UX-046 · The shared page title is 20px, so listing headings are half the documented size** — `src/app.css:308`; `src/lib/components/product-catalogue/listing-header.svelte:18`. The listing heading measures 20px on four of five themes against the documented 28 to 40px, so a category page opens with no typographic anchor and the count and sort controls compete with it. Give the shared page-title class a responsive clamp inside the documented band and drop the duplicated breakpoint declaration, which also makes the default theme's own clamp redundant. (organic, lime, noor, wine)
- **UX-052 · Zero-result filter values are neither hidden nor counted** — `node_modules/@misiki/gocommerce-connector/dist/services/index.js:1371`; `src/lib/components/product-catalogue/desktop-filter.svelte:249`. Facets are built from the product set captured before price and tag filtering, so a value that matches nothing under the current selection is still offered at full strength and leads to an empty grid with no explanation. Also reported as UX-195. Skip values whose count is zero unless they are currently selected, keeping selected dead values visible so the shopper can see what emptied the page. (all)
- **UX-190 · The categories index has no empty state** — `src/routes/(www)/categories/+page.svelte:16`. With no categories the page renders its heading over roughly 850px of blank canvas and offers no way forward on a primary discovery route. Add an else branch with muted copy and a button link to the product listing, matching the listing grid's empty state. (all)
- **UX-191 · Sibling discovery routes each use their own content rail and heading size** — `src/routes/(www)/collections/+page.svelte:22`; `src/routes/(www)/categories/+page.svelte:13`; `src/routes/(www)/vendors/+page.svelte:33`. Measured at 1280px these three pages and the product listing use three maximum widths, three gutters and two title sizes, so moving between them shifts the whole page sideways. Put all four on the shared page rail and on one page-title step sized to the documented band. (all)
- **UX-192 · Dark-mode utilities ship with no dark tokens and nothing that enables them** — `tailwind.config.ts:6`; `src/lib/components/product-catalogue/listing-header.svelte:29`. Around 239 dark variants across 28 files are emitted into the stylesheet every shopper downloads, can never match, and would produce a half-dark page if a contributor added the class. Either strip the variants, which are concentrated in nine auth and account files, or define a dark token block per theme and move the variants onto semantic tokens. (all)
- **UX-193 · An out-of-range page number shows the full product count above "No products found"** — `src/lib/components/product-catalogue/listing-header.svelte:30`; `src/lib/components/product-catalogue/listing-grid.svelte:113`. The header prints the query-wide total while the grid prints the empty state for the current page, and the pagination lives in the other branch so it vanishes exactly when it is needed. Split the empty state in two, and when the count is above zero say the page is past the last one and render the existing pagination plus a link to the first page. (all)
- **UX-194 · Below 1024px there is no backward pagination and no page indicator** — `src/lib/components/product-catalogue/listing-grid.svelte:150`. Phones and tablets get a forward-only load more, so a shared or indexed link to a deep page opens in the middle of the catalogue with no previous control and nothing above it. Render the existing pagination component below the large breakpoint too, keeping infinite scroll as the forward path. (all)
- **UX-196 · Facet checkbox ids ignore the group, so shared values collide** — `src/lib/components/product-catalogue/desktop-filter.svelte:362`; `src/lib/components/product-catalogue/desktop-filter.svelte:396`. Two groups that share a value such as "Black" or "M" emit the same id in one document, so a label can tick another group's checkbox and assistive technology reads the wrong association. Include the group key in the id and slugify the value, or take a per-instance id the way the text input component already does. (all)
- **UX-197 · Desktop filter groups never collapse and their headings carry no semantics** — `src/lib/components/product-catalogue/desktop-filter.svelte:352`. Every group renders permanently expanded in one unbroken column, so lower-priority groups fall below the fold and keyboard and screen-reader users get no way to skip a group. Wrap each group in the existing collapsible primitive with a real button trigger, leaving the first few open by default. (all)
- **UX-198 · Facet counts arrive in the payload and are thrown away before render** — `node_modules/@misiki/kitcommerce-core/dist/composables/use-desktop-filters.svelte.js:99`; `src/lib/components/product-catalogue/desktop-filter.svelte:161`; `src/lib/components/product-catalogue/mobile-filter.svelte:316`. Shoppers pick filters blind because no value shows how many products sit behind it, even though the connector supplies a count for every category and tag. Also reported as UX-200. Read the counts already on the page and render them as muted supporting text beside each value in both filter panels. (all)
- **UX-201 · The sort control is built on a searchable command popover instead of the select primitive** — `src/lib/components/form/select.svelte:49`; `src/lib/components/form/select.svelte:61`; `src/lib/components/ui/select/index.ts:14`. The control announces itself as "Open Select Options" rather than its current value, its popup outranks every other layer on the page, and the design system's own select has no call sites at all. Use the select primitive for plain option lists with a visible associated label, and keep the searchable component for lists that need search. (all)
- **UX-202 · Two themes bypass the shared image component** — `src/lib/theme/noor/NoorProductCard.svelte:33`; `src/lib/theme/lime/ui/ll-image.svelte:25`. Noor cards use a raw image tag with no responsive candidates, no loading placeholder and no error state, while lime always fetches the largest render and lazy-loads the first row. Use the shared image component in the noor card and forward the size hint and priority flag through the card wrapper to both themes. (lime, noor)
- **UX-205 · The pager caps navigation at 50 pages but prints the uncapped total** — `src/lib/components/common/pagination.svelte:20`; `src/lib/components/common/pagination.svelte:105`; `src/lib/components/common/pagination.svelte:122`. On a catalogue over 50 pages a shopper reads "Page 50 / 73" with next disabled, which reads as a broken store on the one component six routes share. Print the capped total in both labels and swap the fixed grey utilities for the semantic text and border tokens. (all)
- **UX-206 · Card titles clamp to two lines on two themes and category names are cut at 24 characters** — `src/lib/theme/default/DefaultProductCard.svelte:276`; `src/lib/theme/lime/LimeProductCard.svelte:156`; `src/lib/components/product-catalogue/desktop-filter.svelte:33`. In a category of near-identical products the differentiating tail of the name is hidden on a phone, and a long category name in the filter rail is truncated even when the column has room for it. Also reported as UX-441. Clamp titles to three lines below the medium breakpoint, surface the differentiating attribute on its own line, and delete the fixed-character truncation so the existing overflow rules handle it. (all)
- **UX-207 · The price slider misdraws when the URL range falls outside the facet range** — `src/lib/components/product-catalogue/desktop-filter.svelte:304`; `src/lib/components/product-catalogue/mobile-filter.svelte:276`. On a link whose range the catalogue no longer contains, the fill is drawn far off the track and both thumbs stack at one end while the number fields still show the requested bounds. Clamp the values and the two percentages in both filter components before they reach the style attribute, and feed the same clamped values to the number fields. (all)
- **UX-210 · The sticky filter rail ships invalid inline styles and freezes its height at mount** — `src/lib/components/product-catalogue/desktop-filter.svelte:39`; `src/lib/components/product-catalogue/desktop-filter.svelte:46`. The server sends an undefined offset and an invalid height, and after hydration the height is measured once, so shrinking the viewport leaves the panel extending past the fold with its lower filters unreachable. Express the rail in CSS with a maximum height derived from the viewport, and make the scrollbar visible when the list overflows using the scrollbar plugin already installed. (all)
- **UX-211 · The card's size hint matches none of its grids, and responsive images depend on a plugin** — `src/lib/components/product-catalogue/product-card.svelte:71`; `src/lib/core/components/image/lazy-img.svelte:176`. Tablets receive a candidate about 30% too small on the listing while the featured grid over-fetches, and on stores without the image CDN plugin no candidates are emitted at all. Pass the size hint from the grid that owns the column count, and emit the same candidates in the non-CDN branch of the image component. (all)
- **UX-212 · The collection page is a second-class listing** — `src/routes/(www)/collections/[slug]/+page.svelte:36`; `src/lib/components/product-catalogue/listing-scehma.svelte:19`. Shoppers arriving from the homepage rails get a bare four-column grid on its own content rail, with no sort, pagination, breadcrumb or list structured data. Put the page on the shared rail at the listing's column count, emit the list markup through the schema component's existing products prop, and page long payloads with the existing pagination component. (all)
- **UX-213 · The sort controls do not reflect the current sort after navigation** — `src/lib/components/product-catalogue/listing-page.svelte:11`; `src/lib/components/product-catalogue/mobile-filter.svelte:81`. The desktop trigger keeps naming the old sort after the URL changes, and the mobile sort drawer shows all four options unchecked, so only a colour change hints at the current choice. Derive the sort from the URL and pass it down as a plain prop, and rebuild the drawer options on the existing radio group primitive. (all)
- **UX-214 · The filter panel is wider than its column and is clipped between 768px and about 896px** — `src/lib/components/product-catalogue/listing-page.svelte:21`; `src/lib/components/product-catalogue/desktop-filter.svelte:43`. At 768px the maximum price field and the right slider thumb run under the product grid, so tablet shoppers cannot read or reliably hit the upper price bound. Give the sidebar a real column width instead of a percentage cap, so the column and the panel inside it share one width. (all)
- **UX-215 · The empty listing never names the search or filters that emptied it** — `src/lib/components/product-catalogue/listing-grid.svelte:115`; `src/lib/components/product-catalogue/listing-grid.svelte:116`. A no-match search offers "Clear all filters" although no filter is set, and on a category listing the same fixed link leaves the category for the whole catalogue. Build the recovery action from the current URL, keep the path, and word it after what will actually be removed, with the full catalogue as the last resort. (all)
- **UX-216 · The mobile sort sheet has no close control** — `src/lib/components/product-catalogue/mobile-filter.svelte:60`. The sheet can only be dismissed by dragging an unlabelled handle or tapping the dimmed area, while every other drawer in the app shows an explicit close. Add the same drawer close the promo code and size guide drawers use, sized to the 44px target. (all)
- **UX-217 · Two hand-rolled breadcrumbs coexist with an unused breadcrumb primitive** — `src/lib/components/ui/breadcrumb.svelte:30`; `src/lib/components/ui/breadcrumb-route.svelte:84`; `src/lib/components/ui/breadcrumb/index.ts:9`. Listing and account pages render differently styled trails, the current page is a live link with no current-page cue, and the catalogue trail applies its truncation to the wrong crumb. Rebuild on the existing breadcrumb primitives so the last crumb carries the current-page semantics and both surfaces share one component. (all)
- **UX-218 · Variant option values render uncapped, so many sizes become a wall of pills** — `src/routes/(www)/products/[slug]/components/product-variation.svelte:35`; `src/routes/(www)/products/[slug]/components/product-aggregation.svelte:28`. Twenty-five sizes grow the option block from 44px to 268px at 390px, filling the fold and pushing the second option, the price and the buy button below it. Cap the row with the same "+N more" disclosure the filter sidebar already uses, and switch large numeric option sets to the existing select or popover primitive. (all)

#### Low

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-440 | "You've reached the end" appears on listings that only ever had one page | `src/lib/components/product-catalogue/listing-grid.svelte:147` | Gate the line on the shopper having actually loaded a further page. |
| UX-442 | Three bottom-anchored fixed layers pick their own z-index and two share one level, so an enabled assistant overlaps the filter toolbar | `src/lib/components/product-catalogue/mobile-filter.svelte:45`; `src/lib/components/chat/conversational-shopping.svelte:171` | Route them through the named z-index scale the rulebook already asks for, and give the family one shared bottom-offset property. |

### Product card

Four card implementations sit behind one wrapper, and they disagree on media, name size, price accuracy and interaction state.

#### UX-058 · Review count is rendered as the star rating

- **Evidence** — `src/lib/components/product-catalogue/product-card.svelte:91` "{product.rating || (Array.isArray(product.ratings) ? product.ratings.length : product.ratings)}"; `src/lib/theme/default/DefaultProductCard.svelte:64` the same expression inside the star badge; `src/lib/theme/lime/LimeProductCard.svelte:27-32` passes that length to the rating primitive as its value; `src/lib/theme/lime/ui/ll-rating.svelte:27` "Rated {value} out of 5"; `src/lib/theme/lime/ui/ll-rating.svelte:35` "{#if count != null}" is an unused count slot; the product page averages correctly at `src/routes/(www)/products/[slug]/components/product-title-section.svelte:16-17` "const total = product.ratings.reduce((acc, cur) => acc + (cur?.rating || 0), 0)".
- **Impact** — When a backend returns ratings as an array of reviews, every card prints the number of reviews where the score belongs. A product with twelve reviews paints five filled stars on lime and announces "Rated 12 out of 5" to screen readers.
- **Fix** — Derive score and count in one shared helper, averaging the review scores for the number, and pass the count to the rating primitive's existing count prop. Hide the widget when there is no numeric score.
- **Rule** — Section 10 Definition of done, "Product data, counts, prices, variants, totals and availability are consistent". **Themes** — default, wine, organic, lime. **Verified** — code.

#### UX-059 · Cards with no image collapse to a strip of text

- **Evidence** — `src/lib/theme/noor/NoorProductCard.svelte:32` "{#if image}" with no else branch; `src/lib/theme/noor/NoorProductCard.svelte:115` "aspect-ratio: var(--noor-media-ratio, 3 / 4);" sits on the image, not on its container; `src/lib/components/product-catalogue/product-card.svelte:66` "<figure title={product.name} data-testid="product-card-image-container" class="relative">" reserves no ratio; `src/lib/core/components/image/empty-image.svelte:5` "h-full w-full bg-gray-100 dark:bg-gray-800" is full height inside an auto-height parent; `src/lib/theme/default/DefaultProductCard.svelte:37` and `src/lib/theme/lime/ui/ll-image.svelte:23` do reserve the box. Screenshot consistency-dedup-noor-plp-1280.png.
- **Impact** — On noor, wine and organic a product with no thumbnail renders as a 52 to 56px strip of title and price in an otherwise empty viewport. Rows go ragged and the grid jumps as neighbouring images arrive, so the same catalogue is browsable on two themes and not on three.
- **Fix** — Move the media frame into one shared card media primitive under src/lib/components/product-catalogue that reserves the store ratio on the container and renders the empty-image placeholder inside it. Repaint that placeholder with bg-muted instead of the hard-coded greys.
- **Rule** — Section 5 Search and product listing, "Reserve image dimensions and show skeletons to prevent layout shift". **Themes** — noor, wine, organic. **Verified** — browser.

#### UX-056 · A failed image shows a broken glyph or pulses forever

- **Evidence** — `src/lib/core/components/image/lazy-img.svelte:111` "{#if (!loaded || error) && !priority}"; `src/lib/core/components/image/lazy-img.svelte:160-161` "class:opacity-0={!(loaded || priority)}" and "class:opacity-100={loaded || priority}"; `src/lib/core/components/image/lazy-img.svelte:181` "onerror={(ev) => {" sets a flag nothing renders; `src/lib/theme/noor/NoorProductCard.svelte:33` "<img src={image} alt={title} loading="lazy" />" has no error handler at all. Screenshot product-card-r2-wine-1280.png.
- **Impact** — The listing marks the first six cards priority, so a 404 there shows the browser's broken-image icon and the raw alt string where the photo belongs. Cards below the fold keep the grey pulse running instead, so the page looks permanently stuck loading.
- **Fix** — Give the shared image component an error branch that stops the pulse and renders the empty surface at the reserved size, priority images included, and route the noor card through it. Use the ui/skeleton primitive for the loading half.
- **Rule** — Section 6 States and feedback, "Every component defines: default, hover, active/pressed, focus-visible, disabled, loading, empty, error, success". **Themes** — all. **Verified** — two reviewers.

#### UX-057 · Card controls are 28 to 40px on mobile

- **Evidence** — `src/lib/theme/default/DefaultProductCard.svelte:219` "width: 34px;" and `:357` "width: 32px;"; `src/lib/theme/lime/LimeProductCard.svelte:111` "width: 34px;"; `src/lib/theme/noor/NoorProductCard.svelte:143` "width: 34px;" and `:222` "padding: 11px 12px;"; `src/lib/components/product-catalogue/product-card.svelte:111` "h-auto w-auto rounded-full bg-card/80 p-1.5 shadow-sm backdrop-blur-sm hover:bg-card" and `:171` "class="w-full py-5"" on a fixed-height button; `src/lib/theme/lime/ui/ll-button.svelte:67` "padding: 11px 22px;". Screenshot product-card-lime-home-card-mobile.png.
- **Impact** — At 390px the wishlist button is 34px on three themes and about 28px on the shared card, the quantity stepper is 32px and the add-to-cart controls are 36 to 40px. These targets overlay a full-card link, so a thumb aiming for the heart routinely opens the product page instead. Also reported as UX-444.
- **Fix** — Give the icon buttons a 44px hit area below the md breakpoint while keeping the 34px visual, and take card CTAs from the ui/button size scale rather than padding a fixed height. Leave the 36 to 40px desktop sizing alone.
- **Rule** — Section 4 Density rules, "Mobile interactive controls are normally at least 44px high", with section 7, "about 44px for important mobile actions". **Themes** — all. **Verified** — code.

#### UX-060 · The product gallery renders nothing when a product has no media

- **Evidence** — `src/routes/(www)/products/[slug]/components/product-gallery-section.svelte:50` "{#if productState.productImagesArray?.length > 0}" with no else branch; `src/routes/(www)/products/[slug]/components/product-gallery.svelte:66` "const isVideoURL = (x: string) => videoURLRegex.test(x)" shows the gallery only ever renders an image, a video or a YouTube frame; every card surface already has a placeholder, for example `src/lib/theme/default/DefaultProductCard.svelte:47` "<EmptyImage class="dpc__img" />".
- **Impact** — A product with an empty media list leaves the whole gallery column blank, which on a wide screen is half the purchasing page. The related claim about missing 3D and AR fallbacks does not apply, because nothing in this storefront uses WebGL.
- **Fix** — Add an else branch that renders the existing empty-image component inside the same aspect-ratio box the gallery uses, matching the cards, the vendor card and the categories page.
- **Rule** — Section 5 Product page, "Zoomable images and an accessible non-WebGL fallback for 3D/AR media", read with section 6 on empty states. **Themes** — all. **Verified** — code.

#### UX-221 · The product name is set as supporting text and loses to the price

- **Evidence** — `src/lib/components/product-catalogue/product-card.svelte:133` "class="block w-[80%] text-xs text-muted-foreground lg:text-sm"" against the price at `:139` "class="text-sm font-semibold text-foreground""; `src/lib/theme/lime/LimeProductCard.svelte:151` "font-size: 16px;" undone at `:161-163` "@media (max-width: 900px)" … "font-size: 12px;"; `src/lib/theme/noor/NoorProductCard.svelte:191` "font-size: 13px;" with `:195` "text-transform: uppercase;". Measured live: lime title 12px at 390px while its price stays 16px, organic title 12px in rgb(115,115,115) against a 14px semibold price in rgb(34,34,34). Screenshot product-card-r2-lime-390.png.
- **Impact** — On the viewport most shoppers use, the product name is 12px and muted while the price is larger and darker. The rulebook reserves 12 to 14px for supporting text, so the first thing a card must communicate is styled as a caption on four of five themes.
- **Fix** — Use text-sm and text-foreground for the name on the shared card and drop the arbitrary 80% width, remove the lime mobile override so its title stays at 16px, and raise the noor title to 14px. Let weight carry the price emphasis.
- **Rule** — Section 4 Type scale, "Body: 14–16px" and "Supporting text: 12–14px, never low-contrast merely to appear elegant". **Themes** — wine, organic, lime, noor. **Verified** — browser.

#### UX-222 · Cards show one price for products whose variants cost different amounts

- **Evidence** — `src/lib/components/product-catalogue/product-card.svelte:139`; `src/lib/theme/default/DefaultProductCard.svelte:96`; `src/lib/theme/lime/ui/ll-price.svelte:27` "<span class="ll-price-now">{formatPrice(price, currencyCode)}</span>"; `src/lib/theme/noor/NoorProductCard.svelte:61`; the connector sets the listing price to the cheapest variant at `node_modules/@misiki/gocommerce-connector/dist/index.js:577` "const price = prices.length ? Math.min(...prices) : 0;" while still passing the full variant list to the card. Screenshots product-card-default-1280.png and product-card-lime-1280.png.
- **Impact** — The test store's gift card sells at $25 or $50 and every theme's card reads a flat $25.00. A shopper who picks the higher value on the product page sees the price double with no warning from the listing.
- **Fix** — Compute the minimum and maximum from the variant prices already on the product, and render a "From" prefix in the same price style when they differ. Keep the existing price formatter and store currency, and hold the prefix as store-editable microcopy the way lime and noor handle their labels.
- **Rule** — Section 10 Definition of done, "Product data, counts, prices, variants, totals and availability are consistent", with section 5, "Product cards prioritise image, product name, price". **Themes** — all. **Verified** — browser.

#### Medium

- **UX-219 · Priority is not forwarded to the lime and noor cards** — `src/lib/components/product-catalogue/product-card.svelte:43,45`; `src/lib/core/components/image/lazy-img.svelte:126`. Lime's first row emits no image during server rendering and starts loading only after hydration, and noor's raw image skips the CDN resizer to fetch a full-size original for a thumbnail. Forward the prop in both branches and render noor's image through the shared image component. (lime, noor)
- **UX-220 · Cards hard-code colour literals instead of the tokens** — `src/lib/theme/default/DefaultProductCard.svelte:223,309`; `src/lib/components/product-catalogue/product-card.svelte:99,120`; `src/lib/theme/noor/NoorProductCard.svelte:129,208`; `src/lib/core/components/image/empty-image.svelte:5`. The saved-wishlist colour looks like four unrelated things across the shipped themes, and a merchant who re-themes gets cards that only partly follow the brand. Map each literal onto the existing semantic token or the theme's own variable, and give the placeholder surfaces bg-muted. (all)
- **UX-223 · The default card reveals its wishlist button on hover only** — `src/lib/theme/default/DefaultProductCard.svelte:226,234`. Touch devices have no hover, so a phone shopper on the default theme never sees the heart and can only save from the product page. Keep the control visible under a hover-none media query, as the other theme cards already do for their add-to-cart control. (default)
- **UX-224 · The shared card clips its own focus ring** — `src/lib/components/product-catalogue/product-card.svelte:54,132`. A keyboard user reaching the title link sees the ring cut off left and right by the card's overflow rule, and on phones that link is only 16px tall. Clip the media box rather than the card root, and make the title link block-level with a 44px minimum height on mobile. (wine, organic)
- **UX-225 · Quick add disables every card in the grid at once** — `src/lib/components/product-catalogue/product-card.svelte:156,171-172`; `src/lib/theme/default/DefaultProductCard.svelte:126`. Adding one product greys out and shows loading dots on every other card in a featured grid, and the shared card's plus and minus buttons have no accessible name. Bind the buttons to the per-card loading flag the renderer already exposes and label the stepper as the default card does. (default, wine, organic)
- **UX-226 · The wrapper's prop contract is incomplete** — `src/lib/components/product-catalogue/product-card.svelte:19,26,30`; `src/lib/theme/sections/product-grid.svelte:31`. Store-editable microcopy passed in by the section library is dropped, so merchants can never change the card labels, and the discount is a plain constant rather than derived, so a reused card keeps the previous product's percentage. Declare and forward the theme content, make the discount derived, and delete the unused category derivation. (all)
- **UX-227 · The default card ignores the store's image ratio on the listing** — `src/lib/theme/default/DefaultProductCard.svelte:37`; `src/lib/components/product-catalogue/listing-grid.svelte:121`. The same product appears in a 2:3 frame on the homepage and a square one on the listing, because the card falls through to a literal instead of the store setting. Default the ratio from the store, matching the lime and noor cards. (default, wine)
- **UX-228 · The default theme never overrides the card surface token** — `src/app.css:26-27` and the theme block at `:77`. Every card surface on the default theme renders grey on a white page with pure black text, including the wishlist page, related products and the modal shell. Declare the card and popover colour pairs in every theme block, as organic, lime and noor already do. (default)
- **UX-229 · The visible product name has no fallback and no heading** — `src/lib/theme/default/DefaultProductCard.svelte:92`; `src/lib/components/product-catalogue/product-card.svelte:51,70,134`. A backend that supplies name rather than title leaves these cards showing an image and a price with no name, and screen-reader users cannot move card to card by heading because both use a span inside an unnamed region. Resolve the display name once and reuse it for the text, tooltip, alt and label, and give every card an article root with a heading. Also reported as UX-445. (default, wine, organic)
- **UX-230 · Title truncation differs on all four cards** — `src/lib/theme/default/DefaultProductCard.svelte:276`; `src/lib/theme/lime/LimeProductCard.svelte:156`; `src/lib/components/product-catalogue/product-card.svelte:132-133`; `src/lib/theme/noor/NoorProductCard.svelte:59,187`. A long name is clamped to two lines on default and lime, hiding the part that distinguishes similar products, and left unclamped elsewhere, where a noor card grows from 56 to 150px and prices stop lining up. Apply one clamp through a shared utility with the full name in the title attribute, and hold the price on a fixed row position. Also reported as UX-231. (all)
- **UX-232 · The wishlist button exposes no saved or loading state** — `src/lib/theme/default/DefaultProductCard.svelte:73`; `src/lib/components/product-catalogue/product-card.svelte:124`. A screen-reader user hears "Toggle wishlist" whether or not the product is already saved, and the button stays live during the round trip so a double tap fires two toggles. Adopt the state-reflecting label lime and noor already use, and pass the existing loading flag to the button's disabled and busy attributes. Also reported as UX-233. (all)
- **UX-446 · Every card exposes two links to the same product under two names** — `src/lib/theme/default/DefaultProductCard.svelte:31,91`; `src/lib/components/product-catalogue/product-card.svelte:60,132`; `src/lib/theme/lime/LimeProductCard.svelte:44,68`; `src/lib/theme/noor/NoorProductCard.svelte:31,58`. A keyboard shopper pays two tab stops per product and a screen-reader link list reads each product twice under different names, and the wishlist button sits inside the anchor, which is invalid nesting the click handlers have to undo. Wrap media and body in one anchor and move the wishlist control out to the card root as a sibling. Also reported as UX-449. (all)
- **UX-448 · The discount percentage is hidden below 768px on the shared card** — `src/lib/components/product-catalogue/product-card.svelte:146` "hidden text-xs font-bold uppercase text-success md:block". Wine and organic suppress the strongest conversion signal a card carries on exactly the viewport where most shoppers browse. Drop the hidden and md:block pair so the percentage shows at every breakpoint, as the default card already does. (wine, organic)

#### Low

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-443 | A genuinely free product reads as "Price on request" on the noor card | `src/lib/theme/noor/NoorProductCard.svelte:61` | Test for presence rather than truthiness so a zero price formats like any other |

### Product detail page

The product page is the weakest route in the storefront: variant selection is broken from the pill to the cart payload, and the buy box states neither availability, delivery nor returns.

#### UX-002 · Picking a variant changes only the URL, and the wrong item reaches the cart
- **Evidence** — `src/routes/(www)/products/[slug]/components/product-variation.svelte:62` "onclick={() => productState.selectVariant({ option, value: v })}"; `node_modules/@misiki/kitcommerce-core/dist/composables/product/use-product.svelte.js:188` "variants.find((v) => v.id === variantId) || page.data?.product?.variants[0]"; same file `:376` "afterNavigate(async () => { … await this.mount(); })"; `node_modules/@misiki/gocommerce-connector/dist/index.js:521` "id: variant.id"; screenshot `pdp-v2-variant-reset-1280.png`.
- **Impact** — A shopper on the cotton tee taps M and the pills, heading and SKU show M for about one second, then revert to S on their own. The URL says one variant while the page describes another, deep links to a variant render the first variant, and the add-to-bag request sends variant 1 whatever the shopper chose. Every click also costs a full page navigation and three product fetches. Also reported as UX-004.
- **Fix** — Normalise variant and option-value ids to strings in the in-repo connector override under `src/lib/core/connectors`, and push the string comparison upstream into the core composable. Mirror the selection into the URL with `replaceState` so the load function does not re-run, keeping the existing deep-link contract and test hooks.
- **Rule** — 5 Permanent UX rules, Product page, "Update price, media, SKU and availability together when variants change". **Themes** — all. **Verified** — browser.

#### UX-003 · The page heading is the variant title, not the product name
- **Evidence** — `src/routes/(www)/products/[slug]/components/product-title-section.svelte:31` "{productState.title || product.title}"; `node_modules/@misiki/kitcommerce-core/dist/composables/product/use-product.svelte.js:95` "if (this.selectedVariant?.title && this.selectedVariant?.title !== 'default') return this.selectedVariant.title"; screenshot `pdp-d3-tee-1440.png`.
- **Impact** — The server sends the correct name and the client replaces it about a second later, so the tee page reads "S / Black" and the gift card page reads "25" directly above "$25.00". The product name then appears nowhere in the page body, only in the browser tab, so a shopper arriving from a listing or a search result cannot confirm which product they opened. Screen reader users hear the variant string as the page heading, and the visible page contradicts the indexed one.
- **Fix** — Keep the product name as the heading and render the selected variant in the selection line the variant component already draws, styled with the existing muted subtitle treatment so the server and client agree.
- **Rule** — 5 Permanent UX rules, Product page, "Name, price, selected variant, availability, delivery/returns summary and primary CTA visible without unnecessary scrolling". **Themes** — all. **Verified** — two reviewers.

#### UX-061 · "Inclusive of all taxes" is printed next to every price without checking the store
- **Evidence** — `src/routes/(www)/products/[slug]/components/product-pricing.svelte:34` "<span class="w-fit text-sm font-medium text-900 ml-1 edp-tax">Inclusive of all taxes</span>"; `src/lib/core/connectors/default-store.json:137` ""includesTax": false"; screenshot `pdp-v2-enamel-mug-default-390.png`.
- **Impact** — Every shopper on every store is told the displayed price is tax inclusive, although this store's currency is configured the other way. No cart or checkout surface in the codebase shows a tax line, so the claim can be neither confirmed nor corrected later in the flow. The note is also unstyled outside the default theme, where it renders as plain black text beside the price.
- **Fix** — Gate the note on the store currency flag already present in page data, render nothing when it is false, and style it with `text-muted-foreground` instead of the dead `text-900` class.
- **Rule** — 1 Project context, "Primary locale/currency: store-driven at runtime… Never hard-code either". **Themes** — all. **Verified** — browser.

#### UX-062 · Add to bag has no loading or success state, and stops adding for five seconds
- **Evidence** — `src/routes/(www)/products/[slug]/components/product-cart-and-wishlist-buttons.svelte:103` "cartState?.addToCartMessage == 'Added to cart' ? 'bg-green-600 hover:bg-green-700' : ''"; same file `:19` "if (productState.cartState?.showCheckout) productState.cartState.isOpen = true else productState.handleAddToCart()"; same file `:55` "class="fixed hidden md:block right-4 top-24 …""; `node_modules/@misiki/kitcommerce-core/dist/stores/cart.svelte.js:137` "this.showCheckout = true; setTimeout(() => { … this.showCheckout = false; }, 5000)"; screenshots `pdp-v2-atc-1280.png`, `pdp-v2-mobile-atc.png`.
- **Impact** — The button dims for about 1.5 seconds with the same label and no spinner, so shoppers double tap or assume the add failed. The success styling keys off a message the cart store never sets, so it never appears. Phones get no confirmation at all because the confirmation card is desktop only. For five seconds afterwards the label reads "Go to bag" and the button opens the drawer instead of adding, so a shopper who immediately picks a second size adds nothing. Also reported as UX-251.
- **Fix** — Drive the button from the cart state: a spinner with "Adding" and `aria-busy` while the request runs, a brief confirmation using the `--success` token instead of a literal green, then back to "Add to bag" so the primary action never changes identity. Use the sonner toast already loaded for the mobile confirmation, and give the confirmation thumbnail real alt text.
- **Rule** — 6 States and feedback, "Every component defines… loading… success", and 5 Permanent UX rules, Cart and checkout, "One unmistakable checkout CTA; no competing primary buttons". **Themes** — all. **Verified** — browser.

#### UX-063 · The buy box states no availability, no delivery estimate and no returns summary
- **Evidence** — `src/routes/(www)/products/[slug]/components/product-details.svelte:33` "const showPincodeCheck = $derived(productState.wareHousePluginEnabled && productState.isIndianPincodesPluginEnabled)"; same file `:290` "<!-- Fallback delivery estimate when plugin is not enabled -->"; same file `:333` "<!-- Fallback return policy when plugin is not configured -->"; `src/routes/(www)/products/[slug]/components/product-cart-and-wishlist-buttons.svelte:111` the out-of-stock condition; screenshot `pdp-v2-cotton-tee-default-1280.png`.
- **Impact** — Measured page text on all three products runs from the price and variant pills straight to the button and then to the specifications, with no stock statement, ship-by estimate or returns line. Delivery needs two India-specific plugins active together and returns needs the returns plugin, and both fallbacks are commented out, so a default store shows neither. The only availability signal is the button label, which is additionally suppressed while the page is loading, so a sold-out item reads "Add to bag". Nothing tells a shopper that one size has three left and another is gone. Also reported as UX-068.
- **Fix** — Add a persistent availability line under the price driven by the selected variant, built on the `ui/badge` primitive with the `--success` and `--destructive` tokens, and move the loading check out of the button label into a skeleton state. Drive delivery and returns from store settings or link the existing policy routes rather than restoring the commented-out hard-coded rupee copy.
- **Rule** — 5 Permanent UX rules, Product page, "Name, price, selected variant, availability, delivery/returns summary and primary CTA visible without unnecessary scrolling". **Themes** — all. **Verified** — two reviewers.

#### UX-064 · Choosing one option silently changes the other, and impossible combinations are never marked
- **Evidence** — `node_modules/@misiki/kitcommerce-core/dist/logic/variants.helper.js:24` "if (!v) { v = variants.find((variant) => … option.value === value); }"; `node_modules/@misiki/kitcommerce-core/dist/composables/product/use-product.svelte.js:103` "refreshOptions … _value.selectable = true;"; `src/routes/(www)/products/[slug]/components/product-variation.svelte:46` "{!v?.selectable ? 'opacity-40' : ''}"; same file `:50` "<div class="h-full w-full rounded-full" style="background-color: {v.value}"></div>"; same file `:51` "<span class="sr-only">{v.value}</span>".
- **Impact** — With small and black selected, tapping white jumps the selection to medium and white with no message, because that combination does not exist. On first render every value is marked selectable, so nothing warns the shopper before the tap. Unavailable colour swatches are only faded and still fire a selection. The swatch paints the raw option value as a CSS colour, so a catalogue storing "Rose Gold" or "Navy" renders blank circles whose only label is screen reader text and a tooltip. Also reported as UX-237.
- **Fix** — Compute selectability against the current selection on load, render unavailable values in one shared unavailable style, and disable rather than fade them. Read the swatch fill from an explicit colour field and fall back to the same text pill used for other options, with the name shown through the existing tooltip primitive.
- **Rule** — 5 Permanent UX rules, Product page, "Variant selection unambiguous: selected, available, unavailable, loading and error states look different". **Themes** — all. **Verified** — code.

#### UX-065 · Keyboard focus is thrown to the page body every time a variant is picked
- **Evidence** — `src/routes/(www)/products/[slug]/components/product-variation.svelte:11` "{#key productState.productOptions}"; `node_modules/@misiki/kitcommerce-core/dist/composables/product/use-product.svelte.js:207` "this.productOptions = page.data.product.options.map((option) => {"; probe log `pdp-v2-interact.log` "after Enter on M (700ms): focus= {"tag":"body"}".
- **Impact** — A keyboard or switch user tabs fourteen stops to reach the size pills, presses Enter, and the activated button is destroyed along with the whole option group. Focus lands on the body, so they must tab through the header again for the next option and again to reach the button. Screen readers announce nothing about the new selection because the focused node no longer exists.
- **Fix** — Remove the key block. The pills already read their pressed and disabled state reactively, so a keyed each block updates in place and keeps focus. If the option array must be replaced, restore focus to the pill carrying the same option and value.
- **Rule** — 7 Accessibility and performance, "Visible keyboard focus, logical focus order". **Themes** — all. **Verified** — browser.

#### UX-066 · The sticky mobile add-to-cart bar is the only mobile CTA, so it is pinned from first paint
- **Evidence** — `src/routes/(www)/products/[slug]/components/product-details.svelte:275` "<div class="intra-gap hidden flex-col sm:flex mt-2">"; same file `:365` "class="sticky inset-x-0 bottom-0 … bg-white/95 p-page shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] backdrop-blur-md sm:hidden edp-mobilebar""; screenshot `pdp-v2-mobile-560-sticky.png`.
- **Impact** — The in-flow button is hidden below 640px and measures zero by zero, so the bar is the only way to add to the cart and there is no primary CTA for it to appear after. It covers about 12 percent of a small viewport from the moment the page opens, and the description is read through it. Because it sticks to the last flow element rather than a fixed layer, it renders mid-screen on short pages with blank space beneath, and it scrolls out of view entirely at the bottom of the page. Also reported as UX-067.
- **Fix** — Render the existing cart button component in flow under the variant pills at every width, then reveal the bar with an intersection observer once that button leaves the viewport, with matching page padding. Replace the arbitrary shadow and white background with `shadow-z-2`, `bg-background` and the border token.
- **Rule** — 5 Permanent UX rules, Product page, "Sticky mobile Add to Cart bar only after the primary CTA scrolls out of view". **Themes** — all. **Verified** — two reviewers.

#### UX-069 · The product title renders at body size on four of the five themes
- **Evidence** — `src/routes/(www)/products/[slug]/components/product-title-section.svelte:30` "<h1 class="text-md flex-1 font-medium tracking-tight text-gray-900 dark:text-white sm:text-xl leading-[1] edp-title">"; same file `:105` ":global([data-theme='default'] .edp-title) { … font-size: clamp(1.55rem, 2.6vw, 2.3rem); }"; screenshot `sv-dg-015-lime-pdp-390.png`.
- **Impact** — Tailwind has no `text-md` class, and the only rule that supplies a real title size is scoped to the default theme. On wine, organic, lime and noor the title measures 16px on mobile and 20px on desktop, smaller than the price and the same size as the specifications label. The most important element on the page scans as metadata.
- **Fix** — Replace the invalid class pair with a real step from the scale that lands in the documented 28 to 40px page-title band, and keep the default theme rule for its serif treatment only.
- **Rule** — 4 Implementation architecture, Type scale, "Page title: 28–40px depending on viewport". **Themes** — wine, organic, lime, noor. **Verified** — two reviewers.

#### UX-070 · The selected variant pill is an empty box on four of the five themes
- **Evidence** — `src/routes/(www)/products/[slug]/components/product-variation.svelte:58` "class="edp-pill min-w-[3.5rem] !bg-primary px-4 py-2 { … ? 'edp-on border !border-accent !bg-transparent' : '!bg-accent text-accent-foreground'}""; `src/routes/(www)/products/[slug]/components/product-aggregation.svelte:32` same class stack; screenshots `pdp-v2-pills-lime-1280.png`, `pdp-v2-cotton-tee-noor-390.png`, `pdp-v2-cotton-tee-wine-1280.png`.
- **Impact** — On wine, organic, lime and noor the selected pill computes to white text on a transparent background, measured at 1.0 to 1.07 to one against the page. The chosen size and colour are unreadable while the values the shopper did not choose are solid blocks, so the affordance is inverted. Unselected pills fail the contrast threshold too on organic.
- **Fix** — Drop the competing background overrides and express the four states with tokens in one shared class set used by both option surfaces: bordered background for unselected, `bg-primary` with `text-primary-foreground` for selected, a border change on hover, and reduced opacity with `disabled` for unavailable.
- **Rule** — 5 Permanent UX rules, Product page, "Variant selection unambiguous", and 7 Accessibility and performance, "Sufficient text, icon, border and focus contrast". **Themes** — wine, organic, lime, noor. **Verified** — browser.

#### UX-071 · Every size and colour is served disabled and struck through until hydration
- **Evidence** — `src/routes/(www)/products/[slug]/components/product-variation.svelte:57` "disabled={!v?.selectable}"; `node_modules/@misiki/kitcommerce-core/dist/composables/product/use-product.svelte.js:512` "$effect(() => { // Mark all options as selectable at initial render"; `src/routes/(www)/products/[slug]/components/product-variation.svelte:123` ":global([data-theme='default'] .edp-pill:disabled) { opacity: 0.4 !important; text-decoration: line-through; }"; screenshot `rv-ch-012-nojs-pills.png`.
- **Impact** — The selectable flag is set only by a client effect, so the server sends every pill disabled and, on the default theme, crossed out. The page sits in that state for roughly two seconds on every load, and stays there permanently when JavaScript fails. A shopper's first impression is a product whose every size and colour is crossed out, which reads as sold out, and the loading state is drawn as the unavailable state.
- **Fix** — Treat an absent selectable flag as available so the server-rendered markup shows options enabled, and reserve the disabled and strikethrough treatment for values the API has actually excluded. Use the existing `ui/skeleton` on the pill row if a real loading state is needed.
- **Rule** — 6 States and feedback, "Never show a blank page or region while data loads". **Themes** — all. **Verified** — browser.

**Medium**

- **UX-234 · "View Reviews" is a dead control** — `product-title-section.svelte:81`. The link under the star rating has no handler and no destination, so the most natural path from the rating to the reviews is a tab stop that does nothing. Give the reviews section an id and make the control an anchor to it. (all)
- **UX-235 · The size guide is a hard-coded ring chart** — `product-variation.svelte:26`, `size-guide-drawer.svelte:60`. Any product whose option type is Size offers a guide that opens US ring circumferences and finger-measuring steps, so a t-shirt reads as jewellery. Source the chart from store or product data and hide the trigger when none exists, keeping the drawer as it is. (all)
- **UX-236 · The chat launcher covers the right end of the mobile add-to-cart bar** — `src/lib/components/chat/conversational-shopping.svelte:171`, `product-details.svelte:365`. The 56px bubble lands inside the primary button on phones and takes taps meant for it. Add the named z-index scale the codebase map already asks for plus one shared floating-widget offset, and lift the launcher above the bar below the small breakpoint. (all)
- **UX-238 · The desktop purchase panel never sticks and has no measure cap** — `product-details.svelte:264`. The offset class sits on a statically positioned column, so price and add to cart leave the screen once a shopper scrolls to the description, and the button stretches to 541px at 1440. Make the buy column sticky at the large breakpoint and cap its measure inside the page rail. Also reported as UX-248. (all)
- **UX-239 · Error pages print raw developer strings and promise a notification that never happens** — `src/routes/(www)/+error.svelte:17`, `:22`. Shoppers read headings such as "Not found: /faqs/nope", and every non-404 status claims a team has been notified although nothing reports errors. Map status to plain sentence-case headlines, log the technical message instead of showing it, and drop the notification claim until a reporting hook exists. (all)
- **UX-240 · Every dialog, sheet and drawer close button is a 16px target** — `src/lib/components/ui/dialog/dialog-content.svelte:29`, `src/lib/components/ui/sheet/sheet-content.svelte:45`, `size-guide-drawer.svelte:64`. The close control is the bare icon with no padding, below the 24px WCAG minimum, and on phones it is the primary way out of a full-width drawer. Give the shared close a 44px box on mobile in the two primitives and let the drawer call sites reuse it. (all)
- **UX-241 · The full-screen image viewer is not a dialog** — `product-gallery.svelte:231`, `:70`, `:250`. The zoom layer carries no dialog role, never moves or traps focus, cannot be closed with Escape, and offers no previous or next control, so a shopper who opens image one cannot reach image two. Rebuild it on the existing `ui/dialog` primitive and add the same carousel controls used inline. Also reported as UX-242. (all)
- **UX-243 · The gallery has no empty or error state** — `product-gallery-section.svelte:50`, `src/lib/core/components/image/lazy-img.svelte:111`. A product with no media renders nothing at all, so half the page is blank with the share pill floating over the void, and a failed hero image shows a broken glyph because the placeholder is skipped for priority images. Add an else branch rendering a placeholder at the store aspect ratio using `bg-muted` and a muted icon, and let the placeholder cover priority images too. Also reported as UX-247. (all)
- **UX-244 · Gallery thumbnails and slides are div wrappers with duplicate labels** — `product-gallery.svelte:99`, `:167`. Every thumbnail announces the same "View full image" although clicking it only swaps the main image, responds to Enter but not Space, and marks no current image, while each slide adds a second tab stop around an interactive frame. Make thumbnails real buttons with distinct labels and a current state, and use one labelled button to open the viewer. (all)
- **UX-245 · The buy box paints its own palette instead of using tokens** — `product-details.svelte:365`, `product-cart-and-wishlist-buttons.svelte:105`, `product-pricing.svelte:62`. Greys, whites, a literal green and hex values are hard-coded and then patched back for one theme, so the mobile bar stays white on every themed canvas and the discount colour never tracks the success token. Replace them with the semantic utilities and shadow scale, and delete only the colour declarations in the default-theme blocks that exist to undo them. Also reported as UX-250. (all)
- **UX-246 · Mobile gallery pagination dots are 6px targets** — `product-gallery.svelte:219`. Below 640px the thumbnail rail is hidden, so these dots are the only way to jump to an image, and each inactive dot is six pixels square with six pixel gaps. Keep the small visual dot inside a 44px hit area and swap the hard-coded grey for a muted token. (all)
- **UX-249 · The main gallery image downloads the 1280px render on every viewport** — `product-gallery.svelte:199`, `:286`. It is the one image call without a size hint, so a 390px phone pulls roughly 2.7 times the pixels it needs for the eager hero image, and the full-screen image does the same. Pass a size hint matching the gallery layout so the image component emits its candidate list. (all)
- **UX-252 · The product error page uses the status code as its heading** — `src/routes/(www)/products/[slug]/+error.svelte:17`, `:29`, `:15`. A screen reader user hears "404" as the page heading at 60px, the useful message is demoted, the bag icon bounces regardless of reduced-motion settings, and "Go Back" always lands on the full catalogue with the history branch commented out. Make "Product not found" the heading at page-title scale, drop the bounce, and relabel the button to match what it does. Also reported as UX-450, UX-451. (all)
- **UX-253 · Related products load behind a spinner in a colour that does not exist** — `related-products.svelte:17`, `:8`, `:9`. A small spinner block is replaced by a full card grid when results land, shifting the page by hundreds of pixels, the heading appears and then vanishes if nothing comes back, and six cards across the rail crush image, title and price. Reserve the height with `ui/skeleton` cards at the final card ratio, cap the rail at four columns, and keep the section inside the page rail. Also reported as UX-457. (all)
- **UX-254 · The review form and photo lightbox are hand-rolled overlays** — `product-reviews-section.svelte:307`, `:239`, `:405`. The form has no dialog role, no focus trap, no Escape and no scroll lock, and the lightbox is never focused on open so its Escape and arrow keys can only fire by luck. Move both onto `ui/dialog`, keeping the existing internal markup, and let a rating submit without written text. Also reported as UX-255. (all)
- **UX-256 · Several mobile controls sit at 36px or below** — `product-title-section.svelte:37`, `product-gallery-section.svelte:57`, `product-variation.svelte:58`, `product-aggregation.svelte:32`. Size and colour pills are 36px on the four non-default themes and the share pill is 28px, so mis-taps between adjacent sizes are likely on the most-tapped controls of the page. Set the target height on the shared pill class for all themes and use the large size on the icon-only mobile buttons, keeping desktop compact. Also reported as UX-262. (wine, organic, lime, noor)
- **UX-257 · The share pill renders although the merchant switched sharing off, and tags another shop** — `product-gallery-section.svelte:45`, `src/lib/core/components/plugins/share-button.svelte:39`. The gate reads the plugin object rather than its active flag, unlike every other plugin check, and the share it opens tags posts with an unrelated merchant's name and phone-accessory keywords. Gate on the active flag and pass store-driven values instead of the baked-in ones. (all)
- **UX-258 · Accordion toggles report no expanded state and are not headings** — `product-specifications.svelte:16`, `product-description.svelte:22`, `product-details.svelte:313`. Screen reader users hear "Product Specifications, button" with no state and cannot reach the description, specifications, returns or reviews by heading, since the page exposes one heading and then the footer. Rebuild both panels on the existing `ui/collapsible` primitive with the trigger label inside a second-level heading, and render the specifications panel only when a field has a value. Also reported as UX-260, UX-455. (all)
- **UX-259 · Specification field names are 10px at 2.54 to one contrast** — `product-specifications.svelte:31`, `:95`. Every label in the grid, including SKU and dimensions, is unreadable for low-vision shoppers on the four themes without the default colour override, and 10px is below the supporting-text floor. Use 12px with `text-muted-foreground` for names and small foreground text for values so contrast comes from the token set in every theme. (wine, organic, lime, noor)
- **UX-452 · The aggregation option row is a second, less accessible copy of the pills** — `product-aggregation.svelte:27`, `:29`, `:12`. Where a product family is split across separate URLs, the chips carry no group label and no pressed state, so assistive technology cannot report which value is selected, and the merchant's option ordering is ignored. Extract one option-row component used by both surfaces and feed it from the sorted entries the composable already computes. (all)
- **UX-454 · Gallery videos autoplay unmuted and without controls** — `product-gallery.svelte:118`, `:281`, `:313`. Browsers block unmuted autoplay, so a product video shows a frozen first frame the shopper cannot play, and where it does play it loops with no pause and no reduced-motion handling. Add muted, inline playback and controls, and pause under reduced motion. (all)

**Low**

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-261 | Hover and focus styles on the share widget name a colour scale that does not exist, so they emit no CSS and the controls look unresponsive | `src/lib/core/components/plugins/share-button.svelte:68`, `:166`; `related-products.svelte:17` | Use the real primary token utilities, and add a check so a non-existent utility cannot ship silently |
| UX-453 | Two add-to-cart components and two breadcrumbs render at every width, with CSS hiding one of each | `product-details.svelte:245`, `:261`, `:276`, `:368` | Render each once and place the compact variant with layout order rather than a duplicate |
| UX-456 | One recommendations list is surfaced under two names, and its mobile trigger floats over the product image | `product-gallery-section.svelte:56`, `:82`; `related-products.svelte:12` | Use one heading string for both surfaces so the drawer reads as a shortcut into the rail |
| UX-458 | Only the weight block in the specification grid is right-aligned, so the pairs read as a broken table | `product-specifications.svelte:76` | Drop the alignment override so every definition block shares one alignment |
| UX-459 | Theme CSS uses Tailwind utility classes as styling hooks, so renaming a class silently drops the style | `src/app.css:383`, `:386`, `:392`; `product-title-section.svelte:125`, `:129`, `:134` | Key these rules on a semantic class or the variant data attribute, and replace the grey literals they patch |

### Cart

The cart works, but nearly every figure a shopper reads while deciding is either too small, too pale, out of date, or styled outside the design system.

#### UX-078 · Coupon drawer crashes on any coupon without an expiry date
- **Evidence** — `src/lib/components/coupon/coupons-drawer.svelte:75` "Expires on : {format(coupon?.validTill || '', 'MMM dd, yyyy, hh:mm a')}"; `src/lib/components/coupon/coupons-drawer.svelte:7` "import { format } from 'date-fns'".
- **Impact** — date-fns 4.4.0 throws on an empty value, so the `|| ''` guard turns a missing end date into a crash inside the coupon loop. One evergreen coupon takes down the whole panel, including the manual code field, so a shopper holding a valid code cannot apply it and no discount is browsable.
- **Fix** — Guard the line behind `{#if coupon?.validTill}` and format through the core `date()` helper, which returns the raw value for an unparsable date, so a coupon with no end date simply shows no expiry row.
- **Rule** — 6 States and feedback, "Every component defines: default, hover, active/pressed, focus-visible, disabled, loading, empty, error, success." **Themes** — all. **Verified** — two reviewers.

#### UX-072 · Supporting text across cart and checkout is 9px to 12px in greys that fail AA
- **Evidence** — `src/routes/(www)/checkout/cart/+page.svelte:401` "text-[10px] font-bold uppercase tracking-tighter text-gray-400"; `src/routes/(www)/checkout/cart/+page.svelte:561` "<span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400"> Address required </span>"; `src/routes/(www)/checkout/cart/+page.svelte:482` "text-[10px] ... text-muted-foreground"; `src/lib/components/nav/cart-sidebar.svelte:172` "Shipping & taxes calculated at checkout."; `src/routes/(www)/checkout/address/+page.svelte:198` "Email Address"; `src/routes/(www)/checkout/payment/payment.svelte:131` "text-[10px] font-medium uppercase tracking-tighter text-gray-400"; `src/lib/components/buttons/checkout-button.svelte:29` "text-[10px] font-bold uppercase tracking-widest text-muted-foreground"; `src/lib/core/components/plugins/order-trust-badges.svelte:12` "text-xs font-medium uppercase leading-none tracking-tighter text-gray-400"; screenshot `cart-dw-default-390-page-vp.png`.
- **Impact** — The unit price and the words "Address required" measure 10px at 2.54:1 below the large breakpoint, so the two facts a shopper uses to sanity-check the bag are the least legible strings on it. The same treatment carries payment method descriptions, the trust badge sub-labels and the Total label on the pinned mobile bar. Also reported as UX-264 and UX-277.
- **Fix** — Move all of it to `text-xs` with `text-muted-foreground` in both responsive copies of the row, and drop the uppercase and `tracking-tighter` treatment that costs further legibility on data.
- **Rule** — 4 Implementation architecture > Type scale, "Supporting text: 12–14px, never low-contrast merely to appear elegant." **Themes** — all. **Verified** — two reviewers.

#### UX-073 · Drawer quantity buttons are 22px, against 40px for the same control on the bag page
- **Evidence** — `src/lib/components/cart/cart-item.svelte:106` "class="rounded-md p-1 hover:bg-gray-100 disabled:opacity-30""; `src/lib/components/cart/cart-item.svelte:110` "<Minus class="size-3.5" />"; `src/lib/components/cart/cart-item.svelte:159` "class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50""; `src/routes/(www)/checkout/cart/+page.svelte:77` "class="flex h-10 w-10 items-center justify-center""; screenshot `cart-dw-default-390-drawer-3items.png`.
- **Impact** — The plus and minus measure 22px on default, wine and organic, and 26px to 28px on lime and noor, all far under the 44px the rulebook asks for on mobile. A phone shopper adjusting quantity, the most common cart action, gets a cramped target 11px from the remove control, then a comfortable 40px stepper on the bag page.
- **Fix** — Rebuild the drawer stepper on the same `Button size="icon"` shell the bag page's quantity snippet uses, at `h-10 w-10` below `sm` and `h-9 w-9` above, and share one snippet between both surfaces. Give continue shopping and remove the same minimum box.
- **Rule** — 7 Accessibility and performance, "Pointer targets meet WCAG minimums; about 44px for important mobile actions." **Themes** — all. **Verified** — two reviewers.

#### UX-074 · Each cart row is one link wrapping seven buttons, and it opens a new tab
- **Evidence** — `src/routes/(www)/checkout/cart/+page.svelte:346` "<a class="flex flex-1 gap-3 py-5 sm:p-3 sm:px-4 md:gap-6 md:p-5" href={`/products/${item.slug}`} target="_blank">"; `src/routes/(www)/checkout/cart/+page.svelte:493` "aria-label="Remove item""; screenshot `cart-dw-default-1280-page-3items.png`.
- **Impact** — Rows are 246px tall at 390px with wide dead space, and clicking that space opens the product page in a second tab where Back cannot return to the bag. Buttons nested inside an anchor are invalid markup, so assistive technology announces one link containing a stepper and a remove button.
- **Fix** — Link only the thumbnail and the product title, in the same tab, and leave the rest of the row plain markup, which is the pattern the drawer row already uses.
- **Rule** — 7 Accessibility and performance, "WCAG 2.2 AA. Semantic HTML first; ARIA only when native semantics are insufficient." **Themes** — all. **Verified** — two reviewers.

#### UX-075 · Portalled menus and dialogs render outside the theme wrapper and fall back to the wine palette
- **Evidence** — `src/routes/+layout.svelte:147` "<div class="light min-h-screen theme-{data?.theme?.name || 'default'}" data-theme={data?.theme?.name || 'default'}"; `src/app.css:15` ":root { ... --primary: 4.1 81.7% 50.6%; --radius: 0px; --font-body: 'Poppins', sans-serif; }"; `src/app.css:257` "body:has([data-theme='lime'])"; `src/lib/components/ui/select/select-item.svelte:20` "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"; screenshot `rv-ch-017-portal-organic.png`.
- **Impact** — Theme tokens are declared on a div inside the body, while every bits-ui portal attaches to the body itself, so select, popover, dropdown and dialog content resolves the root fallback set. On four of five themes a shopper opening sort or a variant picker gets a square, red-highlighted menu in the wrong font, and the lime rule in app.css is a one-off patch for this same bug.
- **Fix** — Mirror the same `data-theme` value onto the html element for both SSR and the runtime switch, keeping the shell attribute intact, so the existing theme blocks match the document root. The lime patch and the hard-coded white on the cart drawer panel can then be deleted.
- **Rule** — 2 Codebase map for UX work > Design tokens, "HSL triplets on `:root` and one `[data-theme='…']` block per theme." **Themes** — all. **Verified** — browser.

#### UX-076 · Totals stay at full contrast while a quantity change is in flight, and both loading guards are dead
- **Evidence** — `src/routes/(www)/checkout/cart/+page.svelte:538` "{#if cartModule.loadingForCart}"; `node_modules/@misiki/kitcommerce-core/dist/composables/use-checkout-cart.svelte.js:10` "loadingForCart = $state(false);"; `src/lib/components/nav/cart-sidebar.svelte:189` "disabled={!!cartState.isUpdatingCart}"; `node_modules/@misiki/kitcommerce-core/dist/stores/cart.svelte.js:156` "this.updatingItem[lineId] = true;"; screenshots `cart-dw-default-page-updating.png`, `cart-dw-default-drawer-updating.png`.
- **Impact** — With the cart write throttled the page shows Subtotal and Total at $28.00 while the change to $42.00 is still in flight, with Proceed to Shipping enabled, so a shopper can commit against a figure that is already wrong. The page guard reads a flag the core never assigns and the drawer guard reads a flag the update path never sets, and the drawer has no live region, so a screen reader hears nothing at all.
- **Fix** — Derive one busy flag from the store's per-line updating map, use it to disable the checkout button and drive its loading prop, and put the existing `Skeleton` primitive behind the summary figures. Wrap the quantity and subtotal in a polite live region and delete the unreachable loading branch.
- **Rule** — 6 States and feedback, "Never show a blank page or region while data loads: stable skeletons for first load, subtle progress for later updates." **Themes** — all. **Verified** — browser.

#### UX-077 · The loading indicator on the checkout buttons is 1.4px wide, so the button reads as empty
- **Evidence** — `src/lib/core/components/common/loading-dots.svelte:24` ".dot { width: 0.1em; height: 0.1em;"; `src/lib/components/buttons/checkout-button.svelte:38` "{#if loading} <LoadingDots />"; `src/routes/(www)/checkout/cart/+page.svelte:84` "<LoadingDots />"; `src/lib/components/cart/cart-item.svelte:115` "<img src={LoadingDotsGif} alt="Loading..." class="size-3.5" />"; screenshot `states-feedback-r4-loadingdots-zoom.png`.
- **Impact** — Each dot measures 1.39px, so pressing Proceed to Shipping, Review Order or Confirm Order replaces the label with three specks and the highest-stakes control in the flow looks empty rather than busy. The same quantity change also reports progress two different ways, an animated GIF in the drawer and near-invisible dots on the bag page. Also reported as UX-289.
- **Fix** — Replace the call sites in app-owned files with one shared spinner built on the already installed lucide LoaderCircle, sized on the 4px scale, keeping the label beside it with `aria-busy` and an sr-only status. Drop the GIF import in the drawer row so both surfaces use the same indicator.
- **Rule** — 6 States and feedback, "Every component defines: … loading …" **Themes** — all. **Verified** — browser.

#### UX-079 · The drawer unit price uses a background token as its text colour, at 1.1:1
- **Evidence** — `src/lib/components/cart/cart-item.svelte:68` "<p class="text-sm font-semibold text-muted uppercase tracking-tighter">"; `tailwind.config.ts:67` "muted: { DEFAULT: 'hsl(var(--muted) / <alpha-value>)', foreground: 'hsl(var(--muted-foreground) / <alpha-value>)' }"; `src/routes/(www)/checkout/payment/payment.svelte:228` "Delivering Order to"; screenshot `cart-dw-lime-1280-drawer-qty2.png`.
- **Impact** — Measured against the drawer panel the per-unit price is 1.12:1 on organic and lime, 1.14:1 on noor and 2.27:1 on default and wine, so the text is effectively invisible. A shopper holding two of an item sees a doubled figure with no readable unit price to check it against, and this is the only place the drawer states one.
- **Fix** — Change the class to `text-muted-foreground`, the token the system maps to muted text, and audit the remaining `text-muted` uses so the surface token never lands in a colour slot again.
- **Rule** — 2 Codebase map for UX work > semantic token table, "text-muted → --muted-foreground"; 7 Accessibility and performance, "Sufficient text, icon, border and focus contrast." **Themes** — all. **Verified** — two reviewers.

#### UX-265 · A cart that fails to load is presented as an empty cart
- **Evidence** — `src/routes/(www)/checkout/cart/+page.svelte:661` "<p class="text-xl text-gray-400">Your cart is empty</p>"; `src/routes/(www)/checkout/cart/+page.svelte:589` "{#if cartModule.showError}"; `node_modules/@misiki/kitcommerce-core/dist/composables/use-checkout-cart.svelte.js:12` "showError = $state(false); errorMessage = $state('');"; screenshot `skep2-cart-catchstate.png`.
- **Impact** — The catch branch of the cart load renders the empty-cart message, reproduced by blocking site data so hydration rejects. A shopper whose bag failed to load is told it is empty, so they assume their items are gone rather than retrying, and the page's own error block is unreachable because the two error fields are never assigned.
- **Fix** — Give the catch branch its own copy and a retry `Button` that re-runs the load, visually distinct from the empty state, and either wire the error fields from the store failure paths or delete the dead block so the page keeps one honest error surface.
- **Rule** — 6 States and feedback, "Every component defines: default, hover, active/pressed, focus-visible, disabled, loading, empty, error, success." **Themes** — all. **Verified** — browser.

#### UX-284 · The provisional amount is labelled Total on the same card that says shipping is unknown
- **Evidence** — `src/routes/(www)/checkout/cart/+page.svelte:561` "<span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400"> Address required </span>"; `src/routes/(www)/checkout/cart/+page.svelte:577` "<span class="text-sm font-bold uppercase text-gray-900">Total</span>"; `src/routes/(www)/checkout/cart/+page.svelte:56` "const cartTotal = $derived(formatPrice((cartState.cart as any)?.total, page?.data?.store?.currency?.code))"; screenshot `cart-dw-default-1280-page-3items.png`.
- **Impact** — The summary reads Subtotal, then a shipping row saying the cost is unknown, then a bold Total equal to the subtotal, and no tax row is ever rendered even though the drawer promises taxes at checkout. On any store that charges shipping a shopper reads that figure as the amount they will pay and meets a larger one two steps later, with no estimator in the cart to resolve it.
- **Fix** — Label the amount Estimated total while the shipping address is unset, with a `text-xs text-muted-foreground` qualifier beneath it, and switch to Total once the address is set using the branch that already exists. Render a tax row only when the cart reports tax.
- **Rule** — 5 Permanent UX rules > Cart and checkout, "Quantity, remove, save-for-later, variant, price, discount, shipping estimate and subtotal understandable." **Themes** — all. **Verified** — browser.

**Medium**

- **UX-263 · Cart surfaces are painted in raw greys, greens and ambers, and `--warning` is still undefined** — `src/routes/(www)/checkout/cart/+page.svelte:606`, `:568`, `:397`, `src/lib/components/nav/cart-sidebar.svelte:140`, `src/app.css:37`. The drawer panel, the savings line and the partial-checkout warning render identically on all five themes, and the same savings string uses `text-green-600` in one responsive copy and `text-success` in the other; also reported as UX-272. Add `--warning` and `--warning-foreground` per theme block plus a `warning` entry in the Tailwind colour map, then swap the raw utilities for `bg-card`, `text-foreground`, `text-muted-foreground`, `border` and `text-success`. (all themes)
- **UX-266 · Address and payment show totals with no line items, and the mobile bar cannot expand** — `src/routes/(www)/checkout/address/+page.svelte:446`, `src/routes/(www)/checkout/payment/payment.svelte:272`, `src/lib/components/buttons/checkout-button.svelte:28`. While entering an address a shopper cannot see what they are paying for, and on mobile the summary card sits about 1350px down with no way to reveal it from the pinned bar. Add a compact line-item list to both Price Summary cards and make the pinned total a `Collapsible` trigger that opens the same summary. (all themes)
- **UX-267 · The cart drawer is hand-rolled instead of using the existing sheet primitive** — `src/lib/components/nav/cart-sidebar.svelte:132`, `:123`, `:117`. The panel has no elevation because `shadow-3xl` and `ease-out-expo` are undefined, it squashes horizontally over 500ms even under reduced motion, and hovering the backdrop draws a primary border around the whole viewport. Rebuild on `src/lib/components/ui/sheet` driven by the existing open state, which removes the raw scroll-lock style tag, the arbitrary z-index and the ghost-button backdrop in one move. (all themes)
- **UX-268 · The drawer button says Checkout but goes to the bag page** — `src/lib/components/nav/cart-sidebar.svelte:196`, `:91`. A shopper who presses Checkout lands on a screen whose primary button is Proceed to Shipping, which costs a click and makes the commitment step feel like a loop. Relabel it Go to bag, the phrase the product page already uses for this destination, and keep it the filled primary. (all themes)
- **UX-269 · Nothing in the cart offers save for later** — `node_modules/@misiki/kitcommerce-core/dist/composables/use-checkout-cart.svelte.js:128`, `src/routes/(www)/checkout/cart/+page.svelte:407`, `src/lib/components/cart/cart-item.svelte:160`. A shopper unsure about one of three items can only delete it and lose the product, although the shared cart module already implements move to wishlist with its own loading map. Add a Save for later action beside Remove using the `Button` link variant, gated on the same wishlist plugin flag the header and product cards read. (all themes)
- **UX-270 · The cart abandons the shared content rail** — `src/routes/(www)/checkout/cart/+page.svelte:107`, `src/app.css:315`. Measured at 1280 the cart container starts at x=0 while the header rail starts at x=48, so the item card sits visibly left of the logo above it and the responsive gutter rule is bypassed. Replace `container mx-auto px-4` with `page-width` here and on the other three checkout steps. (all themes)
- **UX-271 · Cart rows are 232px tall with a 93px empty band in the middle** — `src/routes/(www)/checkout/cart/+page.svelte:421`, `:350`. An auto top margin and extra padding push the stepper to the bottom of a column sized by a 128px thumbnail, so three items push the price summary below the fold on a phone. Drop the auto margin and the top padding and shrink the thumbnail to `w-20 sm:w-24` so the text column stacks naturally. (all themes)
- **UX-273 · Three different empty-cart and error treatments across the checkout steps** — `src/routes/(www)/checkout/cart/+page.svelte:142`, `:589`, `src/routes/(www)/checkout/address/+page.svelte:133`, `:492`, `src/routes/(www)/checkout/payment/payment.svelte:79`. Moving from bag to address to payment a shopper meets different empty states and error banners, all set in 11px uppercase at the moment copy most needs to be readable. Build one empty state and one inline alert in `src/lib/components/common` on the tokenised `role="alert"` pattern `address-form.svelte:194` already uses, and use them on all four steps. (all themes)
- **UX-274 · The coupon drawer changes direction at 400px but changes layout at 640px** — `src/lib/components/coupon/coupons-drawer.svelte:20`, `:29`, `tailwind.config.ts:19`. Between 401px and 639px the panel slides in from the right while its content still carries bottom-sheet geometry, so the promo panel arrives in the wrong shape on large phones and small tablets. Read one breakpoint by matching the script check to the `sm` token the content classes already use. (all themes)
- **UX-275 · The promo trigger nests a button inside a button** — `src/lib/components/coupon/coupons-drawer.svelte:21`, `:22`. The parser closes the outer element at the inner one, so the visible Apply Promo Code control is not the trigger and assistive technology announces two buttons for one action. Pass the styled `Button` through the trigger's child snippet, or apply `buttonVariants` to the trigger and drop the inner `Button`. (all themes)
- **UX-276 · Drawer rows omit the variant and discount the bag page shows** — `src/lib/components/cart/cart-item.svelte:74`, `src/routes/(www)/checkout/cart/+page.svelte:370`, `:390`. The drawer reads a field the connector fills only on order lines, so two sizes of the same shirt appear as two identical rows with two identical steppers and no sale price. Read the same variant options and compare-at price the bag page reads so both surfaces describe a line identically. (all themes)
- **UX-278 · Trust badges promise easy returns and quality assurance for every merchant** — `src/lib/core/components/plugins/order-trust-badges.svelte:11`, `:21`, `src/routes/(www)/checkout/cart/+page.svelte:623`. Three fixed claims appear on cart, address, payment and review even for a store selling final sale, and no merchant can edit or remove them from admin; also reported as UX-279. Render the core trust badge plugin with `type="order"` and keep these three only as defaults when the plugin is active but empty, using `bg-muted` and `text-muted-foreground` instead of fixed greys. (all themes)
- **UX-280 · The out-of-stock and price-change flags are never shown** — `node_modules/@misiki/gocommerce-connector/dist/index.js:748`, `src/routes/(www)/checkout/cart/+page.svelte:320`. The connector maps both flags with a comment saying the cart should warn, yet neither cart surface reads them, so a shopper learns an item sold out only after entering an address. Render a `text-destructive` line when the stock flag is explicitly false and a muted note when the price flag is explicitly true, testing the exact value so backends that omit the fields render nothing. (all themes)
- **UX-281 · Removing an item in the drawer has no busy state and no undo** — `src/lib/components/cart/cart-item.svelte:159`, `src/routes/(www)/checkout/cart/+page.svelte:35`. The trash button is never disabled while the request runs, so a double tap on a slow connection fires two mutations, and there is no undo toast like the one the bag page shows. Disable it from the store's per-line updating map and reuse the bag page's sonner toast with Undo, lifted into one shared helper both surfaces call. (all themes)
- **UX-282 · The cart page has no h1, and an h3 precedes the only h2** — `src/routes/(www)/checkout/cart/+page.svelte:362`, `:535`, `:110`. A screen-reader user navigating by heading gets no page identity and an inverted outline, and the item count appears nowhere because the page title markup is commented out. Restore an h1 carrying the bag name and item count at the page-title step and demote the product titles beneath it. (all themes)
- **UX-283 · The empty drawer state sits inside the sticky footer and uses off-domain copy** — `src/lib/components/nav/cart-sidebar.svelte:159`, `:174`, `:178`, `:180`. The bag icon lands low in the panel rather than centred, the copy shouts "Empty Cart!!" and offers to "order some essentials from the menu", and the same state on the bag page uses different words and a different destination; also reported as UX-464. Move the branch out of the footer wrapper into the panel body with `flex-1`, and use one sentence-case string and one destination across both surfaces. (all themes)
- **UX-285 · The quantity is printed twice in every cart row** — `src/routes/(www)/checkout/cart/+page.svelte:366`, `:374`. A static "Qty: 2" chip styled almost exactly like a variant option sits well above the editable stepper, and the two disagree while an update is in flight. Delete the chip and give genuine variant options a `bg-muted text-muted-foreground` badge so option values never look like a control. (all themes)
- **UX-286 · The savings figure counts up for a full second and ignores reduced motion** — `src/routes/(www)/checkout/cart/+page.svelte:58`, `:173`. A money figure scrambles through wrong values for 1000ms on every cart change, several times the feedback budget, and it runs unconditionally for a motion-sensitive shopper. Print the value directly, or gate the tween on `prefersReducedMotion` from `svelte/motion` at roughly 160ms, since a `matchMedia` call at component init would break server rendering. (all themes)
- **UX-287 · Two competing focus-ring contracts on the same page** — `src/app.css:276`, `src/lib/components/ui/button/button.svelte:7`, `src/lib/components/ui/input/input.svelte:12`. The global rule paints a 2px primary ring while every shadcn primitive paints a 1px ring token, so one tab sequence shows two indicators and the checkout fields get the weaker of the two. Keep the global rule as the single source, switch it to `ring-2 ring-ring ring-offset-2`, and strip the per-primitive focus fragments so they inherit it. (all themes)
- **UX-288 · Two accessors for the store currency in one panel** — `src/lib/components/nav/cart-sidebar.svelte:169`, `src/lib/components/cart/cart-item.svelte:65`, `src/lib/components/nav/bottom-nav.svelte:181`. The subtotal formats from one shape and the line prices above it from another, and the price formatter falls back silently to USD whenever its argument is undefined, so a backend that fills only one shape shows two currencies in one panel. Resolve the currency once into a derived value using the tolerant expression the repo already contains and pass it to every call site. (all themes)

**Low**

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-460 | Drawer rows are unnamed ARIA groups with an inert click guard | `src/lib/components/cart/cart-item.svelte:25` | Drop `role="group"` and the stop-propagation handler, and render the lines as list items inside one list |
| UX-461 | The drawer item list is unkeyed and bound by index, so a busy indicator can move to the wrong product | `src/lib/components/nav/cart-sidebar.svelte:152` | Key the each block by line id and read busy state from the store's per-line updating map |
| UX-462 | The header cart badge hides when the total is zero, and its label reads "1 items" | `src/lib/components/nav/cart-sidebar.svelte:107` | Gate the badge on the line count, as the panel heading already does, and pluralise the accessible label |
| UX-463 | Two reassurance blocks stack around the checkout button and repeat the same security claim | `src/routes/(www)/checkout/cart/+page.svelte:597` | Drop the inline encryption strip and let the shared trust badges below the card carry reassurance |

### Checkout

Checkout completes a purchase, but it is the least finished area of the storefront: guests can reach a dead end, the confirmation shows neither address nor total, and most of the flow is painted outside the token system.

#### UX-080 · Change on the payment step strands the shopper on a disabled button

- **Evidence** — `src/routes/(www)/checkout/address/+page.svelte:517` "disabled={!(isPhoneOk && isEmailOk && cartState.cart.shippingAddress && !addressModule.editAddress)}"; `src/lib/components/address/address-form-modal.svelte:36` "<Dialog bind:open={show}>"; `src/routes/(www)/checkout/address/+page.svelte:552` "onclose={addressModule.handleFormClose}"; `node_modules/@misiki/kitcommerce-core/dist/composables/use-checkout-address.svelte.js:339` "this.editAddress = true;"; screenshot `checkout-probe-after-change-escape-1280.png`.
- **Impact** — A guest who taps Change on the payment step lands back on the address step with a modal edit form stacked over an inline form that already holds the same address. Dismissing the modal drops focus to the body and leaves the summary button greyed out and relabelled, so the only way forward is to notice the inline save button and save the address again.
- **Fix** — Wire the modal's accepted but unused close callback into the dialog's open-change handler so dismissal clears the editing flag and returns focus to the trigger, and for guests open the prefilled inline form rather than the dialog.
- **Rule** — 5 Permanent UX rules > Cart and checkout, "One unmistakable checkout CTA"; 7 Accessibility and performance, dialog focus and Escape-to-close. **Themes** — all. **Verified** — browser.

#### UX-087 · Guest checkout offers no country field

- **Evidence** — `src/routes/(www)/checkout/address/address-form.svelte:177` "<span class="text-xs uppercase tracking-wide text-gray-500">Country</span>"; `src/routes/(www)/checkout/address/address-form.svelte:47` "candidate.countryCode = address?.countryCode || page?.data?.store?.country?.code || ''"; `src/lib/components/address/address-form-modal.svelte:91` "<Select id="countryCode" title="Select Country" label="Country" showSearch={true}"; `src/routes/(www)/checkout/payment/payment.svelte:81` "We currently deliver only to"; screenshot `checkout-x3-address-1280.png`.
- **Impact** — The guest form prints the country as static text and stamps the store default onto every saved address, so a guest shipping anywhere else cannot say so. They reach the payment step, meet the delivery-country error, and have no control to correct it. Also reported as UX-305.
- **Fix** — Render the country with the searchable Select the signed-in dialog already uses, defaulting to the store country, and keep the read-only treatment only when the store lists a single country.
- **Rule** — 5 Permanent UX rules > Cart and checkout, "Guest checkout allowed"; 8 Stable master prompt > 3, do not remove features. **Themes** — all. **Verified** — two reviewers.

#### UX-088 · Order confirmation shows an empty delivery address and no totals

- **Evidence** — `src/routes/(www)/checkout/success/+page.svelte:201` "<p>{firstOrder?.shippingAddress?.city}, {firstOrder?.shippingAddress?.state} {firstOrder?.shippingAddress?.zip}</p>"; `src/routes/(www)/checkout/success/+page.svelte:147` "<h2 class="mb-6 text-lg font-bold text-gray-900">Order Summary</h2>"; `src/routes/(www)/checkout/success/+page.svelte:259` "{#if userState?.user?.role}"; `src/routes/(www)/checkout/success/+page.svelte:241` "Check <a href="/my/orders""; screenshot `checkout-x-after-confirm-1280.png`.
- **Impact** — On a real order placed through the running store, the shipping address panel renders a bare comma because every binding resolves empty and nothing guards them. The summary lists the line item but no subtotal, shipping, discount, tax, total or payment method, and the only tracking link is hidden from guests. Also reported as UX-318.
- **Fix** — Guard the address card and fall back to one muted line, extract the price summary that three checkout screens already duplicate into a shared component fed from the order, and show the order-tracking link to everyone.
- **Rule** — 6 States and feedback, empty and error states; 10 Definition of done, "totals and availability are consistent". **Themes** — all. **Verified** — two reviewers.

#### UX-081 · Address step ships two identical primary buttons

- **Evidence** — `src/routes/(www)/checkout/address/address-form.svelte:201` "<Button type="submit" disabled={isLoading} class="w-full">"; `src/routes/(www)/checkout/address/+page.svelte:508` "text="Save Address""; `src/routes/(www)/checkout/address/+page.svelte:515` "text="Continue to Payment""; screenshots `checkout-x3-address-1280.png`, `checkout-run-address-360.png`.
- **Impact** — A guest sees two full-width primary buttons carrying the same label, one in the form and one in the summary, consecutive in the tab order. After returning from the payment step the pair reads "Save Address" and "Continue to Payment" at identical colour and weight, so nothing marks which one advances the order. Also reported as UX-091.
- **Fix** — Keep the summary button as the single primary and demote the in-form submit to the existing outline variant, which preserves native submission and the Enter key.
- **Rule** — 5 Permanent UX rules > Cart and checkout, "One unmistakable checkout CTA; no competing primary buttons". **Themes** — all. **Verified** — two reviewers.

#### UX-082 · Address validation is not inline and reports one error at a time

- **Evidence** — `src/routes/(www)/checkout/address/address-form.svelte:50` "const issue = result.error.errors[0]"; `src/routes/(www)/checkout/address/address-form.svelte:193` "{#if formError}"; `src/lib/components/form/textbox.svelte:96` "{#if (validationError || error) && touched}"; screenshot `checkout-x-address-empty-submit-390-vp.png`.
- **Impact** — Submitting the empty form at 390px moves focus to the first field but renders the only message far below the fold, with no red border and no invalid state on any of the nine inputs. Because only the first issue is reported, the shopper must submit again for each remaining required field.
- **Fix** — Lift the touched gate in the shared text field so an externally supplied error renders, feed the per-field issues into each field's existing error treatment with matching invalid and described-by attributes, and move the roll-up alert above the fields.
- **Rule** — 5 Permanent UX rules > Cart and checkout, "Persistent labels, inline validation … never clear valid fields after an error". **Themes** — all. **Verified** — two reviewers.

#### UX-083 · Body text in the summary and stepper fails AA contrast

- **Evidence** — `src/routes/(www)/checkout/payment/payment.svelte:228` "<span class="text-sm font-bold text-muted">Delivering Order to</span>"; `src/lib/components/checkout/checkout-header.svelte:65` "step === 3 ? 'text-primary' : 'text-gray-400'"; `src/lib/core/components/plugins/order-trust-badges.svelte:12` "text-gray-400"; `src/routes/(www)/checkout/address/+page.svelte:473` "Address required"; screenshot `checkout-x-payment-390.png`.
- **Impact** — The label above the delivery address measures 2.27:1, the inactive step labels 2.54:1 and the trust sub-labels 2.43:1, all well below the 4.5:1 threshold. Low-vision shoppers cannot read where the parcel is going or which step they are on.
- **Fix** — Replace the background token used as a text colour and the raw grey literals with the muted-foreground token, and give the inactive step state a token that clears 4.5:1 in every theme.
- **Rule** — 7 Accessibility and performance, "Sufficient text, icon, border and focus contrast"; 4 Type scale, supporting text never low-contrast. **Themes** — all. **Verified** — two reviewers.

#### UX-084 · Checkout keeps the full storefront header and footer

- **Evidence** — `src/routes/(www)/+layout.svelte:33` "<Nav />"; `src/routes/(www)/+layout.svelte:37` "<Footer />"; `src/routes/(www)/checkout/+layout.svelte:11` "{@render children?.()}"; `src/lib/components/nav/nav.svelte:271` "{#if !page.url.pathname.startsWith('/checkout')}"; screenshot `checkout-x-address-390.png`.
- **Impact** — Every checkout step carries the category navigation, search, wishlist and account icons plus a footer of eleven to fourteen links. From the last address field the third tab press lands in the footer link list, so the flow offers a row of exit routes at the point of purchase.
- **Fix** — Render a reduced header in the checkout layout using the existing step rail and trust row, gate the storefront navigation and footer on the same checkout path test the navigation already applies, and keep a single legal row rather than deleting the footer.
- **Rule** — 8 Stable master prompt, storefront rules, "Cart and checkout must minimize distraction". **Themes** — all. **Verified** — two reviewers.

#### UX-085 · Checkout is painted with hardcoded palette values instead of tokens

- **Evidence** — `src/routes/(www)/checkout/address/+page.svelte:148` "<div class="rounded-lg border border-blue-100 bg-blue-50 p-4">"; `src/routes/(www)/checkout/payment/payment.svelte:270` "border border-border bg-white p-6 shadow-sm"; `src/routes/(www)/checkout/success/+page.svelte:74` "bg-[#fafafa]"; `src/routes/(www)/checkout/success/+page.svelte:79` "rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.02)]"; `src/routes/(www)/checkout/address/+page.svelte:178` "style="font-family: var(--font-body);""; `src/routes/(www)/checkout/failed/+page.svelte:107` "background: white;"; screenshot `checkout-x-lime-address-1280.png`.
- **Impact** — The guest banner stays cornflower blue inside the plum and sand themes, card surfaces and headings ignore the theme, and the two steps of one flow render errors two different ways. Twelve headings carry an inline font patch and the one that was missed renders in the serif display face beside a sans sibling. Also reported as UX-319 and UX-468.
- **Fix** — Move surfaces and copy onto the card and foreground tokens, replace the inline font patches with the sans utility that already maps to the body font, and bring the confirmation card's corner back onto the radius scale.
- **Rule** — 8 Stable master prompt > 4, "Do not add one-off colors, spacing, typography, radii, shadows … inside a page". **Themes** — all. **Verified** — two reviewers.

#### UX-086 · Address dialogs render outside the themed wrapper

- **Evidence** — `src/lib/components/ui/dialog/dialog-content.svelte:19` "<Dialog.Portal>"; `src/routes/+layout.svelte:149` "data-theme={data?.theme?.name || 'default'}"; `src/app.css:18` "--primary: 4.1 81.7% 50.6%;"; `src/lib/components/address/address-form-modal.svelte:113` "Save Contact"; `src/lib/components/address/address-list-modal.svelte:28` "<DialogContent class="sm:max-w-[425px] …">"; screenshots `checkout-x-guest-change-1280.png`, `checkout-probe-change-dialog-1280.png`.
- **Impact** — The edit-address dialog attaches to the document body, outside the element that carries the theme, so it paints a bright red confirm button, a grey panel and square corners against a white page with navy primaries. The confirm sits directly above a red delete link and is labelled "Save Contact" on an address form, so the save and destroy actions look alike. Also reported as UX-089.
- **Fix** — Give the shared dialog primitive a portal target on the themed wrapper so every floating layer inherits the tokens, relabel the submit to match the inline form, and swap the delete link's raw red for the danger token.
- **Rule** — 1 Project context, must preserve runtime theme switching; 4 Implementation architecture, tokens in `src/app.css` are the source of truth. **Themes** — all. **Verified** — two reviewers.

#### UX-090 · The payment-failed page sits outside the checkout system

- **Evidence** — `src/routes/(www)/checkout/failed/+page.svelte:14` "window.location.href = '/checkout/cart'"; `src/routes/(www)/checkout/failed/+page.svelte:248` "background-color: #10b981;"; `src/routes/(www)/checkout/failed/+page.svelte:108` "border-radius: 0.75rem;"; `src/routes/(www)/checkout/failed/+page.svelte:98` "min-height: calc(100vh - 100px);"; screenshot `checkout-x3-failed-1280.png`.
- **Impact** — After a failed payment the shopper gets a page with no step indicator, a serif heading below the page-title scale and a card built from raw hex values, with a stray white band above the footer. The primary button says "Try Payment Again" but reloads the cart three steps back, so address and payment have to be chosen again. Also reported as UX-303.
- **Fix** — Rebuild the page inside the checkout shell with the existing card and button primitives and the token utilities, delete the scoped stylesheet whose rules never match, and point the primary action at the payment step with the one-time cart id preserved.
- **Rule** — 8 Stable master prompt > 4, no one-off colours or radii inside a page; > 11, descriptive labels. **Themes** — all. **Verified** — two reviewers.

#### UX-291 · The success page claims payment succeeded when no order is referenced

- **Evidence** — `src/routes/(www)/checkout/success/+page.svelte:91` "Thank you for your order"; `src/routes/(www)/checkout/success/+page.svelte:103` "Your payment went through. We're still confirming the order details"; `src/routes/(www)/checkout/success/+page.server.ts:1` "export { wwwCheckoutSuccessLoadServer as load }"; screenshot `checkout-x3-success-noorder-1280.png`.
- **Impact** — Opening the confirmation URL with no query parameters renders the green tick, the thank-you headline, the confirmed-to-processing timeline and the claim that payment went through, with no order number, items or amount. The loader returns an empty order list on failure, so the page cannot tell a failed lookup from nobody having ordered and makes the stronger claim in both cases.
- **Fix** — Branch on whether an order reference is present, keeping the reassurance copy when there is one, and otherwise showing a neutral not-found state that links to order tracking and the account.
- **Rule** — 6 States and feedback, "Every component defines: … empty, error, success"; 8 Stable master prompt > 9. **Themes** — all. **Verified** — browser.

#### UX-301 · The blocked checkout button hides its reason in 2.31:1 text and looks enabled

- **Evidence** — `src/lib/components/buttons/checkout-button.svelte:34` "disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:border-gray-200 disabled:border disabled:opacity-100"; `src/lib/components/buttons/checkout-button.svelte:42` "<span>{disabled && disabledText ? disabledText : text}</span>"; `src/routes/(www)/checkout/address/+page.svelte:516` "disabledText="Select Address""; `src/routes/(www)/checkout/payment/payment.svelte:322` "disabledText="Select Method""; screenshot `ref0-disabled-default-1280.png`.
- **Impact** — When the checkout button is blocked, its label is the only instruction naming what is missing, and it measures 2.31:1, the least legible text in the flow. The opacity override removes the remaining disabled cue, so the button reads as an ordinary control that silently does nothing when tapped.
- **Fix** — Replace the grey literals with the muted surface and foreground tokens so the disabled label clears 4.5:1 in every theme, and move the blocking reason into a short helper line above the button.
- **Rule** — 6 States and feedback, disabled state; 7 Accessibility and performance, "Sufficient text … contrast". **Themes** — all. **Verified** — browser.

**Medium**

- **UX-290 · The payment return route renders nothing** — `src/routes/(www)/checkout/process/+page.svelte:1` is a 0-byte file. Gateways that return by a full page load leave the shopper on a blank window for the length of the capture call. Give the route a "confirming your payment" screen built from the existing loader primitive inside the checkout shell. (all)
- **UX-292 · Address delete uses a browser prompt at checkout** — `src/routes/(www)/checkout/address/+page.svelte:49`. The same destructive action shows an unstyled browser prompt in checkout and a themed dialog in the account. Reuse the account page's dialog confirmation with the destructive button variant. (all)
- **UX-293 · The edit-address dialog sets no autocomplete** — `src/lib/components/address/address-form-modal.svelte:52`. Every field in the dialog measured with no autocomplete while the inline form on the same route sets all nine, so autofill is lost on the path the Change button uses. Add the same autocomplete tokens to the dialog fields, which already forward them to the input. (all)
- **UX-294 · Auto-selecting the first shipping rate fires a success toast** — `src/routes/(www)/checkout/payment/payment.svelte:48`. The payment step opens with a green "shipping rate changed" toast before the shopper has touched anything. Set the default rate silently and reflect the choice in the summary's shipping row. (all)
- **UX-295 · Address save failures reach the shopper only as a toast** — `src/routes/(www)/checkout/address/+page.svelte:492`. A backend rejection is swallowed and toasted, so the form's inline error never renders and the summary error block is unreachable. Rethrow when the cart still has no shipping address so the existing inline alert shows, and wire or remove the dead block. (all)
- **UX-296 · Totals are off-screen between 640px and 1023px** — `src/routes/(www)/checkout/address/+page.svelte:139`. The summary moves beside the form only at 1024px and the pinned bar exists only below 640px, so tablet shoppers fill the whole form with no total visible or discoverable. Move the split to md, keep the pinned bar up to lg, or add a collapsible summary using the existing collapsible primitive. (all)
- **UX-297 · Mobile controls sit under the 44px minimum** — `src/lib/components/ui/input/input.svelte:12`. At 390px every input, the in-form save button, the step circles and both login links measure 36px or less on the flow's main data-entry screen. Give the shared input and button primitives a responsive mobile height and wrap the step dot in a 44px hit area. (all)
- **UX-298 · Checkout uses the Tailwind container instead of the project rail** — `src/routes/(www)/checkout/address/+page.svelte:110`. The checkout body runs 64px wider than the header and footer around it, so the left edge visibly steps on every step. Swap the container utility for the single page rail on all four checkout pages. (all)
- **UX-299 · The country cell is not built like the other address fields** — `src/routes/(www)/checkout/address/address-form.svelte:177`. The country caption is a small uppercase grey span centred in its cell so it sits below the ZIP label beside it, the one optional field is not marked, and a line break supplies spacing. Also reported as UX-472. Wrap the cell in the shared field shell with the label primitive and token colours, pass the optional flag on address line 2, and let the grid gap do the spacing. (all)
- **UX-300 · The delivery address is collapsed on desktop and its toggle is silent** — `src/routes/(www)/checkout/payment/payment.svelte:226`. On a wide screen with an empty left column the shopper still has to click to confirm where the order goes, and the toggle reports no expanded state. Also reported as UX-312. Use the existing collapsible primitive and expand by default from lg up. (all)
- **UX-302 · The delivery estimate is hard-coded to US English and invented** — `src/routes/(www)/checkout/success/+page.svelte:35`. The confirmation prints a US-formatted date built from a seven-day default whenever the order carries no shipping rate, which is every order on this connector. Drop the literal locale and render the estimate only when the order actually carries one. (all)
- **UX-304 · First load of both form steps is an unlabelled spinner** — `src/routes/(www)/checkout/address/+page.svelte:124`. A bare spinning icon in a fixed box is replaced by the full two-column layout, so the page jumps and nothing announces the wait. Render a skeleton of that layout with the existing skeleton primitive and give the region a status role. (all)
- **UX-306 · Decorative animation ignores reduced motion** — `src/routes/(www)/checkout/success/+page.svelte:85`. The confirmation tick pulses forever, error pages bounce and account lists fly in for shoppers who asked their system for reduced motion. Add one global reduced-motion rule in the stylesheet or switch these utilities to their motion-safe variants. (all)
- **UX-307 · Mutation buttons stay enabled while the request is in flight** — `src/routes/(www)/checkout/address/+page.svelte:47`. Nothing acknowledges the tap, so on a slow connection a second tap fires a duplicate delete or adds a second unit from the wishlist. Bind a pending state around each awaited call and pass it to the button as disabled with the loading dots the checkout button already uses. (all)
- **UX-308 · Neither form step has a page heading** — `src/routes/(www)/checkout/address/+page.svelte:111`. The address and payment steps render no top-level heading at any width, so screen-reader users get no page title and sighted users get only numbered circles. Also reported as UX-471. Give each step one heading on the page-title scale and bring the review heading onto the same scale. (all)
- **UX-309 · The review screen has no URL** — `src/routes/(www)/checkout/payment/+page.svelte:8`. Browser back from the last screen before paying lands two steps back on the address step, and a reload drops to the payment method list. Drive the review state from a search parameter set with pushState so back, forward and reload all behave. (all)
- **UX-311 · The payment step has no empty-cart state** — `src/routes/(www)/checkout/payment/payment.svelte:56`. Returning to the step after the cart is cleared shows a payment method, a zero total and a call to add delivery details for an order that no longer exists. Guard the step on an empty line-item list the way the address step does and render the shared empty-bag state. (all)
- **UX-313 · Phone rejects a formatted number and email shows a false valid state** — `src/routes/(www)/checkout/address/address-form.svelte:137`. A number typed with spaces is rejected because nothing normalises it, and an emptied email keeps its green border while the submit rule blocks the form. Normalise the phone value before validating and give the email field the same rule the submit uses. (all)
- **UX-314 · Review and failure screens use raw images with 404 fallbacks** — `src/routes/(www)/checkout/payment/review.svelte:55`. Both placeholder paths are missing from the static folder, so any item without a working thumbnail shows a broken-image glyph on the last screen before paying. Replace the raw tags with the lazy image primitive, which already has an error state, and delete the dead placeholder paths. (all)
- **UX-315 · Review rows omit the variant** — `src/routes/(www)/checkout/payment/review.svelte:59`. At the last check before paying, two sizes of the same product render as identical rows. Render the variant title that the confirmation page already prints. (all)
- **UX-316 · Saved-address edit and delete buttons are unnamed and hover-only** — `src/lib/components/address/address-list-modal.svelte:51`. Touch users never see the controls, keyboard users focus an invisible button and screen readers announce two unnamed buttons per address. Give them accessible labels, reveal them on focus as well as hover, and guard the empty second address line. (all)
- **UX-317 · The step indicator is unlabelled and its disabled steps look enabled** — `src/lib/components/checkout/checkout-header.svelte:31`. Below 640px the accessible names are bare numbers, there is no current-step marker, and the two unavailable steps keep full opacity so they read as tappable. Render the stepper as a labelled navigation list with a current-step marker and make unavailable steps plain text. (all)
- **UX-320 · The order summary shows totals but no line items** — `src/routes/(www)/checkout/address/+page.svelte:455`. Across the address and payment steps a shopper cannot see what they are paying for until after choosing a payment method, which matters most when only part of the cart was selected. Reuse the review step's item list inside the summary card, collapsed behind a disclosure below lg. (all)
- **UX-321 · The form error banner goes stale** — `src/routes/(www)/checkout/address/address-form.svelte:58`. The banner keeps naming a field the shopper has already corrected, so it contradicts the live field messages beside it. Clear it whenever the address changes, or revalidate on input once the form has been submitted once. (all)
- **UX-322 · Every combobox is named "Open Select Options"** — `src/lib/components/form/select.svelte:49`. The visible label is not associated with the trigger and the fixed name hides the current value, which affects the checkout country picker and the listing sort control. Forward the component id onto the trigger, use it in the label, and drop the fixed name so the label and button text supply it. (all)
- **UX-323 · Two competing login invitations on the guest address step** — `src/routes/(www)/checkout/address/+page.svelte:152`. A guest is offered the same login twice within about 110px, the second time at the same visual weight as the section heading it sits beside. Also reported as UX-474. Keep the banner sentence as the single login affordance and drop the header link. (all)
- **UX-324 · The ZIP field forces a numeric keypad** — `src/routes/(www)/checkout/address/address-form.svelte:184`. A UK or Canadian shopper gets a digits-only keyboard although the store's own rule accepts letters. Remove the numeric input mode, or set it only for countries whose postcodes are numeric. (all)

**Low**

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-310 | OTP login started from checkout returns the shopper to the homepage, on phone-login backends only | `src/routes/(www)/checkout/address/+page.svelte:158` | Pass the current path as the redirect from the checkout login prompts and route the OTP continue button through the redirect wrapper |
| UX-465 | Checkout page titles drop the store name and change pattern mid-flow | `src/routes/(www)/checkout/payment/payment.svelte:53` | Use one title pattern driven by the store name across all four steps |
| UX-466 | Guests cannot enter a billing address that differs from delivery | `src/routes/(www)/checkout/address/+page.svelte:426` | Show the billing checkbox to guests and reuse the inline address form for the billing card |
| UX-467 | Hard-coded country and dial-code defaults in the address and login forms | `src/lib/components/address/address-form-modal.svelte:96` | Fall back to the store payload and derive the phone placeholder from the resolved dial code |
| UX-469 | The desktop payment and review steps leave a large empty band above the footer | `src/routes/(www)/+layout.svelte:34` | Drop the duplicated full-viewport height from the main element and the checkout page wrappers, keeping the mobile CTA reserve |
| UX-470 | The blocked button says "Select Method" for a shipping-country error, and the review card drops the payment icon | `src/routes/(www)/checkout/payment/payment.svelte:322` | Derive the disabled label from the actual blocker and reuse the payment icon helper on the review card |
| UX-473 | The selected shipping rate has no selected state beyond the radio dot | `src/routes/(www)/checkout/payment/payment.svelte:162` | Apply the primary border and ring treatment the payment methods on the same page already use |

### Loading, empty and error states

Every route improvises its own states, so a failed cart reads as an empty bag, checkout steps open blank, and state colour ignores the theme.

#### UX-005 · A failed cart load is shown to the shopper as an empty bag

- **Evidence** — `src/routes/(www)/checkout/cart/+page.svelte:141` "{#if !cartState.cart?.lineItems?.length}"; `src/routes/(www)/checkout/cart/+page.svelte:659` "{:catch}" then "Your cart is empty"; `node_modules/@misiki/kitcommerce-core/dist/stores/cart.svelte.js:76` "Cart hydration failed; bag may display empty" is logged and the promise still resolves, so the failure lands in the success branch; screenshot `states-feedback-r4-cart-failed-390.png`.
- **Impact** — A shopper who already has items and hits a 5xx, an expired session or a dropped request is told the bag is empty and pushed back to browsing. There is no error, no retry and nothing that separates a real failure from a genuinely empty cart, so the shopper re-adds everything or leaves.
- **Fix** — Treat a stored cart id with no returned cart as a failure, not an empty bag, and give that case the error shape the orders route already ships: an alert icon in `text-destructive`, a short "we could not load your cart" heading, and a `Button` that re-runs the load. The durable error flag belongs in the core package, which this repo does not edit.
- **Rule** — 6 States and feedback > "Every component defines: default, hover, active/pressed, focus-visible, disabled, loading, empty, error, success." **Themes** — all. **Verified** — two reviewers.

#### UX-092 · Core routes open on a blank region holding one unlabelled spinner

- **Evidence** — `src/routes/(www)/checkout/cart/+page.svelte:134` "{#await cartState.hasLoaded}" then "min-h-96 items-center justify-center py-8"; `src/routes/(www)/checkout/address/+page.svelte:123`; `src/routes/(www)/checkout/payment/payment.svelte:70`; `src/routes/(my)/my/orders/+page.svelte:94` "LoaderCircle class="h-8 w-8 animate-spin text-primary""; `src/routes/(my)/my/wishlist/+page.svelte:45`; `src/routes/(my)/my/addresses/+page.svelte:48`; `src/routes/(www)/auth/verify/+page.svelte:54`; screenshot `states-feedback-r4-cartloading-390.png`.
- **Impact** — Every shopper meets a 384px empty box with a 34px spinner on the first load of all three checkout steps, then the page snaps to full content. The wait carries no accessible name and no live region, so a screen reader user hears nothing while the most trust-sensitive routes in the store are loading.
- **Fix** — Replace each spinner with a skeleton that mirrors the layout it stands in, built from the existing skeleton primitive and copied from the structure already written at `src/routes/(www)/store/[slug]/+page.svelte:113`. Wrap each one in `role="status"` with an `sr-only` label so the wait is announced once.
- **Rule** — 6 States and feedback > "Never show a blank page or region while data loads: stable skeletons for first load, subtle progress for later updates." **Themes** — all. **Verified** — two reviewers.

#### UX-327 · Success, warning and error colours bypass the theme tokens

- **Evidence** — `src/routes/(www)/checkout/cart/+page.svelte:568` "bg-green-50 … text-green-600 ring-1 ring-green-100" on the FREE badge; `src/routes/(www)/checkout/cart/+page.svelte:606` "bg-yellow-50 … text-yellow-700"; `src/routes/(www)/checkout/payment/payment.svelte:80` "bg-red-50 … text-red-600"; `src/routes/(www)/checkout/payment/payment.svelte:329` "border-amber-200 bg-amber-50 … text-amber-900"; `src/lib/components/common/status-cell.svelte:34`; `src/routes/(my)/my/orders/+page.svelte:57`; `src/routes/(www)/checkout/success/+page.svelte:74` "bg-[#fafafa]"; `src/routes/(www)/checkout/failed/+page.svelte:96` a style block with "#f9fafb" and "#1f2937"; screenshot `states-feedback-r4-cosuccess-noor-1280.png`.
- **Impact** — Order status chips, the free shipping badge, the payment notices and both checkout outcome pages render the same greens, yellows, reds and greys in every theme. A merchant who themes the storefront gets checkout feedback that looks like it came from a different product, and the amber and yellow blocks are first uses of a warning colour the token map says to define before use.
- **Fix** — Add `--warning` and `--warning-foreground` to `src/app.css` and `tailwind.config.ts` as the token map instructs, then move these surfaces onto `bg-success/10`, `bg-destructive/10`, `bg-warning/10` and the card, background and foreground tokens. Start with the shared status cell and the orders route, which own most of the occurrences.
- **Rule** — 2 Codebase map > semantic token table, the warning row ("add --warning / --warning-foreground in src/app.css and tailwind.config.ts before first use"), with 8 Stable master prompt > rule 4. **Themes** — all. **Verified** — browser.

#### UX-329 · The confirmation page shows a fixed progress bar it never checked, including when the order fails to load

- **Evidence** — `src/routes/(www)/checkout/success/+page.svelte:62` "const timelineSteps = [ { label: 'Confirmed', … completed: true }, { label: 'Processing', … current: true }"; `src/routes/(www)/checkout/success/+page.svelte:118` "h-full w-1/3 bg-primary"; the whole stepper sits above `:145` "{#if firstOrder}", so it renders in the fallback branch too; screenshot `states-feedback-r4-cosuccess-1280.png`.
- **Impact** — Every order is presented as confirmed and currently processing, whatever its real status, on the one screen a shopper keeps as proof of purchase. The tick, the thank-you heading and the one-third-filled bar also render directly above the copy saying the order details could not be loaded.
- **Fix** — Move the stepper inside the branch that has an order and derive its completed and current flags from the order status, reusing the shared status cell that the order tracking route already uses. In the fallback branch keep the neutral copy and the recovery links, and drop the tick, the pulsing halo and the bar.
- **Rule** — 10 Definition of done > "Product data, counts, prices, variants, totals and availability are consistent", with 6 States and feedback (success). **Themes** — all. **Verified** — browser.

#### Medium

- **UX-325 · Add to bag gives no loading state while the request is in flight** — `src/routes/(www)/products/[slug]/components/product-cart-and-wishlist-buttons.svelte:108`. A shopper on a slow connection sees the same label and bag icon at half opacity, so a tap that registered looks like a tap that did nothing. Add a branch on the in-flight flag that swaps in the spinning loader icon and an "Adding" label and sets `aria-busy`, matching the wishlist button in the same file at line 35. (all)
- **UX-326 · Empty states are designed on account routes and one grey sentence on discovery routes** — `src/routes/(www)/collections/+page.svelte:29`, `src/routes/(www)/collections/[slug]/+page.svelte:31`, `src/routes/(www)/vendors/+page.svelte:84`, `src/routes/(my)/my/buy-again/+page.svelte:163`. A shopper who reaches an empty collection or vendor list gets no explanation and no link onward, while an empty wishlist hands them a route back to the catalogue. Extract one empty-state component under `src/lib/components/common`, built from the `Button` primitive and the foreground, muted and border tokens rather than the account routes' literal greys, and use it on all five routes. (all)
- **UX-328 · The navigation overlay blurs the page but leaves the header sharp and clickable** — `src/routes/+layout.svelte:159`, `src/lib/components/nav/nav.svelte:139`. Any navigation slower than 700ms greys and blurs the viewport while the header stays crisp at the same stacking level, so the page reads as half broken rather than half loaded. Prefer a thin progress element under the header or the destination's skeleton; if the overlay stays, take its colours from the card and foreground tokens, add the named z-index scale that section 2 lists as an open gap, and surface a retry instead of spinning forever. (all)
- **UX-330 · Toasts render in the toast library's stock styling on every theme** — `src/routes/+layout.svelte:172`, `src/lib/components/ui/sonner/sonner.svelte:11`. Every success and error toast is white with 8px corners and one fixed font, including on the three themes that set a zero radius, and the themed wrapper the repo already ships is never imported anywhere. Move the toaster inside the data-theme wrapper it currently sits below, import it from the local sonner component instead of the core package, and add the radius utility to its toast class list. (all)

#### Low

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-475 | Profile gives no loading state and no confirmation after saving | `src/routes/(www)/profile/+page.svelte:34`, `src/routes/(www)/profile/+page.svelte:57` | Show skeleton inputs while the profile loads and a success toast after save |

### Accessibility

The hand-rolled overlays for cart, filters and sort all fail keyboard and screen-reader shoppers, and the checkout step rail drops below readable contrast in every theme.

#### UX-093 · Escape throws a type error and never closes the cart drawer
- **Evidence** — `src/lib/components/nav/cart-sidebar.svelte:138` "use:dialog={onClose}"; `src/lib/actions/dialog.ts:29` "onclose?.()"; `src/lib/components/nav/nav.svelte:274` "onClose={navModule.closeCartSidebar}"; core's handler reads `e.stopPropagation()` from an argument the action never passes; probe on ports 5173, 5176 and 5177: after Escape the drawer count stays 1 and "TypeError: Cannot read properties of undefined (reading 'stopPropagation')" is thrown; screenshot `a11y-w-cartdrawer-esc-default-1280.png`.
- **Impact** — A keyboard or screen-reader shopper adds an item, lands in the drawer, and presses Escape to get back to the page. The drawer stays open and an uncaught error fires on every press. Focus does sit on the close button, which works, so they are delayed rather than trapped.
- **Fix** — Give the drawer a local, argument-free close callback so the shared dialog action can invoke it, and use the same wrapper at the three nav call sites. Keep the action's existing arg-free contract.
- **Rule** — Section 7 Accessibility and performance, "Visible keyboard focus, logical focus order, dialog focus trapping, Escape-to-close." **Themes** — all. **Verified** — two reviewers.

#### UX-094 · The mobile filter panel is a plain div, so focus never enters it and Escape does nothing
- **Evidence** — `src/lib/components/product-catalogue/mobile-filter.svelte:131-136` "ed-mf__panel fixed inset-0 z-[1000] h-screen w-screen", carrying only `inert` and `aria-hidden`, with no role, no `aria-modal` and no Escape handler; probe at /products at 390px: "dialogs: []  |  focus after open: BUTTON "Filter"  |  tab 6 lands on A "View details of Gift card" [OUT]  |  after Escape -> visible: true"; screenshot `a11y-w-mobilefilter-390.png`.
- **Impact** — Tapping Filter on a phone opens a full-screen panel but leaves focus on the button underneath it. A keyboard or switch shopper walks the five panel controls and then out into the grid and footer that the opaque panel is covering. Screen readers announce no dialog and no boundary, and Escape does not close it.
- **Fix** — Replace the hand-rolled panel with the existing sheet primitive under `src/lib/components/ui`, opened from the left, which supplies the dialog role, focus trap, Escape and focus return. Failing that, apply the same `use:dialog` treatment the cart drawer already uses, labelled by the panel's own Filters heading.
- **Rule** — Section 5 Permanent UX rules, Search and product listing, "Sticky mobile toolbar for Filter and Sort; filters open in a bottom sheet or full-height drawer"; section 7, "dialog focus trapping, Escape-to-close." **Themes** — all. **Verified** — two reviewers.

#### UX-095 · The mobile sort sheet marks nothing as selected, and one arrow key commits a sort
- **Evidence** — `src/lib/components/product-catalogue/mobile-filter.svelte:75-87` "checked={filterModule.selectedSort === item.value}" with an `onchange` that sets the sort then runs "filterModule.showSortByDrawer = false"; three runs at /products at 390px opened from the keyboard: "tabSeq=["BODY","popularity:desc","BODY","popularity:desc",...] anyChecked=false", and a single ArrowDown closed the sheet; screenshot `a11y-w-sortdrawer-390.png`.
- **Impact** — The field behind `checked` is never seeded from the URL, so no radio is ever selected and a screen reader never states the current sort. Tab reaches only the first option before bouncing to the body, so the other three are unreachable that way. Arrow keys do move, but the first press commits a sort and dismisses the sheet, so nobody can review the list.
- **Fix** — Seed the group from the sort already in the URL and swap the four rows for the existing radio-group primitive under `src/lib/components/ui`, which supplies roving tabindex and checked state. Move dismissal off change onto an explicit Done action and return focus to the Sort trigger.
- **Rule** — Section 5 Permanent UX rules, Search and product listing, "Sticky mobile toolbar for Filter and Sort"; section 7, "WCAG 2.2 AA. Semantic HTML first." **Themes** — all. **Verified** — two reviewers.

#### UX-331 · The checkout step rail hard-codes grey, leaving upcoming steps at 2.54:1
- **Evidence** — `src/lib/components/checkout/checkout-header.svelte:43` "step === 2 ? 'text-primary' : step === 1 ? 'text-gray-400 hover:text-gray-900' : 'text-inherit'"; the same `text-gray-400` at `:65` and `:87`; `border-gray-200` at `:26`, `:49`, `:71`, `:93`; `bg-gray-200` on the connector rules at `:34`, `:57`, `:79`; measured live on /checkout/cart at 390px and 1280px on all five dev servers: the Address, Payment and Placed labels compute to rgb(156,163,175) at 12px on white, a ratio of 2.54, and the step circles sit at 1.24.
- **Impact** — The one element telling a shopper how many checkout steps remain renders its upcoming steps below readable contrast. A low-vision shopper mid purchase cannot tell where they are in the flow. Each button also carries `disabled:opacity-100`, so the grey is chosen styling rather than browser dimming.
- **Fix** — Swap the four hard-coded greys for tokens already in the system: `text-muted-foreground`, `hover:text-foreground`, `bg-border` on the connector rules, and simply delete `border-gray-200` so the circles inherit the theme border colour from the global rule in `src/app.css`.
- **Rule** — Section 7 Accessibility and performance, "Sufficient text, icon, border and focus contrast"; section 4, Type scale, "Supporting text: 12-14px, never low-contrast merely to appear elegant." **Themes** — all. **Verified** — browser.

#### Medium

- **UX-332 · The cart and address steps ship no top-level heading** — `src/routes/(www)/checkout/cart/+page.svelte:535`, `src/routes/(www)/checkout/address/+page.svelte:178`; landmark probe returns an empty h1 list on both, on all five themes. A screen-reader shopper on the two most decisive purchase steps has no heading naming the page. Add an `<h1>` using the existing `.page-heading` utility above the step rail and demote the current top-level `<h2>`s under it. (all)
- **UX-476 · The mobile menu button is announced as "Sidebar"** — `src/lib/components/nav/nav.svelte:197` and `:232`, both `aria-label="Sidebar"` with no `aria-expanded`. A screen-reader shopper hears the implementation name instead of the action, learns nothing about menu state, and hears different wording per theme. Rename both triggers to an action label, add `aria-expanded`, and align every theme, copying the cart trigger pattern at `cart-sidebar.svelte:100-101`. (default, wine, organic carry the wrong label; lime and noor say "Toggle menu")

#### Low

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-477 | The price filter's track and selected range disappear under forced colours, leaving two unconnected circles | `src/lib/components/product-catalogue/desktop-filter.svelte:301`, `src/lib/components/product-catalogue/mobile-filter.svelte:273`; no `forced-colors` rule exists anywhere in `src/`; screenshot `a11y-w-forced-plp-1280.png` | Add one `@media (forced-colors: active)` block in `src/app.css` beside the tokens, giving the shared track a `CanvasText` border and the fill `Highlight`, scoped to the slider only |

### Performance and layout stability

Nothing here blocks a purchase, but images are the weak point: most never reach the server HTML, one theme reserves no space for them on phones, and every page pays for a payment script it never uses.

#### UX-335 · Most images are absent from the server HTML until the bundle hydrates
- **Evidence** — `src/lib/core/components/image/lazy-img.svelte:62` "let isIntersecting = $state(false)"; the flag is set only inside `onMount` at `:71`, and it is the sole gate on both image templates, `:126` and `:175` "{#if isIntersecting || priority}"; `src/lib/core/components/image/lazy-img-with-zoom.svelte:223` carries the identical gate; `src/routes/(www)/products/[slug]/components/product-gallery.svelte:128` renders the thumbnail rail with no priority flag.
- **Impact** — Every image except the first six listing cards and the first gallery image is missing from the HTML the server sends, so the browser cannot begin those downloads until the bundle has loaded and hydrated. A shopper on a slow phone sees an empty thumbnail rail, empty cart line items and empty related products long after the page is otherwise usable.
- **Fix** — Render the image tag unconditionally and let the loading and fetchpriority values the component already computes do the deferral, keeping the observer only for the fade-in. The surrounding aspect-ratio box already reserves the space, so emitting the tag on the server costs no layout stability and needs no new primitive.
- **Rule** — Section 7 Accessibility and performance, "Optimise images, fonts, API waterfalls and hydration". **Themes** — all. **Verified** — code.

#### UX-336 · Lime homepage drops its reserved image heights below 900px
- **Evidence** — `src/lib/theme/lime/LimeHomepage.svelte:600` "height: auto" applied to six selectors, cancelling `:302` ".lime-collage-large { height: 697px; }", `:319` ".lime-split-campaign a { height: 691px; }", `:468` ".lime-story img { height: 443px; }" and `:500` ".lime-store img { height: 343px; }"; no image tag in the file carries a width or height attribute; measured at 390px, those images report an automatic aspect ratio and a parent of automatic height; the correct pattern already sits at `:259` ".lime-category img { aspect-ratio: 1; }".
- **Impact** — On a lime storefront at phone width, the collage tiles, the split campaign pair, the demand feature and the story and store photographs occupy no height until each file arrives. Content below them jumps down under the shopper's thumb repeatedly while a loading homepage is being scrolled.
- **Fix** — Replace the height reset with an explicit aspect ratio per slot at the mobile breakpoint, taking each ratio from the desktop fixed height already written in the file. The category rule a few lines away is already this pattern, so no new tokens or utilities are involved.
- **Rule** — Section 7 Accessibility and performance, "Reserve dimensions to prevent layout shift". **Themes** — lime. **Verified** — browser.

Medium

- **UX-333 · Stock hero and lookbook images arrive at 1400px with no responsive candidates** — `src/lib/theme/default/DefaultHomepage.svelte:389` and `:526`; assets at `src/lib/theme/default/homepage-content.ts:103` and `:127`; the preconnect gate at `src/routes/+layout.svelte:113`. The heaviest image above the fold is four to five times the pixels a phone needs, carries no intrinsic dimensions, and comes from a host the page has never connected to, so the request starts cold at 790ms. Add sizes and srcset candidates built from the width already encoded in the content URL, add matching width and height attributes, and extend the existing preconnect so a cross-origin theme hero gets one too. (default)
- **UX-334 · Every page loads Stripe's script, its fraud iframe and three IP lookups** — `src/lib/core/utils/index.ts:1` "export * from '@misiki/kitcommerce-core/utils'", the barrel that pulls in both the Stripe module and the analytics module whose IP fetch runs at module scope. Shoppers on the homepage, listings and legal pages pay connection and transfer cost for a payment bundle and three geolocation lookups, and a telemetry request leaves pages that contain no payment form. Replace the wildcard re-export with explicit re-exports of the helpers the storefront actually uses so the Stripe module stays out of every graph but the payment route, and confirm against a production build first, since this was measured on the dev servers. (all)
- **UX-478 · A 43 KB animated GIF serves as the 14 pixel cart spinner** — `src/lib/components/cart/cart-item.svelte:115` "<img src={LoadingDotsGif} alt="Loading..." class="size-3.5" />", a 42,980 byte fetch observed on a quantity change. A shopper adjusting quantity in the cart downloads 43 KB for a 14 pixel indicator, so on a mobile connection the feedback can appear after the update it was meant to announce. Use the loading dots component already shipped for this same state on the product card, or the skeleton primitive at the same size, since the dots render near one pixel inside the extra-small quantity text. (all)

Low

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-479 | A 5.5 MB jsdom chunk is emitted into the client build and never requested by a browser | `.svelte-kit/output/client/_app/immutable/chunks/C-vDOfoZ.js` | Import the sanitiser from a server-only module, or mark jsdom external for the client build |
| UX-480 | Local copies shadow the core package components; four of them have no importers and the QR component is still Svelte 4 syntax | `src/lib/core/components/index.ts:1`, `src/lib/core/components/common/qr-code.svelte:2` | Stop re-exporting the package components, delete the four unused files, move the QR component to runes |
| UX-481 | The default homepage re-emits the layout's Google Fonts stylesheet and both preconnects | `src/lib/theme/default/DefaultHomepage.svelte:266` | Delete the head block; the root layout already emits the active theme's font URL |
| UX-482 | The web-font swap is the only measured layout shift on the default homepage, CLS 0.0064 at 1280px | `src/lib/theme/index.ts:22`, `src/routes/+layout.svelte:126` | Add a metric-matched fallback face in app.css and name it in the body and heading stacks |

### Design tokens and theming

The token layer is defined and mapped, but a large parallel palette, missing motion guards and sub-threshold contrast values stop the themes from reaching most of the storefront.

#### UX-096 · Hard-coded Tailwind palette colours form a third vocabulary no theme token reaches

- **Evidence** — 1,448 fixed-palette utilities across `src`, densest on conversion routes: `src/routes/(www)/checkout/cart/+page.svelte` 77 uses; `src/lib/components/auth/login-modal.svelte` 65; `src/routes/(www)/checkout/address/+page.svelte` 59; `src/routes/(www)/checkout/payment/payment.svelte` 46; `src/lib/components/product-catalogue/mobile-filter.svelte` 38; `src/lib/components/product-catalogue/desktop-filter.svelte` 32; `src/lib/components/product-catalogue/listing-header.svelte:29` "text-sm tracking-widest text-gray-900 dark:text-gray-200"; `src/lib/components/nav/main-nav.svelte:64` "text-sm font-bold uppercase tracking-widest text-gray-500".
- **Impact** — Shoppers on the noor and lime storefronts lose the merchant's identity as soon as they reach the cart. Labels, borders and muted copy fall back to the same slate grey on every theme, and the frozen greys also produce real contrast failures such as the listing sort label at 2.54:1.
- **Fix** — Substitute the utilities the Tailwind config already maps: foreground, muted-foreground, muted, the default border colour, success and destructive. Add the warning token to `src/app.css` and `tailwind.config.ts` before converting the orange and yellow states, and do not introduce a second border name.
- **Rule** — 8 Stable master prompt, bullet 4 on reusing semantic tokens and avoiding one-off colours. **Themes** — all. **Verified** — two reviewers.

#### UX-097 · Reduced motion is not respected on any theme

- **Evidence** — `src/lib/theme/wine/WineHomepage.svelte:596` "animation: hero-float 8s ease-in-out infinite;"; `:948` "animation: ticker 28s linear infinite;"; `src/app.css:241` "scroll-behavior: smooth;"; `src/app.css:397` guards only the default theme button base; `src/lib/components/ui/sheet/sheet-content.svelte:5` "data-[state=closed]:duration-300 data-[state=open]:duration-500"; `src/lib/components/ui/dialog/dialog-content.svelte:23`; a browser probe with reduce motion set on the default home still reported six running hero animations and smooth scrolling.
- **Impact** — A shopper who asked their operating system to reduce motion still lands on a wine home with a scrolling ticker and five floating elements. On every theme the hero still slides and fades in, in-page links still scroll smoothly, and dialogs and sheets still zoom for up to half a second. Also reported as UX-098.
- **Fix** — Add one reduced-motion block in `src/app.css` that neutralises animation, transition and scroll behaviour, with enough specificity to beat the hero rules that currently win. Keep the deliberate per-component exceptions the default theme already documents.
- **Rule** — 4 Implementation architecture, Foundation tokens, the Motion bullet; 7 Accessibility and performance, the reduced-motion bullet. **Themes** — all. **Verified** — two reviewers.

#### UX-099 · Border and input tokens sit near 1.2:1, so field and card boundaries are invisible

- **Evidence** — `src/app.css:88` "--border: 214 32% 91%; --input: 214 32% 91%;"; `:168` organic; `:193` lime; `:221` noor; `:237` "* { border-color: hsl(var(--border)); }"; `src/lib/components/ui/input/input.svelte:12` "border border-input bg-transparent"; `src/lib/components/form/textbox.svelte:76` "'border-gray-200'"; measured on /products at 1.22:1 to 1.69:1 in all five themes, against the 3:1 the standard requires.
- **Impact** — Text fields have a transparent fill, so a near-invisible hairline is the only cue that a field exists. A shopper with low vision, an ageing screen or sunlight on a phone cannot tell where the checkout address fields begin. The same token draws every card outline and divider, so the whole surface hierarchy flattens. Also reported as UX-337.
- **Fix** — Raise the input token to at least 3:1 against each theme's canvas, add one stronger border token in `src/app.css` and `tailwind.config.ts` for control boundaries, and lift the separator token off 1.2:1. Replace the hard-coded grey default in the shared textbox so the token reaches the checkout and login fields.
- **Rule** — 7 Accessibility and performance, sufficient text, icon, border and focus contrast. **Themes** — all. **Verified** — two reviewers.

**Medium**

- **UX-338 · The root palette doubles as the wine theme and carries a leftover Bootstrap blue** — `src/app.css:20`, `:65`, `:133`; `src/lib/theme/index.ts:69`. Wine's accent surfaces and every highlighted select, dropdown and command item turn bright blue on a red storefront, and an unrecognised theme name renders this mixed palette as if it were a designed theme. Give the root block a neutral base, move the wine values into the wine block, draw wine's accent from its own red and gold, and fall back to the default theme when a name is not one the build ships. (all)
- **UX-339 · The root block makes one theme's font the global body font** — `src/app.css:62`, `:245`; `src/routes/+layout.svelte:172`. Toasts and anything mounted outside the theme wrapper render in a face that four of the five themes never download, so purchase confirmations do not match the page they sit over. Set the root font variables to the system stack and move the toaster inside the theme wrapper so overlay surfaces inherit the active tokens. (default, organic, lime, noor)
- **UX-340 · No named z-index scale, so eleven arbitrary values compete** — `src/lib/components/form/select.svelte:61`; `src/lib/components/nav/cart-sidebar.svelte:132`; `src/routes/(www)/+layout.svelte:23`. The skip link, the first thing a keyboard shopper reaches, needed a value of ten million to escape being painted behind the cart drawer, and the shadcn dialogs still sit at 50 so a dialog over that drawer renders behind it. Add a z-index scale to `tailwind.config.ts` with matching custom properties for the style blocks and inline defaults that cannot use a utility, then move the primitives in `src/lib/components/ui` onto it. (all)
- **UX-341 · The lime theme loads none of its typefaces** — `src/lib/theme/index.ts:20`; `src/app.css:201`. Every lime route, from the nav to checkout, renders in the browser's default serif and sans, so the theme's main point of difference is silently absent and its sizes and letter-spacing land wrong. Add a lime entry to the theme font map for the body face, then either ship the licensed heading files or name a family the build actually loads. (lime)
- **UX-342 · The organic focus ring is 2.6:1 and the global rule uses the wrong token** — `src/app.css:277`, `:170`. A sighted keyboard shopper on organic cannot reliably see which product card or field holds focus, which means losing their place in a grid of identical cards. Point the focus rule at the ring token named in the token map, then darken organic's ring until it clears 3:1 against its canvas. (organic, all)
- **UX-343 · The merchant palette is applied after hydration and covers eight tokens** — `src/lib/components/common/store-palette.svelte:14`, `:18`; `src/routes/+layout.svelte:139`. The announcement bar and hero button visibly change colour on every first load, and the merchant's brand never reaches the focus ring, field borders or editorial surfaces. Emit the store variables as a head style block during server rendering, as the layout already does for the theme CSS, and widen the set beyond the filled-button tokens. (default)

**Low**

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-483 | Dead tokens, a malformed utility class and an unused starter stylesheet still ship in the token layer, so the foundation reads as larger than it is. Also reported as UX-485. | `src/app.css:65`, `:92`, `:296`; `src/routes/styles.css:1`; `src/lib/core/components/common/theme-provider.svelte:10`; `tailwind.config.ts:83` | Delete the unconsumed variables, the malformed class, the wine overrides in the default block, the starter stylesheet and its provider; either remove the sidebar colours or give them the alpha placeholder every other mapped colour has. |
| UX-484 | Organic loads a third font family, Open Sans, that no stylesheet references, plus a weight the type scale does not define. | `src/lib/theme/index.ts:25` | Trim the organic font request to the two families the tokens name and to the weights the components use. |

### Consistency and duplication

The storefront ships four product cards, three headers and three footers, so a merchant's choice of theme silently changes which controls and trust content shoppers get.

#### UX-346 · Four product-card implementations diverge in behaviour, and the default card hides its wishlist on touch

- **Evidence** — `src/lib/components/product-catalogue/product-card.svelte:42` "{#if activeTheme === 'lime'}", branching to three theme cards plus a fourth inline card at `:49-184` that wine and organic render; `src/lib/theme/default/DefaultProductCard.svelte:226` "opacity: 0;", revealed only by `:234` ".dpc:hover .dpc__wish, .dpc__wish:focus-visible", with none of the `@media (hover: none)` fallback that `src/lib/theme/lime/LimeProductCard.svelte:193` and `src/lib/theme/noor/NoorProductCard.svelte:247` both carry; `src/lib/theme/default/DefaultProductCard.svelte:126` "disabled={!!cartState?.isUpdatingCart}" against `src/lib/theme/noor/NoorProductCard.svelte:77` "disabled={loadingForCart}"; `src/lib/theme/lime/LimeProductCard.svelte:78` offers only "Add to Bag" where the default card has a stepper at `:109-124`; `src/lib/theme/lime/LimeProductCard.svelte:43` and `src/lib/theme/noor/NoorProductCard.svelte:30` each emit one `data-testid` against twelve on the default card, which leaves `src/app.css:356` "[data-theme='lime'] [data-testid='product-card-selling-price']" matching nothing; `src/lib/theme/noor/NoorProductCard.svelte:33` "<img src={image} alt={title} loading="lazy" />" in place of LazyImg.
- **Impact** — On the default theme a phone shopper never sees the wishlist heart, because it appears only on hover and the card has no touch fallback. On lime and noor the grid offers no quantity control, so a second tap adds a duplicate line, and on the default and generic cards one add greys out the button on every card in the grid.
- **Fix** — Converge on a single card whose markup, states and full `data-testid` set are fixed, varying only through tokens and a theme class hook, the way `src/lib/theme/sections` already parameterises sections. Do not point wine and organic at the default card as it stands, because the `--ed-*` variables it is styled with exist only inside the default theme block in `src/app.css`.
- **Rule** — 5 Permanent UX rules > Search and product listing, "Product cards prioritise image, product name, price, meaningful variant information, availability and wishlist"; 10 Definition of done, "feels like the same product as every other Svelte Commerce page, in every shipped theme". **Themes** — all. **Verified** — browser.

#### UX-348 · Lime and noor drop footer trust content and the account control, and run three content rails

- **Evidence** — `src/lib/components/nav/nav.svelte:130` "{#if activeThemeName === 'lime'}", selecting one of three separate header implementations; rails measured at 1440px on `/products`, where noor header content starts at 44px, `.page-width` at 100px and footer content at 40px, and lime pairs a 1360px page rail with an 1120px footer grid, while default, wine and organic align exactly; `src/lib/theme/lime/LimeFooter.svelte:115` "width: min(1120px, 100%);" against lime's "--container-max: 1360px" at `src/app.css:199`; `src/lib/components/common/footer.svelte:251` "width: min(var(--container-max, 1240px), 100% - 2 * var(--container-gutter, 16px));", re-declaring the `.page-width` formula; `src/lib/theme/noor/NoorFooter.svelte:30` "{#each footer?.columns || [] as column}" renders link columns only, with no copyright line and no payment icons, both of which default, wine and organic show; `src/lib/theme/lime/LimeFooter.svelte:61` "<p class="lime-version">v{version}</p>" against `src/lib/components/common/footer.svelte:208` "<span class="foot-version sr-only">{version}</span>"; `src/lib/theme/lime/LimeNav.svelte:249` ".lime-account { display: none; }" below 900px, matched by `src/lib/theme/noor/NoorNav.svelte:236`.
- **Impact** — Shoppers on lime and noor get no copyright line and no payment icons, so the footer trust evidence the other three themes carry is absent at the moment of decision. Lime also prints an internal build timestamp to customers, and both themes hide the account control below 900px, where most of the audience is.
- **Fix** — Give the header and footer one shared shell that reads `.page-width` for its rail and `--container-gutter` for its padding, with the theme components supplying tokens and slot content only. Move copyright, payment icons and the account control into that shell so no theme can drop them, and make the build stamp `sr-only` everywhere.
- **Rule** — 5 Permanent UX rules > Global navigation, "Keep wishlist, account and cart icons consistent, labelled for assistive technology, and large enough to operate"; 2 Codebase map, ".page-width … The single content rail: use it; do not add another max-width". **Themes** — lime and noor, measured against default, wine and organic. **Verified** — browser.

**Medium**

- **UX-344 · Go back on the error pages goes home instead** — `src/routes/+error.svelte:69`, where both buttons call `goto('/')`, and `src/routes/(www)/+error.svelte:29`, where the `history.back()` branch sits commented out. A shopper who follows a dead link loses their listing position, filters and scroll, and is offered two differently styled buttons that reach the same place. Restore the guarded history navigation, or keep one primary action and name the second for the destination it actually reaches. (all)
- **UX-345 · Filter search boxes bypass the shared input primitive** — `src/lib/components/product-catalogue/desktop-filter.svelte:99` and `:203`, `src/lib/components/product-catalogue/mobile-filter.svelte:196` and `:228`, against `src/lib/components/ui/input/input.svelte:12`. The four fields carry a hard-coded grey ring rather than the border token, and the default theme trades their focus ring for a one-pixel border colour change at `desktop-filter.svelte:526`, so the filter rail reads as a different product from the search panel and the checkout forms. Render all four through the input primitive, which both files already import, and delete the `.ed-df__search` and `.ed-mf__search` blocks that re-create it. (all)
- **UX-347 · The pager caps its page window but prints the uncapped total** — `src/lib/components/common/pagination.svelte:123` "Showing page {currentPage} of {noOfPage}", beside a Next button disabled at `cappedNoOfPage` (`:21`, `:114`). On a catalogue past 50 pages a shopper reads "Showing page 50 of 137" while Next is dead, so the pager looks broken rather than deliberately limited. Drive the summary line and the mobile counter at `:105-109` from `cappedNoOfPage`, and extend that same muted line with a short qualifier where the cap bites. (all)
- **UX-349 · Wine cards claim a discount without the price it discounts from, and the payment-failure page styles a class it never renders** — `src/lib/theme/wine/WineHomepage.svelte:246` renders the percentage badge, `:255` renders only the current price, and the `.menu-content del` rule at `:1673` styles a compare-at price the markup never emits; `src/routes/(www)/checkout/failed/+page.svelte:60` uses `item-title` while the stylesheet defines `.item-name` at `:186`; roughly ten further orphaned rules sit across the wine and lime homepages. A wine shopper sees "-44%" with nothing to measure it against, unlike the default, noor and generic cards, and the product name on a failed order renders as plain body text. Add the compare-at price beside the current one under the same `product.mrp > product.price` guard the badge already uses, style the failed-order title with `text-foreground` rather than reviving a hard-coded hex rule, and keep the no-image placeholder rules until the wine card has a real empty state. (wine, lime, all)

### Account and authentication

Every screen in this area works, but almost none of it is built from the design system, so its themes, dialogs, focus handling and empty states all diverge from the rest of the storefront.

#### UX-100 · Form validation errors are not announced

- **Evidence** — `src/lib/components/form/textbox.svelte:76` "touched ? (isValid ? 'border-green-500 focus:border-green-500' : 'border-red-500 focus:border-red-500') : 'border-gray-200'"; `src/lib/components/form/textbox.svelte:96` "{#if (validationError || error) && touched}"; `src/routes/(www)/auth/change-password/+page.svelte:61` "<p class="mt-1 text-sm text-red-500">"; every input probed across the auth and account routes reported no `aria-invalid` and no `aria-describedby`.
- **Impact** — This one field component backs sign-in, sign-up, forgot password, both profile editors and the checkout address form. A screen-reader user who submits an invalid email hears nothing, because the message is an unlinked paragraph and the input never reports itself as invalid.
- **Fix** — Give the message container an id, point `aria-describedby` at it, set `aria-invalid` on the input, and replace the raw red and green borders with the destructive, success and input token utilities already mapped in the Tailwind config.
- **Rule** — 7. Accessibility and performance, "WCAG 2.2 AA. Semantic HTML first; ARIA only when native semantics are insufficient". **Themes** — all. **Verified** — browser.

#### UX-101 · Mobile account drawer does not take focus, tabs backwards and ignores Escape

- **Evidence** — `src/routes/(my)/+layout.svelte:92` "fixed left-0 top-0 z-30 h-full w-[80%] max-w-xs transform  bg-white"; `src/routes/(my)/+layout.svelte:125` "<Button variant="ghost" size="icon""; probed at 390px, focus stays on the trigger, the four links are reachable only by Shift+Tab and in reverse order, Escape leaves the panel open and the page behind it still scrolls; screenshot `account-auth-x-my-drawer-390.png`.
- **Impact** — On a phone this drawer is the only way to move between orders, addresses and profile. Keyboard and screen-reader users tab straight past it into the page it covers, cannot dismiss it with Escape, and hear its trigger announced only as "button".
- **Fix** — Rebuild the panel on the existing sheet primitive, which supplies focus move-in, a focus trap, Escape to close and a scroll lock. Label the trigger, give it expanded and controls state, and raise it to a 44px target on mobile.
- **Rule** — 7. Accessibility and performance, "Visible keyboard focus, logical focus order, dialog focus trapping, Escape-to-close". **Themes** — all. **Verified** — browser.

#### UX-102 · Order detail invents an order for unknown ids and a delivery date for every order

- **Evidence** — `src/routes/(my)/my/orders/[id]/+page.svelte:40` "{:else if order}"; `src/routes/(my)/my/orders/[id]/+page.svelte:93` ": date(new Date(Date.now() + 7 * 86400000).toISOString())"; `src/routes/(my)/my/orders/[id]/+page.svelte:333` "{formatPrice(order?.total, page?.data?.store?.currency?.code)}"; `src/routes/(my)/my/orders/[id]/+page.svelte:372` "{:else}", the branch that never runs because the connector resolves a missing order to an empty object; screenshot `account-auth-x2-_my_orders_ORD1-1280.png`.
- **Impact** — A shopper following a stale or mistyped order link gets a complete order page instead of an error, showing a blank order number, zero items and "Subtotal $undefined". Every real order also carries a green estimated arrival date that no backend supplied and the merchant never promised.
- **Fix** — Gate the success branch on a real order number so the existing empty state renders, show the arrival row only when the backend supplies an estimate, and render missing money as an em dash in muted text.
- **Rule** — 10. Definition of done, "Product data, counts, prices, variants, totals and availability are consistent". **Themes** — all. **Verified** — browser.

#### Medium

- **UX-350 · Reset password has no page shell and confirms the wrong action** — `src/routes/(www)/auth/reset-password/+page.svelte:37`, `:86`. The card sits flush under the sticky header with no heading of any level, and after a new password is set the page says a reset link was emailed and offers to send another. Also reported as UX-372. Wrap the card in the standard page rail, promote its title to a real page heading, and confirm that the password changed with a sign-in action. (all themes)
- **UX-351 · Addresses page shows nothing when the fetch fails** — `src/routes/(my)/my/addresses/+page.svelte:46`. A failed request leaves only the heading and the add button over an empty canvas, with no retry and only a toast that disappears. Add an error branch built from the same block the orders page uses, with a retry button that re-runs the request. (all themes)
- **UX-352 · A second profile route ships beside the real one, and both carry the same broken save bar** — `src/routes/(www)/profile/+page.svelte:57`, `:138`; `src/routes/(my)/my/addresses/[id]/+page.svelte:303`; `src/routes/(www)/+layout.server.ts:6`. Nothing links the older profile page, yet it stays reachable with no account sidebar, and the save bar both pages share is a half-width strip pinned over the sticky header whose easing class Tailwind never emits. Also reported as UX-381, UX-486. Redirect the old route to the account profile, and extract one unsaved-changes bar that uses the page rail, sits below the header and renders inside a conditional block. (all themes)
- **UX-353 · Account navigation targets are 36px tall on mobile** — `src/routes/(my)/+layout.svelte:108`; `src/routes/(my)/my/wishlist/+page.svelte:111`. The four account links, the drawer trigger and the wishlist card actions all fall below the 44px the system asks for on phones, so every mis-tap costs a navigation. Raise them with a height override on the existing button primitive and keep the smaller desktop size. (all themes)
- **UX-354 · Auth pages add a full extra viewport, a gradient and a blurred panel** — `src/routes/(www)/auth/signup/+page.svelte:93`; `src/routes/(www)/auth/forgot-password/+page.svelte:14`, `:65`. Each page wraps itself in a full-height container inside a layout that already has a header and footer, so the card floats in empty grey, framed by a stray border and backed by treatments the storefront uses nowhere else. Give these pages the standard page rail with vertical padding and a card built from the surface, border and radius tokens. (all themes)
- **UX-355 · The auth link wrapper creates two tab stops for one action** — `src/lib/components/auth/auth-button.svelte:31`, `:33`; `src/lib/components/auth/login-modal.svelte:345`. Inside the sign-in dialog a keyboard user hits a generic "Open authentication modal" stop and then the real "Forgot password?" button nested inside it. Where the child is already a button, drop the wrapper and put the click handler on the button itself. (all themes)
- **UX-356 · Buy-again and the exchange action link to routes that do not exist** — `src/routes/(my)/my/buy-again/+page.svelte:31`; `src/routes/(my)/my/orders/[id]/+page.svelte:354`. Every product link on buy-again uses a singular product path that returns 404 and the returns action points at a route that was never built, though neither surface is reachable today. Also reported as UX-357. Correct the product links to the real listing path, and render the returns entry point only when the backend advertises it. (all themes)
- **UX-358 · Closing the auth dialog with Escape leaves its parameters in the URL** — `src/lib/components/auth/login-modal.svelte:195`; `src/lib/components/auth/auth-modal.svelte:66`. Only the close button clears the auth query parameters, so dismissing with Escape or the scrim leaves a URL that reopens the dialog on every reload and for anyone the link reaches. Move the parameter cleanup into the single close callback the modal already passes down. (all themes)
- **UX-359 · Eight account and auth routes have no top-level heading, and the auth dialogs add a second one** — `src/routes/(my)/my/buy-again/+page.svelte:24`; `src/routes/(www)/auth/signup/+page.svelte:96`; `src/lib/components/auth/login-modal.svelte:216`. Users who navigate by heading find nothing on the dashboard, buy-again, the address form and three auth pages, while an open sign-in dialog puts a second document heading over the page behind it. Add one page heading per route using the treatment the orders page already uses, and demote the dialog headings one level. (all themes)
- **UX-360 · The verification failure page keeps the success title and leads nowhere** — `src/routes/(www)/auth/verify/+page.svelte:49`, `:90`. A shopper whose link expired reads a failure message under a browser tab that says verification succeeded, and the only action drops them on the homepage without opening sign-in. Derive the title from the result state, open the sign-in dialog from the failure action, and use the default button variant instead of the purple gradient. (all themes)
- **UX-361 · Account empty states do not agree on whether they offer a way forward** — `src/routes/(my)/my/orders/+page.svelte:117`; `src/routes/(my)/my/addresses/+page.svelte:60`; `src/routes/(my)/my/buy-again/+page.svelte:163`. Orders and wishlist end with a primary button, addresses gives advice and no action, and buy-again shows one bare line of text. Extract the orders empty state into one shared component and use it on every account tab. (all themes)
- **UX-362 · Account lists animate in with a stagger and ignore reduced motion** — `src/routes/(my)/my/orders/+page.svelte:131`; `src/routes/(my)/my/profile/+page.svelte:17`. Order, address and wishlist rows fly in over 400ms with a growing delay and the profile page slides its whole body in over 600ms, which the one reduced-motion rule in the stylesheet cannot suppress. Drop the stagger and gate the remaining transitions on a shared reduced-motion check inside the 120 to 180ms feedback budget. (all themes)
- **UX-363 · Every auth dialog is announced as "Title"** — `src/lib/components/common/modal.svelte:39`, `:100`; `src/lib/components/auth/login-modal.svelte:180`. All three auth dialogs hide the shared header without passing a title, so the accessible name of sign-in, sign-up and password reset is the literal default in all five themes. Also reported as UX-366. Pass a real title from each dialog, or add a labelledby prop that points at the heading each one already renders. (all themes)
- **UX-365 · Loading and empty states borrow each other's visual language** — `src/routes/(my)/my/orders/+page.svelte:110`, `:92`; `src/routes/(my)/my/orders/_OrderListSkeleton.svelte:2`, `:17`. Empty pages pulse as though data were still arriving, the orders list first load is a bare spinner, and the one placeholder is a static grey block of empty headings that matches neither page it stands in for. Also reported as UX-369, UX-379, UX-491. Remove the pulse from the empty states and rebuild the placeholder from the skeleton primitive in the shape of the real order rows. (all themes)
- **UX-367 · Several routes use colour classes the config never defines** — `src/routes/(www)/messages/+page.svelte:221`, `:18`; `src/routes/(my)/my/buy-again/+page.svelte:61`; `src/routes/(www)/order-tracking/+page.svelte:133`. A numeric colour scale that the config does not contain emits nothing, so the unread-message dot is invisible, the chat placeholders have no fill and no height, and prices lose their accent. Also reported as UX-488. Map each occurrence onto the real token utilities and give the placeholder rows a size from the skeleton primitive. (all themes)
- **UX-368 · Order tracking calls every failure an invalid link** — `src/routes/(www)/order-tracking/+page.svelte:343`. A customer whose valid link meets an API failure is told the link is invalid or expired, with no retry, no contact route and a duplicate toast. Separate the error state from the not-found state, keep the feedback inline, and offer a retry action. (all themes)
- **UX-370 · The standalone address form asks shoppers for business details and coordinates** — `src/routes/(my)/my/addresses/[id]/+page.svelte:15`, `:197`, `:225`. It requires a business phone, a latitude, a longitude and delivery instructions, offers three countries with two of them misspelled, and has no save button inside the form. Also reported as UX-487. Redirect the route to the address list and open the existing address modal, so address editing keeps one implementation. (all themes)
- **UX-371 · The password reveal control is a 16px target** — `src/lib/components/form/textbox.svelte:81`; `src/routes/(www)/auth/change-password/+page.svelte:48`. The reveal toggle on every sign-in and sign-up field measures 16 by 16 pixels, below the WCAG minimum, and the three hand-rolled copies on change password have no accessible name. Give the toggle a 44px hit area in the shared field component and reuse that component on change password. (all themes)
- **UX-373 · Store signup reports success when no account was created** — `src/routes/(www)/auth/signup/store/details/+page.svelte:83`. When the API returns no id the user sees an error toast, then a success toast, then the welcome page, and the email they typed is cleared so they cannot retry. Return after the failure, keep the stored email, and show the error inline on the form. (all themes)
- **UX-374 · The account area is painted in raw grey values instead of tokens** — `src/routes/(my)/my/orders/+page.svelte:88`; `src/routes/(my)/my/profile/+page.svelte:81`; `src/routes/(my)/+layout.svelte:92`. Surfaces, borders, body copy and status colours are hard-coded, so the account pages look identical in all five themes while the storefront around them changes, and two different reds sit side by side on the profile page. Swap them for the documented surface, border, text and status tokens, and define the card token in the two theme blocks that currently omit it. (all themes)
- **UX-375 · Account pages stack four extra rails inside the page container** — `src/routes/(my)/my/+page.svelte:41`; `src/routes/(my)/my/orders/+page.svelte:85`; `src/routes/(my)/+layout.svelte:137`. Content starts at a different left edge on each tab, the breadcrumb is hidden above the medium breakpoint, and mobile shows two stacked menu triggers. Delete the per-page maximum widths, let the page container be the only rail, and show the breadcrumb at all widths. (all themes)
- **UX-376 · The dashboard offers a wishlist tile the sidebar has already hidden** — `src/routes/(my)/+layout.svelte:45`; `src/routes/(my)/my/+page.svelte:23`. The sidebar and header menu hide wishlist when the merchant has it switched off, but the dashboard hard-codes the tile, so shoppers follow it to a feature that is not running. Derive all three menus from one shared definition so they cannot disagree. (all themes)
- **UX-377 · The address form captures the browser save shortcut for the rest of the session** — `src/routes/(my)/my/addresses/[id]/+page.svelte:45`. The handler is assigned to the document inside an effect with no teardown, so once the form has been opened, Ctrl or Cmd plus S is swallowed everywhere in the storefront. Register the shortcut with an event listener and return the matching cleanup, as the older profile page already does. (all themes)
- **UX-378 · Dashboard tiles declare hover styles that never fire** — `src/routes/(my)/my/+page.svelte:83`, `:85`. The tiles rely on a group hover the wrapping link never opts into, so the account landing page's only navigation surface gives no hover feedback at all. Add the group class to the link and give the card a hover and focus treatment from the token set. (all themes)
- **UX-380 · Three dialog implementations coexist, and the shared one's width contract is dead code** — `src/lib/components/common/modal.svelte:109`, `:169`; `src/lib/components/ui/dialog/dialog-overlay.svelte:11`; `src/lib/core/components/plugins/enquiry-modal.svelte:86`. A shopper meets three different dialogs in one journey, and the product enquiry one has no dialog role, no focus trap and no Escape. The shared modal's responsive width rules never compile, so the email preview panel shrinks to its content. Also reported as UX-382. Standardise on the shadcn dialog primitive and express width as a documented size prop instead of unused scoped rules. (all themes)

#### Low

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-364 | Forgot password ships a real personal email as its placeholder, and signup is prefilled with real credentials in dev builds | `src/routes/(www)/auth/forgot-password/+page.svelte:76`; `src/routes/(www)/auth/signup/+page.svelte:14` | Use the neutral example address the rest of the auth surface uses, and delete the dev prefill |
| UX-383 | Two vendor signup pages add a second main landmark inside the layout's main | `src/routes/(www)/auth/signup/store/+page.svelte:57`; `src/routes/(www)/auth/signup/store/details/+page.svelte:107` | Delete the role attribute, since the layout already provides the landmark |
| UX-489 | The account breadcrumb turns order ids into page names and links the current page to itself | `src/routes/(my)/+layout.svelte:52`; `src/lib/components/ui/breadcrumb-route.svelte:119` | Let routes supply crumb labels, and render the last crumb as text with a current-page marker |
| UX-490 | The dashboard renders icons with the dynamic component tag the stack contract excludes | `src/routes/(my)/my/+page.svelte:86` | Destructure the icon in the loop and render it directly, as the account layout does |
| UX-492 | The shipped sidebar primitive and its tokens have no call sites while the account area hand-rolls its own nav | `src/lib/components/ui/sidebar/index.ts:26`; `src/routes/(my)/+layout.svelte:92` | Adopt the primitive for the account nav, or remove it and its unused tokens |
| UX-493 | The signup success page greets the shopper by raw email address and hand-rolls its button | `src/routes/(www)/auth/signup/success/+page.svelte:29`, `:57` | Greet by first name or drop the greeting, and use the button primitive with tokens |

### Footer, legal pages and plugins

This is the least maintained surface in the storefront: every page links to policy pages that return 404, the one support form can never send, and two shared components carry another vendor's identity.

#### UX-103 · Contact form and newsletter submit into a backend that cannot accept them
- **Evidence** — `src/routes/(legal)/contact-us/+page.svelte:128` "onsubmit={handleSubmit}"; `src/lib/theme/default/DefaultHomepage.svelte:565` "<form class="ed-news__form" onsubmit={onSubscribe}>" with the write at `:251` "storeService.post('/api/newsletter/subscribe'"; `src/lib/core/connectors/rest-guard.ts:1` "so the call can only fail"; screenshot `footer-legal-plugins-contact-submitted-default-1280.png`.
- **Impact** — A shopper who fills in a valid name, email and message is told "Failed to send message. Please try again later." on every attempt. The wording invites retries that can never succeed, and the homepage newsletter answers a subscribe with a message naming the backend.
- **Fix** — Expose the path check the connector guard already performs as a capability query, and let the contact and newsletter blocks ask it before rendering. Where the write is unsupported, show the email and phone the contact page already derives from the store record, keeping the form and its states for backends that implement the endpoints.
- **Rule** — Section 8, stable master prompt, item 10: keep components reusable, typed and backend-agnostic; section 6, states and feedback. **Themes** — all. **Verified** — browser.

#### UX-104 · Footer links to five policy pages that return 404
- **Evidence** — `src/lib/theme/default/homepage-content.ts:75` "{ label: "Shipping Policy", href: "/shipping-policy" }" and `:85` ""Privacy Policy", href: "/privacy-policy""; `src/lib/components/common/footer.svelte:53` "themeFooterMenu.length ? themeFooterMenu : footerMenu"; `src/routes/(legal)/cms-page-load.ts:14` "error(404, 'Page not found')"; `src/routes/(legal)/contact-us/+page.svelte:204` "<a href="/terms-and-conditions"…>Terms</a>"; screenshot `footer-legal-plugins-about-us-default-1280.png`.
- **Impact** — All five theme servers render these links in the footer of every page, and all five paths return 404. A shopper checking the return window before buying is dropped onto a page with no header, footer or main landmark. The contact form also asks them to agree to terms and privacy pages that will not open.
- **Fix** — Build the footer columns from the menu the connector serves and keep the theme columns only for routes the storefront guarantees. Filter CMS-backed entries against the pages the store actually publishes, and point the consent line at that same filtered set.
- **Rule** — Section 10, definition of done: no new console errors or broken navigation. **Themes** — all. **Verified** — two reviewers.

#### UX-105 · Share sheet posts another merchant's brand and keywords
- **Evidence** — `src/lib/core/components/plugins/share-button.svelte:39` "hashtags=${'zapvi'}&via=${'zapvi'}&related=${'mobile cover, mousepad…'}"; `:138` "hashtags="zapvi""; `:88` "fixed inset-0 z-[9999997] bg-zinc-950/20"; `scratchpad/dev-server.log:1` "share-button.svelte:102 / :164 / :191 Buttons and links should either contain text or have an `aria-label`".
- **Impact** — A shopper sharing any product to X posts it as "#zapvi via @zapvi" with mobile-accessory suggestions, whatever the store sells. The close and copy buttons have no accessible name, and the sheet layers above every other overlay including the auth modal.
- **Fix** — Read the handle and keywords from store social settings or drop them, give the three icon buttons an aria-label, and replace the zinc classes and the arbitrary z-index values with tokens and the layer used by ui/dialog.
- **Rule** — Section 1, project context: treat the demo as one merchant, not the product; section 7, understandable labels; section 2, known foundation gaps: no named z-index scale. **Themes** — all. **Verified** — code.

#### UX-106 · Support chat falls back to another business's account
- **Evidence** — `node_modules/@misiki/kitcommerce-core/dist/components/plugins/store-plugins.svelte:31` "_support.account = …|| 'secretgreen2'" and `:45` "slug: …|| 'secretgreen-chat-slash-contact-form-shoutbox'"; `src/routes/(www)/+layout.svelte:40` and `src/routes/(legal)/+layout.svelte:13` "<StorePlugins />".
- **Impact** — A merchant who switches the chat plugin on before entering an account id gets a live chat bubble on every page. Shopper messages then land in the "secretgreen" inbox, which belongs to a different business.
- **Fix** — Guard the plugin mount in the three layouts so the widget renders only when the store supplies an account id, and file removal of the hard-coded fallback upstream in the core package.
- **Rule** — Section 1, project context: must preserve backend-neutral components; section 8, item 10. **Themes** — all. **Verified** — code.

#### UX-385 · Contact page repaints the body and the colour stays for the session
- **Evidence** — `src/routes/(legal)/contact-us/+page.svelte:249` ":global(body) { background-color: #fafafa; }"; `:51` "min-h-screen bg-[#fafafa]"; probe `footer-legal-plugins-probe.json` "LEAK wine: before rgb(238,238,238) → after rgb(250,250,250), fafafaRuleStillLoaded=true".
- **Impact** — One visit to the contact page changes the canvas of every other page for the rest of the session, measured on wine, default, noor and organic. The page itself also ignores the theme background token, so it reads as a different product on noor's ivory canvas.
- **Fix** — Delete the global body rule and the hex literal, and use bg-background, or bg-muted where a tinted band is wanted.
- **Rule** — Section 3, product direction: brand identity through tokens, not page-specific CSS rewrites; section 4, app.css is the source of truth. **Themes** — all. **Verified** — browser.

Medium

- **UX-384 · "Powered by Litekart" is hard-coded into the shared footer** — `src/lib/components/common/footer.svelte:202`. Every store on every backend tells shoppers it runs on Litekart and links out to a third-party site from every page. Read the credit from store data, style it like the copyright line, and render nothing when the store supplies none. (default, wine, organic)
- **UX-386 · Assistant panel claims to be a modal without behaving like one** — `src/lib/components/chat/conversational-shopping.svelte:193`, `:160`, `src/routes/(legal)/+layout.svelte:13`. Focus never enters the panel, Tab still reaches the page behind it, Escape does nothing, the mobile backdrop is a focusable button, and the widget vanishes on legal and account routes. Rebuild it on the shared Sheet and Dialog primitives, which bring focus trapping, Escape and scroll lock, and mount it once in the root layout. Also reported as UX-404. (all)
- **UX-387 · Blog list hard-codes a US date format and offers no pager** — `src/routes/(legal)/blog/+page.svelte:8`, `:27`, `src/routes/(legal)/blog/+page.ts:7`. Dates ignore the store locale, post images reserve no space so cards shift as they load, and the loader reads a page parameter the template never renders a control for. Format dates with the core helpers, give images an aspect ratio through LazyImg, and add the shared Pagination primitive. (all)
- **UX-388 · CMS text uses prose-lg with no prose base, so lists and links lose their styling** — `src/routes/(legal)/privacy-policy/+page.svelte:20`, `src/routes/(legal)/about-us/+page.svelte:19`, `src/routes/(legal)/p/[slug]/+page.svelte:24`. Policy content written with bullets, headings and links renders as flat paragraphs, so a shopper cannot see which words in the refund policy are links. Add the prose base class with prose-lg as the size modifier, and map the typography colours to the foreground and primary tokens once in tailwind.config.ts. (all)
- **UX-389 · Contact form labels and errors fail contrast, size and association rules** — `src/routes/(legal)/contact-us/+page.svelte:138`, `:149`, `:130`. Labels sit at about 2.5:1 and errors at 3.76:1 in 10px type, no input carries aria-invalid or aria-describedby, and the failure banner has no role, so a screen-reader user hears nothing after submitting. Use the Label and Input primitives with text-sm text-destructive messages bound by aria-describedby, role="alert" on the banner, and focus moved to the first invalid field. Also reported as UX-390. (all)
- **UX-391 · Contact page is a one-off design outside the type, radius and elevation scales** — `src/routes/(legal)/contact-us/+page.svelte:59`, `:122`, `:112`. The title renders at 60px against a 28 to 40px scale, static cards are 24px-rounded with heavy shadows even on the square themes, the copy promises a 24-hour reply no merchant configured, and the success card has no way onward. Rebuild it on the shared scale with rounded-lg borders on bg-card, copy from theme content, and a success state carrying Continue shopping and Send another message buttons. Also reported as UX-495. (all)
- **UX-392 · Enquiry modal is hand-rolled and discards the message when sending fails** — `src/lib/core/components/plugins/enquiry-modal.svelte:86`, `:76`. It has no dialog role, focus trap or Escape, and the finally block closes it on the error path, so the name, phone and message just typed are lost. Replace the overlay with the shared Dialog primitive, close only after success, and label the textarea with the Label primitive. (all)
- **UX-393 · FAQ and blog empty states offer no onward action** — `src/routes/(legal)/faqs/+page.svelte:66`, `src/routes/(legal)/blog/+page.svelte:60`. A shopper who followed FAQs from the footer looking for the returns window reads one grey sentence and has nothing to click next. Give both routes a designed empty state with one or two Button links to contact and the policy pages. (all)
- **UX-395 · Footer newsletter validates by toast and promises a confirmation email it cannot verify** — `src/lib/components/common/newsletter.svelte:23`, `:66`, `src/routes/(www)/subscription-success/+page.svelte:26`. A mistyped address gets only a transient toast, the controls are 40px on phones, and the success screen states an email was sent that depends on the backend list's opt-in setting. Add an inline text-destructive message bound with aria-describedby, use h-11 controls below md, and confirm inline without asserting the email. (default, wine, organic)
- **UX-396 · Two input styles appear side by side because the form wrapper restyles the primitive** — `src/lib/components/form/textbox.svelte:76`. Checkout and auth fields show fixed grey, green and red borders while contact and newsletter fields show the token border and ring, and the mismatch is visible within one page. Let ui/input carry the look and map the wrapper's states to border-destructive and border-success. (all)
- **UX-397 · Legal routes each invent their own rail and double the minimum height** — `src/routes/(legal)/+layout.svelte:17`, `src/routes/(legal)/privacy-policy/+page.svelte:13`, `src/routes/(legal)/faqs/+page.svelte:38`. Content sits on 768px, 896px, 1152px or 1280px rails instead of the 1216px rail the header and footer use, and stacked full-screen sections leave about 700px of blank canvas above the footer. Drop min-h-screen from the layout and the pages, and put every route on .page-width with a reading measure inside it. (all)
- **UX-398 · Legal headings and titles are inconsistent in case, size and SEO wiring** — `src/routes/(legal)/terms-and-conditions/+page.svelte:16` "<h1>TERMS</h1>" against `:10` "<title>Terms & Conditions</title>"; `src/routes/(legal)/faqs/+page.svelte:39`; `src/routes/(legal)/blog/+page.svelte:19`. A shopper who clicks "Terms & Conditions" in the footer lands on a page headed "TERMS", and six legal pages present six different heading treatments. Use one legal page header component with sentence-case titles from the CMS record, and SeoHeader on every route. Also reported as UX-399. (all)
- **UX-400 · Legal pages paint a grey, zinc and blue palette that no theme defines** — `src/routes/(legal)/privacy-policy/+page.svelte:18`, `src/routes/(legal)/faqs/+page.svelte:47`, `src/routes/(legal)/blog/[slug]/+page.svelte:96`. On lime and noor the policy pages still show white cards, grey borders and blue links, so a merchant's palette stops at the pages that carry their policies. Swap them for bg-card, border, text-foreground and text-primary, with radii taken from the token scale. (all)
- **UX-401 · Footer has no surface and no top border on organic and wine** — `src/lib/components/common/footer.svelte:82`, `:239`. The footer computes to a transparent background with no rule above it, so the link columns read as one more page section rather than the end of the document. Move a token background and hairline onto the element for every theme, leaving the editorial class to override the exact values. (organic, wine)
- **UX-402 · Payment icons are a fixed four-brand set shown at 40% opacity** — `src/lib/components/common/footer.svelte:20`, `:217`. Every store claims to accept Mastercard, PayPal, Skrill and Visa whatever it has configured, and the 20px greyscale marks are too faint to work as trust evidence. Build the row from the payment methods the connector serves, render at full opacity with width and height set, and omit it when none are configured. (default, wine, organic)
- **UX-403 · Shopping assistant hard-codes a jewellery script into a shared component** — `src/lib/components/chat/conversational-shopping.svelte:33`, `:205`. A shopper of wine or groceries opens the assistant and is told to find the perfect ring for their special day, with chips about metal and ring size. Move the heading, intro line and chips into store or theme content with neutral defaults. (all)
- **UX-405 · Chat panel sets the delivery promise and quick replies at 10px** — `src/lib/components/chat/conversational-shopping.svelte:208`, `:339`, `tailwind.config.ts:143`. The most decision-relevant line in the panel is smaller than any other text in the storefront, and the chips are about 26px tall. Move this text to text-xs, the delivery line to text-sm, and pad the chips to clear the mobile target size. (all)
- **UX-406 · Contact page leaves half the screen empty when no contact details are configured** — `src/routes/(legal)/contact-us/+page.svelte:68`. With no email, phone or address on the store record the left column collapses to a headline and one sentence beside the form. Design the empty branch: drop to a single centred column at the form's width and add one line pointing to FAQs or order tracking. (all)
- **UX-407 · Lime footer ships open then collapses at hydration, jumping the page** — `src/lib/theme/lime/LimeFooter.svelte:15`, `:17`. Every column renders open in the server HTML and closes the moment the client runs, so a phone user reaching for a policy link has it move several hundred pixels. Render the accordions closed and open them from the desktop media query, or make the open state CSS-only. (lime)
- **UX-408 · Noor footer wordmark is overridden and renders as muted body text** — `src/lib/theme/noor/NoorFooter.svelte:23`, `:74`. The paragraph rule outranks the wordmark class, so the brand name at the foot of every page is smaller and fainter than the column labels beside it. Scope the paragraph rule to the description it was written for so the wordmark keeps its heading treatment. (noor)
- **UX-409 · Lime and noor footers drop the newsletter, social, payment and trust blocks** — `src/lib/components/common/footer.svelte:59`, `src/lib/theme/noor/NoorFooter.svelte:17`. A merchant who switches to either theme silently loses email capture, social links, payment evidence and the footer HTML they configured, and noor has no copyright line at all. Keep the shared footer as the shell and let the theme footers supply only the column layout. (lime, noor)
- **UX-410 · WhatsApp button never renders on phones** — `src/lib/core/components/plugins/whatsapp-chat-button.svelte:23`. The channel most mobile shoppers use is hidden below 768px, and the button sits at an arbitrary z-index unrelated to the other floating layers. Show it at every viewport with the shared floating-widget offset and a z-index from the named scale. (all)
- **UX-411 · Widget and page animations ignore reduced-motion preferences** — `src/lib/core/components/plugins/whatsapp-chat-button.svelte:36`, `src/routes/(legal)/contact-us/+page.svelte:57`, `:105`, `src/lib/components/common/newsletter.svelte:111`. A visitor who asked for less motion still gets an overshooting bounce, two columns sliding in over 600ms, and a success tick that pulses without end. Wrap the CSS animations in the guard the newsletter already uses and gate the Svelte transitions on a shared reduced-motion store. (all)

Low

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-394 | Footer column headings are h4, so the outline jumps from h1 | `src/lib/components/common/footer-menu.svelte:11` | Render them as h2 and keep the small uppercase look in classes. |
| UX-494 | Legal layout omits the skip link the storefront layout provides | `src/routes/(legal)/+layout.svelte:13` | Move the skip link into the root layout so every route group shares it. |
| UX-496 | Copyright has a stray space before the period and reads out the build stamp (also reported as UX-501) | `src/lib/components/common/footer.svelte:195`, `:208`, `src/lib/theme/lime/LimeFooter.svelte:61` | Render the sentence as one text run and move the stamp to a data attribute or an HTML comment. |
| UX-497 | Social links are named by their raw config key, use nofollow instead of noopener, and emit an empty focusable anchor for unmapped keys (also reported as UX-502) | `src/lib/components/common/footer.svelte:115`, `:117`, `:173` | Label each link from a key-to-name map, render only keys with an icon, pad targets to 44px, and use rel="noopener noreferrer". |
| UX-498 | Lime and noor footers hard-code palette, spacing and their own 1360px rail | `src/lib/theme/lime/LimeFooter.svelte:65`, `src/lib/theme/noor/NoorFooter.svelte:44` | Express the footer surfaces as theme tokens in app.css and lay the inner grid on .page-width. |
| UX-499 | Lime accordion plus-icon rules never match, so the icon shows on desktop and never rotates | `src/lib/theme/lime/LimeFooter.svelte:140` | Reach the icon through :global() or a wrapping span, or rebuild the columns on ui/collapsible. |
| UX-500 | Mobile footer collapse toggle exposes no expanded state | `src/lib/components/common/footer.svelte:85` | Use the Collapsible primitive, which sets aria-expanded and aria-controls. |
| UX-503 | Merchant footer HTML renders full bleed outside the container rail | `src/lib/components/common/footer.svelte:73` | Wrap the sanitised HTML in the same rail as the footer columns. |

### Other: shared forms, checkout chrome and breadcrumbs

Shared chrome outside the product flow works but skips accessibility basics, and breadcrumbs ship in two competing implementations while the shadcn primitives sit unused.

#### UX-412 · Checkout field errors are not linked to the input they describe
- **Evidence** — `src/lib/components/form/textbox.svelte:64` "<Input {...props} id={inputId} {type} bind:value"; `src/lib/components/form/textbox.svelte:99` "<p class="text-sm font-medium text-destructive">"; `scratchpad/shots/checkout-run-flow-report.json` "fields[].ariaInvalid: null, describedby: null on every input in the address-invalid step".
- **Impact** — A screen-reader shopper whose phone number is rejected hears only the label and "required". The reason for the rejection is never announced, so the address step cannot be finished without sighted help.
- **Fix** — Set aria-invalid on the shared Input primitive once the field is touched and invalid. Give the destructive error paragraph an id derived from the input id, and point aria-describedby at it.
- **Rule** — 7 Accessibility and performance, "WCAG 2.2 AA. Semantic HTML first; ARIA only when native semantics are insufficient". **Themes** — all. **Verified** — code.

#### UX-414 · Checkout progress steps fail contrast, target size and step semantics
- **Evidence** — `src/lib/components/checkout/checkout-header.svelte:65` "step === 3 ? 'text-primary' : 'text-gray-400'"; `src/lib/components/checkout/checkout-header.svelte:25` "flex h-7 w-7 items-center justify-center rounded-full border"; `src/lib/components/checkout/checkout-header.svelte:19` "flex h-auto items-center p-0 font-normal disabled:opacity-100"; `src/lib/components/checkout/checkout-header.svelte:62` "disabled={true}"; `scratchpad/shots/checkout-probe-report.json` "stepPayment color rgb(156,163,175) on white ratio 2.54"; screenshot `checkout-run-payment-360.png`.
- **Impact** — Steps the shopper has not reached render as grey text at 2.54:1, below the AA minimum. On a 360px phone each step collapses to a 28px circle, and those circles are the only route back from payment to the cart. Assistive technology announces four buttons, two of them permanently disabled, with no marker for the current step.
- **Fix** — Render the row as an ordered list with aria-current on the active step, and replace the grey literals with the muted-foreground and border tokens. Pad the navigable steps to a 44px hit area, and render non-navigable steps as plain list text instead of disabled buttons.
- **Rule** — 7 Accessibility and performance, "Sufficient text, icon, border and focus contrast" and "Pointer targets meet WCAG minimums; about 44px for important mobile actions"; 4 Implementation architecture, "Foundation tokens". **Themes** — all. **Verified** — code.

**Medium**

- **UX-413 · Checkout fields show an error on the first keystroke** — `src/lib/components/form/textbox.svelte:28` "validateOnChange = true". Typing one letter into First name paints the field red, so every checkout field reads as rejecting correct input mid-entry. Validate on blur and on submit, keep the existing red and green border treatment, and re-enable live validation only after a field has already failed once. (all)
- **UX-415 · Two hand-built breadcrumbs compete while the shadcn breadcrumb primitives sit unused** — `src/lib/components/ui/breadcrumb.svelte:32`; `src/lib/components/ui/breadcrumb-route.svelte:84`; `src/lib/components/ui/breadcrumb/index.ts:1`. Moving from a category listing to the account area swaps link colours, mobile treatment and current-page semantics, and a blank entry in the hierarchy makes the listing version truncate the wrong crumb or render a bar holding only Home. Rebuild both on the dormant breadcrumb primitives behind one wrapper that takes an items array, derive the outer guard and the truncation index from the same filtered list, and move the grey literals onto the muted-foreground and foreground tokens. (all)

**Low**

| id | Finding | Location | Fix |
| :-- | :-- | :-- | :-- |
| UX-504 | The shadcn config records the token stylesheet with a Windows separator, so the CLI cannot find it on macOS or Linux | `components.json:6` | Change the value to `src/app.css`, matching every other path in the file |

## Design plan

Scope: the foundation slice lands first and alone; the five vertical slices then consume it. Nothing here changes a route, a query parameter, a `data-testid`, an SEO/analytics component, a connector import, or the `data-theme` wrapper — see **What must not change**.

---

### Foundation slice

Two files carry almost all of it: `D:/lk/svelte-commerce/src/app.css` (six palette blocks: `:root` 30-75, `[data-theme='default']` 77-123, `wine` 125-154, `organic` 156-180, `lime` 182-208, `noor` 210-230) and `D:/lk/svelte-commerce/tailwind.config.ts` (`theme.extend`, which today defines `spacing`, `borderColor`, `colors`, `borderRadius`, `keyframes`, `animation`, `boxShadow`, `backdropBlur`, `fontSize` — and no `zIndex`, `transitionDuration` or `transitionTimingFunction`).

#### F1 — `--warning` / `--warning-foreground` (UX-263, UX-327, UX-096, UX-068)

- `src/app.css`: add `--warning` / `--warning-foreground` to all six blocks, each pair chosen to clear 4.5:1 on that theme's canvas. `--warning` currently computes to an empty string on all five running theme servers.
- `tailwind.config.ts`: add a `warning` entry in `theme.extend.colors` beside `success` and `destructive`, in the same `hsl(var(--warning) / <alpha-value>)` form.
- **Additive.** Nothing renders differently until the 33 raw amber/yellow/orange utilities on `src/routes/(www)/checkout/{cart,payment}`, `src/lib/components/common/status-cell.svelte` and `src/routes/(my)/my/orders/+page.svelte` are migrated in slices 4 and 5.
- Same pass, **alters rendering**: `--success: 142 65% 36%` measures 3.73:1 both ways; darken it. That changes the discount badge in `product-card.svelte:146` and the coupon row in `checkout/cart:172` in every theme (UX-263).

#### F2 — `--primary-hover` (UX-121, UX-039, section 2 token table)

- `src/app.css`: one `--primary-hover` per block; lime's existing `--lime-wine` is its value, organic's is derived from the darkened `--primary` in F8.
- `tailwind.config.ts`: `primary: { DEFAULT, foreground, hover }`.
- **Additive.** `hover:bg-primary/90` call sites keep working; migrate them per slice. It also gives the six private per-theme colour vocabularies (`--wine-*`, `--ed-*`, `--lime-*`, `--noor-*` and the local re-aliases in `LimeHomepage.svelte:192-194` / `NoorFooter.svelte:45-47`) a semantic target to fold into (UX-121, UX-014).

#### F3 — motion-duration tokens (UX-163, UX-124, UX-267)

- `src/app.css`: replace the dead `--transition-duration: 0.3s` and `--ease` at lines 67-68 (zero consumers) with `--duration-fast: 150ms`, `--duration-panel: 220ms`, `--ease-standard`, `--ease-emphasized`.
- `tailwind.config.ts`: `theme.extend.transitionDuration` and `transitionTimingFunction` so `duration-fast` / `duration-panel` / `ease-standard` become utilities. Also define `ease-out-expo` and `shadow-3xl` or delete their five call sites — both are used and defined nowhere, so the cart drawer at `cart-sidebar.svelte:132` currently renders with `boxShadow: none` (UX-124, UX-267).
- **Additive at the token layer; alters rendering at every migrated call site.** 25 distinct hand-written CSS durations plus `duration-300` ×50, `duration-200` ×22, `duration-500` ×20 collapse onto two values; the cart drawer and mega-menu drop from 500ms to 220ms.

#### F4 — `prefers-reduced-motion` (UX-098, UX-042, UX-097, UX-306, UX-411, UX-113, UX-168, UX-286)

- `src/app.css`: one global `@media (prefers-reduced-motion: reduce)` block written to win on specificity — a `*` selector loses to `.ed.is-in .ed-hero__body > *` (0,2,0), which is exactly why the existing hero override at `DefaultHomepage.svelte:1365` fails and 6 animations still run under emulation. Use `*, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important }` plus `html { scroll-behavior: auto }`, and cover `.animate-spin/-bounce/-ping/-pulse`.
- Per-theme blocks in `src/lib/theme/{wine,organic,lime,noor}/*.svelte` — `prefers-reduced-motion` appears in exactly two files under `src/lib/theme` today. Wine's seven infinite animations and its 28s ticker also need a pause control (WCAG 2.2.2), built from `ui/button` with `aria-pressed` toggling `animation-play-state`; do not delete the rotation.
- **Alters rendering for reduced-motion users only.** No visual change for anyone else.

#### F5 — named z-index scale (UX-340, UX-117, UX-236, UX-242, UX-267, UX-201, UX-105, UX-382, UX-442)

Eleven distinct arbitrary values are live: `z-[60]`, `z-[80]`, `z-[100]` ×5, `z-[110]`, `z-[1000]`, `z-[1000001]` ×2, `z-[9999997]` ×3, `z-[9999998]`, `z-[10000000]` ×2, `z-[10000001]`, `z-[1000000000]`, plus `z-index: 9999` in `mega-menu.svelte:256`. The comment at `src/routes/(www)/+layout.svelte:23-24` documents the bidding war.

- `src/app.css`: `--z-sticky`, `--z-overlay`, `--z-drawer`, `--z-modal`, `--z-popover`, `--z-toast`, `--z-skip` on `:root`. Custom properties are required, not optional: `mega-menu.svelte:256`, the `LimeNav`/`NoorNav` rules and `common/modal.svelte:45` (`zIndex = 1000000` as an inline-style default) are in `<style>` blocks or JS and cannot take a utility class.
- `tailwind.config.ts`: `theme.extend.zIndex` derived from the same properties.
- Apply across `nav.svelte`, `mega-menu.svelte`, `ms-search.svelte`, `cart-sidebar.svelte`, `LimeNav.svelte`, `NoorNav.svelte`, `mobile-filter.svelte`, `form/select.svelte`, `share-button.svelte`, the layout skip link, and lift `src/lib/components/ui/{dialog,sheet,drawer,popover,dropdown-menu}/*` off their fixed `z-50`.
- **Alters rendering — deliberately.** Today every accessible dialog sits at 50 while the hand-rolled cart drawer sits at 10,000,000, so a dialog opened over the drawer paints behind it; the skip link needed 10,000,001 to be reachable. Lime's header also moves from `z-index: 20` to the same header level as the other four themes.

#### F6 — radius policy that keeps square themes square (UX-172)

The config comment already states the intent; the wiring is half-done. 198 `rounded-full`, 3 `rounded-2xl`, 3 `rounded-3xl`, one `rounded-t-[2rem]` and 33 raw `border-radius: 999px|50px|50%|30px` declarations never consult `--radius`, so lime and noor — themes whose whole argument is squareness, to the point that `app.css:351` forces `border-radius: 0` on every image — still render pill wishlist buttons, filter chips, steppers, badges and share sheets.

- `src/app.css`: split `--radius` into the three documented steps, `--radius-control: 8px` / `--radius-card: 12px` / `--radius-surface: 16px`, all `0px` in wine, lime and noor. This also fixes organic, where `--radius: 16px` makes the derived `rounded-sm` (12px) larger than the intended card radius.
- `tailwind.config.ts`: map them as `control` / `card` / `surface` in `theme.extend.borderRadius`; **keep `radius: 'var(--radius)'`** as an alias so the 49 existing `rounded-radius` call sites are untouched.
- **Config change is additive; replacing the 198 `rounded-full` and 33 raw radii alters rendering on wine, lime and noor** (round → square) and on organic (size shifts). Pill styling becomes a per-theme opt-in, not a hard-coded default.

#### F7 — one focus-ring contract (UX-287, UX-342, UX-055, UX-146, UX-160, UX-168, UX-224)

Two contracts run side by side in one tab sequence: the global rule at `src/app.css:277-279` is `@apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background`, while every shadcn primitive ships `focus-visible:ring-1 focus-visible:ring-ring`.

- `src/app.css:278` → `ring-2 ring-ring ring-offset-2 ring-offset-background`, so the token the design system names as `focus` is the one that drives it.
- Strip the `focus-visible:ring-1 focus-visible:ring-ring` fragments from `src/lib/components/ui/{button,input,select/select-trigger,checkbox,radio-group,badge,input-otp,resizable}/*.svelte` so primitives inherit the global ring.
- Remove the suppressors: `box-shadow: none` on `:global([data-theme='default'] .ed-lh__select button)` in `listing-header.svelte` (scope it to `:not(:focus-visible)`), `focus-visible:ring-0` in `ms-search.svelte`, `outline: none` in the organic/wine/default newsletter fields, `transition: all` on the four organic declarations (lines 420, 595, 641, 773 — it fades the ring in over ~300ms), and `overflow-hidden` clipping on the generic card.
- **Alters rendering wherever focus is visible**, in every theme. This is the one change that touches every interactive element.

#### F8 — per-theme contrast (UX-039, UX-099, UX-337, UX-342, UX-263)

| Token | Measured | Fix |
| :-- | :-- | :-- |
| organic `--primary` `104 38% 51%` | 2.60:1 with white; announcement bar 2.58:1, hero CTA 2.59:1, PLP Apply 2.58:1 | darken until white clears 4.5:1 |
| organic `--ring` (same triplet) | 2.58:1 vs canvas | darken until 3:1; do **not** repurpose `--accent`, organic already uses `74 47% 52%` |
| `--border` | default 1.24, wine/`:root` 1.22, organic 1.25, lime 1.68, noor 1.36 | see below |
| `--input` | wine 1.38, organic 1.38 | raise to ≥3:1 per theme (WCAG 1.4.11 applies to control boundaries) |

Do not blanket-darken `--border`: `app.css:237` sets `border-color` on the universal selector, so it paints every card outline, table rule and divider, and heavy hairlines everywhere fights the section 3 direction. Raise `--input` only, add one `--border-strong` token in `src/app.css` plus its `tailwind.config.ts` mapping for boundaries that identify a control, and delete the `border-gray-200` default in `form/textbox.svelte:76` and the four `border-gray-200` rules in `desktop-filter.svelte` (59, 195, 289, 349) so fields fall back to `border-input`. **Alters rendering in every theme.**

#### F9 — themed tokens must reach bits-ui portals (UX-075, UX-086, UX-089, UX-330, UX-338, UX-339)

Every per-theme token is declared on the `[data-theme='…']` wrapper `<div>` opened at `src/routes/+layout.svelte:147` — which is *inside* `<body>`. Every bits-ui portal (Dialog, Sheet, Drawer, Popover, DropdownMenu, Tooltip, Select/Command list) is appended to `document.body`, i.e. above that wrapper, so it resolves `:root` instead. `:root` doubles as the wine palette, so on the navy default theme the checkout address dialog renders with `--primary: 4.1 81.7% 50.6%` (red `Save Contact`, red `Delete Address`), `--radius: 0px` against the page's 4px, and a `#eee` surface against white.

- Fix: **mirror the same `data-theme` value onto `<html>`** via `handle` / `transformPageChunk` for SSR plus the existing runtime switch, and **keep the wrapper attribute** — UX_SYSTEM §1 lists "runtime theme switching (`data-theme` on the root wrapper)" under Must preserve. The existing `[data-theme='…']` blocks then match the document root and body, every portal and any future one inherit for free. This is preferred over passing `to` on each `Dialog.Portal`, which would need repeating in `dialog-content.svelte`, `sheet-content.svelte` and `drawer-content.svelte` and would still miss popovers and dropdowns.
- Same defect, separate fix: `<Toaster position="top-center" />` at `src/routes/+layout.svelte:172` sits *outside* the wrapper (`</div>` closes at :171). Move it inside, and import it from `$lib/components/ui/sonner` rather than `@misiki/kitcommerce-core` — the themed wrapper already exists in the repo and is never imported. Add `group-[.toaster]:rounded-radius`; no new token needed.
- **Alters rendering of every dialog, sheet, drawer, popover, dropdown, tooltip and toast in every theme except wine.** It also fixes the global body font: `app.css:245-247` sets `body { font-family: var(--font-body) }` above the themed div, so anything outside the wrapper currently renders in wine's Poppins.

#### F10 — primitive consolidation the slices depend on

| Work | File | Additive / alters | Closes |
| :-- | :-- | :-- | :-- |
| One `Spinner` on `@lucide/svelte` `LoaderCircle`, sized on the token scale; replace `LoadingDots` (measured 0.38px across inside `CheckoutButton`) and the 43 KB GIF at its **app-owned** call sites | `src/lib/components/common/spinner.svelte` (new), `buttons/checkout-button.svelte`, `checkout/{cart,address,payment}`, `address-form-modal.svelte`, `pincode-check.svelte` | alters | UX-077, UX-289, UX-478 |
| Dialog/sheet close target `h-11 w-11 md:h-9 md:w-9` around the 16px glyph; swap `focus:` for `focus-visible:` | `ui/dialog/dialog-content.svelte`, `ui/sheet/sheet-content.svelte` | alters | UX-240 |
| Adopt `ui/select` (bits-ui) for plain option lists; keep `form/select.svelte` only as the searchable variant, built on it, with `size`/`variant` props and a `Label for` | `ui/select/*`, `form/select.svelte` | alters | UX-180, UX-201, UX-322 |
| Let `ui/input` carry the look inside `form/textbox.svelte`; add `aria-invalid` + `aria-describedby`; lift the `touched` gate so an externally supplied `error` renders | `form/textbox.svelte`, `ui/input/input.svelte` | alters | UX-100, UX-396, UX-412 |
| Standardise on `ui/dialog`; port `common/modal.svelte`'s history handling into `dialog-root.svelte` and rewrite it in runes | `common/modal.svelte`, `ui/dialog/dialog-root.svelte`, `plugins/enquiry-modal.svelte` | alters | UX-382 |
| Adopt `shadow-z-1/z-2/z-10` as the only elevation steps; retire `shadow-sm` ×89 / `shadow-2xl` ×20 | `tailwind.config.ts` + call sites | alters | UX-124 |
| `LazyImg` error branch: stop the pulse, render the shared empty surface at the reserved size, including for `priority` images | `src/lib/core/components/image/lazy-img.svelte`, `empty-image.svelte` (`bg-gray-100` → `bg-muted`) | alters | UX-056, UX-059 |
| Strip the 239 `dark:` utilities across 28 files (concentrated in nine auth/account files); keep `darkMode: ['class']` with its comment as the guard | `auth/*`, `(my)/my/addresses/[id]`, `listing-*`, PDP sections | additive to the shopper, removes dead CSS weight | UX-192 |
| Delete `--shadow-default`, `--container-width`, `--heading-font`, `.inter-pt`, the unreachable `[data-theme='default']` `--wine-*` overrides at `app.css:92-99`, and `src/routes/styles.css` (imported by nothing) | `src/app.css`, `src/routes/styles.css`, `tailwind.config.ts` | additive | UX-483, UX-485 |

---

### Vertical slices

Ordered by shopper impact: correctness of the purchase first, then the two discovery gates, then the two commit steps.

---

#### 1. Product detail page — buy box and variant selection

```text
Apply the Svelte Commerce UX master prompt to the product detail route (src/routes/(www)/products/[slug]).
Audit the current experience first, then improve it using the shared design system.
Preserve all existing functionality and API behavior.
Focus this iteration on: variant selection correctness and state, the buy-box hierarchy (name, price, availability, CTA), add-to-cart feedback, and the mobile Add to Cart bar.
```

**Why first:** it holds three of the five Critical findings and is the only place a shopper can be charged for something they did not choose.

**Closes:** UX-002, UX-003, UX-004 (Critical) · UX-060, UX-061, UX-062, UX-063, UX-064, UX-065, UX-066, UX-067, UX-068, UX-069, UX-070, UX-071 · UX-234, UX-236, UX-238, UX-241, UX-242, UX-243, UX-244, UX-245, UX-246, UX-249, UX-250, UX-251, UX-253, UX-256, UX-258, UX-259, UX-260, UX-262, UX-325 · UX-452, UX-453, UX-455, UX-457, UX-458.

Two of the three Criticals originate in `@misiki/kitcommerce-core` (`use-product.svelte.js:188/376`), which §2 marks not editable here. The in-repo landing points are `src/lib/core/connectors/gocommerce.ts` (normalise variant and option-value ids to strings, since the connector keeps numeric ids and the URL value is a string, so the `find()` never matches) and a derived read of `page.url.searchParams` in the buy-box components; the `String(v.id) === variantId` comparison and the "stop re-running `mount()` on every same-route navigation" change go upstream.

**Hierarchy:** gallery → `<h1>` product name (`page.data.product.title`, not `productState.title` — the server already sends the right value and hydration replaces it ~2.5s later) → variant sub-label in the existing `.edp-subtitle` treatment → price + tax note, rendered only when `page.data.store.currency.includesTax` → availability line → option groups → primary Add to bag + wishlist → delivery/returns → collapsible specs/description/shipping → related products.

**Reuse:** `ui/badge` (availability), `ui/button`, `ui/skeleton`, `ui/dialog` (the lightbox, for focus trap, Escape and scroll lock), `ui/collapsible` (replacing the hand-rolled spec/description toggles), `ui/drawer` + `ui/popover` (option pickers for large sets), `ui/carousel`, `EmptyImage`, `Spinner` (F10).
**Add:** one shared `VariantOptionGroup` consumed by both `product-variation.svelte` and `product-aggregation.svelte` (today a second, less accessible copy of the same row); `AvailabilityLine` with `aria-live`; `StickyBuyBar` driven by an IntersectionObserver on the in-flow CTA.

**Responsive:**

| Width | Behaviour |
| :-- | :-- |
| 360 / 390 | Single column. Gallery in a reserved 1:1 box; CDN render sized to the slot, not the fixed 1280 it requests today. `ProductCartAndWishlistButtons` rendered **in flow** under the option groups (drop `hidden … sm:flex`) at 44px. The sticky bar becomes a fixed bottom layer revealed only after that CTA leaves the viewport, with matching bottom padding on the page; the chat launcher lifts above it below `sm`. Pagination dots get a 24px hit area. |
| 768 | Still single column (the 50/50 grid at this width squeezes both halves). Gallery capped at 560px and centred; buy box full rail width. |
| 1024 | Two columns, gallery ~55% / buy box ~45%. Buy panel becomes genuinely sticky — `top-28` currently sits on a statically positioned column. Sticky bar not rendered. |
| 1280 / 1440 | Same two columns inside `.page-width` (theme `--container-max` 1240–1600). Gallery `sizes` matched to the real column, so the 1280 render is only requested at 1280+. |

**States:** pills — default, hover, selected (`bg-primary text-primary-foreground border-primary`), unavailable (`opacity-50 line-through` + `disabled`), focus-visible (keep the DOM node: drop the `{#key}` wrapper that destroys the activated button and throws focus to `<body>`), and *enabled on the server* (today `selectable` is set only by a client `$effect`, so SSR ships every size and colour struck through — the universal "sold out" signal — until T+2543ms, and permanently without JS). CTA — idle, loading (spinner + "Adding…" + `aria-busy`), success (brief "Added" in `text-success`, not `bg-green-600`), disabled with a stated reason, error via the shared sonner toast on mobile. Availability — in stock / only N left (`--warning` from F1) / out of stock, announced politely. Gallery — empty (`{:else}` → `EmptyImage` in the same aspect box), image error, video without autoplay under reduced motion. Related products — card skeletons, not the bespoke spinner with a non-existent class.

---

#### 2. Header search entry and the search overlay

```text
Apply the Svelte Commerce UX master prompt to the header search components (src/lib/components/nav/ms-search.svelte, ms-search-renderer.svelte and the header action row in nav.svelte, LimeNav.svelte, NoorNav.svelte).
Audit the current experience first, then improve it using the shared design system.
Preserve all existing functionality and API behavior.
Focus this iteration on: making search reachable on every theme and viewport, sending submit to a route that renders results, useful autocomplete content, and the overlay's dialog contract.
```

**Why second:** search does not exist on this store at all, and where it does exist the only submit gesture lands on a 404 — the discovery path to every product is closed before the catalogue matters.

**Closes:** UX-001 (Critical) · UX-006, UX-010, UX-011, UX-013, UX-015, UX-016, UX-018, UX-019, UX-020, UX-021 · UX-111, UX-114, UX-126, UX-129, UX-137, UX-138, UX-144, UX-146 · UX-427, UX-476.

Three separate defects compound: the trigger is gated on a static-store flag that ships `false` (`src/lib/core/connectors/default-store.json`, `static-store.ts`), Enter runs `goto('/' + toSlug(search))` which 404s for anything that is not a category slug, and the panel sends `query` while the GoCommerce connector reads `q`, so every keystroke returns the same unfiltered eight products. The third must be fixed in `src/lib/core/connectors/gocommerce.ts` or upstream — not by passing `{ query, q }` from the shared component, which would hard-code one connector's spelling into backend-neutral UI.

**Hierarchy:** header utility row — logo · (md+) category row · search · wishlist · account · cart, every action on the `Button variant="ghost" size="icon"` footprint. Overlay — labelled input, then `Command.Group`s: Recent searches (localStorage, with a visible clear control) → matching categories → a few products → a persistent "See all results for X" row pointing at `/products?search=<term>`.

**Reuse:** `ui/command` (`Command.Dialog/Input/List/Group/Item` — already vendored, unused), `ui/dialog`, `ui/button`, `ui/skeleton`, `$lib/actions/dialog.ts`.
**Add:** one `SearchTrigger` consumed by `nav.svelte`, `LimeNav.svelte` and `NoorNav.svelte`, so the entry point cannot drift per theme. `bottom-nav.svelte` is dead code (no importer) — do not add a Search item there expecting a shopper to see it.

**Responsive:**

| Width | Behaviour |
| :-- | :-- |
| 360 / 390 | Trigger 44×44 in the action row (today 36×20). Overlay full-screen; input 44px; results scroll; "See all results" pinned at the bottom edge. The listing header must keep the persistent logo + menu + search instead of swapping the whole row for a `history.back()` chevron that navigates to `about:blank` on a deep link. |
| 768 | Hamburger and inline links must agree — today the hamburger hides at `md` and the inline links appear at `lg`, so 768–1023 has no navigation at all on default/wine/organic. Render the category row from `md`. Overlay: centred dialog, 640px, backdrop. |
| 1024 | Inline search field visible in the utility row; panel anchored beneath it, max 720px. |
| 1280 / 1440 | Same; panel width fixed so it does not track the rail. |

**States:** idle (recent + popular, both labelled — the empty-query state currently drops the shopper into three unexplained products), typing (debounced, skeleton rows of the **panel's** height so it stops resizing by 114px per keystroke), results, zero results with the See-all row still offered, error, and the full dialog contract: focus moves in, is trapped, Escape closes from anywhere in the panel, focus restores to the trigger, body scroll locks. The mobile nav drawer gets the same treatment via `use:dialog` — today `role`, `aria-modal`, `tabindex` and `aria-labelledby` are all null and the first three Tab presses walk the header *behind* it.

---

#### 3. Product listing — filters, sort, chips and loading

```text
Apply the Svelte Commerce UX master prompt to the product-list route.
Audit first, then improve filter usability, product-card scanability, loading states, and mobile filter/sort behavior.
Preserve current URLs, query parameters, analytics, and backend adapters.
```

**Why third:** once search works, the listing is where a shopper narrows and compares, and today applying a mobile filter destroys the result set.

**Closes:** UX-019, UX-046, UX-047, UX-048, UX-049, UX-050, UX-051, UX-052, UX-053, UX-054, UX-055, UX-056, UX-057, UX-058, UX-059 · UX-094, UX-095 · UX-193, UX-194, UX-195, UX-196, UX-197, UX-198, UX-199, UX-200, UX-203, UX-204, UX-205, UX-206, UX-207, UX-209, UX-210, UX-211, UX-213, UX-214, UX-215, UX-216, UX-218 · UX-219, UX-220, UX-221, UX-222, UX-223, UX-224, UX-225, UX-227, UX-229, UX-230, UX-232, UX-233 · UX-022, UX-345.

Two of these are data-destroying and go first: `handleApply` re-writes every query parameter through `encodeURIComponent` before `searchParams.set` (which encodes again), so `/products?search=gift%20card` becomes `?search=gift%2520card` and the grid empties; and `syncFromParams` treats `sort`, `page` and `search` as facets, so Clear appears with nothing filtered and wipes the search term. Both live in `@misiki/kitcommerce-core`; wrap the composable in `src/lib/components/product-catalogue/` the way `strip-page-on-filter.ts` already wraps `SerialNavigator.goto`, and drive applied-filter state from an explicit allowlist (`tags`, `priceFrom`/`priceTo`, the keys in `facets.allFilters`).

**Hierarchy:** `<h1>` + accurate result count → active-filter chip row + "Clear all" → sort control → grid → pagination. Sidebar: facet groups with per-value counts (the connectors supply them and they are discarded), low-priority groups collapsed.

**Reuse:** `ui/badge` + the `X` icon already imported in `desktop-filter.svelte` (the chip UI was written and then commented out at `desktop-filter.svelte:62`), `ui/select` (sort — the current Command+Popover combobox cannot be operated by keyboard at all: focus lands on `Popover.Content`, nothing consumes arrows, Enter closes without selecting, the URL never gains `?sort`), `ui/sheet` (mobile filter), `ui/skeleton`, `ui/checkbox`, `ui/collapsible`, `ui/pagination`, `ui/input` (replacing the four hand-rolled filter search boxes and their two competing `autofocus` attributes).
**Add:** `ActiveFilterChips` above `<ListingGrid />` in `listing-page.svelte`; `ProductCardMedia`, one media frame with the store aspect ratio reserved, so noor and the generic card stop collapsing to zero-height media; `ListingGridSkeleton` in card shape built on `ui/skeleton` — do **not** lift `DefaultHomepage`'s `[data-theme='default']`-scoped `.ed-skel` CSS into a shared component.

**Responsive:**

| Width | Behaviour |
| :-- | :-- |
| 360 | 2-column grid. Sticky bottom Filter/Sort bar, 44px targets. Filter opens as a full-height `ui/sheet` with dialog semantics. |
| 390 | As 360. Chip row scrolls horizontally with a visible edge; chips 44px tall. |
| 768 | Sidebar visible (`listing-page.svelte:21` already `md:block`), narrowed so it stops being clipped between 768 and ~896. Header sort block moves to `hidden md:flex` — today it is `lg:flex` while the mobile bar is `md:hidden`, so 768–1023 has no sort control. Bottom bar stays `md:hidden`; one sort affordance per width. |
| 1024 | Sidebar 240px + 3-column grid. |
| 1280 | Sidebar 260px + 4-column grid inside `.page-width`. |
| 1440 | Same 4 columns; the rail, not the grid, absorbs the extra width. |

**States:** first load (SSR-seeded grid, never blank), filtering/sorting/paging (`aria-busy` on the grid plus card skeletons — replace the root layout's 700ms `fixed inset-0 backdrop-blur-sm` scrim with a non-blocking top progress bar keeping the `role="status"` + `sr-only` "Loading"), load-more (card skeletons, not two 8px bars), empty (names the search or filters that emptied it), out-of-range page, error, per-card image loading / error / no-image. `.page-heading` in `src/app.css:308` moves to `clamp(1.75rem, 3vw, 2.5rem)` — it resolves to 20px at every viewport today, half the documented page-title size on four of five themes. Return-to-listing restores scroll: `afterNavigate` in `src/routes/+layout.svelte` must return early for `popstate` so SvelteKit's own restoration and the `listing-grid` sessionStorage cache both work.

---

#### 4. Cart drawer and cart page

```text
Apply the Svelte Commerce UX master prompt to the cart surfaces (src/lib/components/nav/cart-sidebar.svelte, src/lib/components/cart/cart-item.svelte and src/routes/(www)/checkout/cart).
Audit the current experience first, then improve it using the shared design system.
Preserve all existing functionality and API behavior.
Focus this iteration on: the error-versus-empty distinction, quantity and remove controls, totals during an in-flight update, and rebuilding the drawer on the Sheet primitive.
```

**Why fourth:** a shopper who has decided to buy is told their bag is empty when the cart fails to load, and the natural response is to re-add everything or leave.

**Closes:** UX-005 (Critical) · UX-072, UX-073, UX-074, UX-076, UX-077, UX-078, UX-079 · UX-093 · UX-263, UX-264, UX-265, UX-266, UX-267, UX-268, UX-269, UX-270, UX-271, UX-272, UX-273, UX-274, UX-275, UX-276, UX-280, UX-281, UX-282, UX-283, UX-284, UX-285, UX-286, UX-288, UX-289 · UX-422, UX-460, UX-461, UX-462, UX-464, UX-478.

**Hierarchy:** drawer — title + count → line items (thumbnail, name link, variant, unit price, stepper, remove) → sticky footer with subtotal, one primary CTA, "Continue shopping". Page — a real `<h1>` (the first heading today is an `h3` product title followed by an `h2`) → line rows → summary card: subtotal, discount, shipping status, total, one CTA.

**Reuse:** `ui/sheet` for the drawer — that single move removes the `use:dialog` call whose arg-free contract makes Escape throw a `TypeError` and never close, the unscoped `<style>body{overflow:hidden}</style>` rendered *inside* the backdrop, the `z-[10000000]`, and the `Button variant="ghost"` backdrop that draws a 1px primary border around the whole viewport on hover. Keep the popstate/history handling at `cart-sidebar.svelte:31-61` by driving `open` from `cartState.isOpen`; pass `class="shadow-z-10"` and set the 220ms panel duration explicitly, since `sheet-content.svelte:5` ships `shadow-lg` and `data-[state=open]:duration-500`. Also `ui/alert`, `ui/skeleton`, `ui/drawer` (coupons), `Spinner`.
**Add:** one `QuantityStepper` on `Button size="icon"` (`h-10 w-10` below `sm`, `h-9 w-9` above) shared by the drawer and the page — today the same action is 22×22 in the drawer and 40×40 on the page.

**Responsive:**

| Width | Behaviour |
| :-- | :-- |
| 360 / 390 | Drawer full width. Page single column, rows compressed from ~246px by closing the ~90px dead band; summary in a pinned bottom bar with the single CTA. Supporting text at `text-xs` `text-muted-foreground`, not 10px at 2.54:1. |
| 768 | Drawer 420px. Page single column, summary sticky at the bottom. |
| 1024 | Page two columns, 2fr items / 1fr summary, summary sticky under the header. Coupon drawer switches to its right-hand panel layout at the same width its classes assume. |
| 1280 / 1440 | Same, inside `.page-width` — the cart page currently abandons the rail and misaligns with header and footer on every theme. |

**States:** empty (one treatment and one destination shared by drawer and page), **error + retry** (the `{:catch}` body at lines 659-662 currently prints the same empty-bag copy as the success branch; use the shape already shipped at `src/routes/(my)/my/orders/+page.svelte:96-106` — `AlertCircle` in `text-destructive`, "We couldn't load your cart", a `<Button>` that re-runs the load), first-load skeleton rows, per-item updating (derive one `isBusy` from `Object.values(cartState.updatingItem)`; disable the checkout CTA, put the summary behind `Skeleton` rather than showing `$28.00` while `$42.00` is in flight, and announce the new quantity and subtotal politely), removing with undo in both surfaces, coupon expired / no expiry (`format('', …)` throws `RangeError` on an evergreen coupon and takes down the whole list), price-change and out-of-stock flags the connector already exposes. Each cart line stops being one `<a target="_blank">` wrapping seven buttons — thumbnail and title link, same tab, everything else plain markup.

---

#### 5. Checkout — address, payment, success, failed

```text
Apply the Svelte Commerce UX master prompt to the checkout flow (src/routes/(www)/checkout/{address,payment,success,failed} and its +layout.svelte).
Audit the current experience first, then improve it using the shared design system.
Preserve all existing functionality and API behavior.
Focus this iteration on: one primary action per step, inline field validation, reduced checkout chrome, themed dialogs, and a confirmation page that states the address and the totals.
```

**Why fifth:** it has no Critical findings and the fewest shoppers reach it, but it is where the remaining trust damage is concentrated and it depends on F9 and F10 landing first.

**Closes:** UX-080, UX-081, UX-082, UX-083, UX-084, UX-085, UX-086, UX-087, UX-088, UX-089, UX-090, UX-091, UX-092 · UX-100 · UX-290–UX-324 (the address/payment/outcome set) · UX-331, UX-332 · UX-412, UX-413, UX-414.

**Hierarchy:** reduced chrome — store logo, the existing `CheckoutHeader` step rail, a support link, the trust row — gated in `src/routes/(www)/checkout/+layout.svelte` with `<Nav />`, `<Footer />` and `<ConversationalShopping />` suppressed for the group. Then `<h1>` per step (neither form step has one), form, summary. One `bg-primary` CTA per step: the summary `CheckoutButton` is primary; the in-form submit demotes to `outline` and stays, because it is the form's only native submit control and the summary button is conditionally hidden while a dialog is open.

**Reuse:** `ui/card`, `ui/button`, `ui/select` (the guest country field — a guest currently sees static text and cannot ship anywhere but the store default, while logged-in shoppers get a searchable picker), `form/textbox` on `ui/input` (F10), `ui/collapsible` (mobile summary), `ui/skeleton`, `CheckoutHeader`, `Spinner`.
**Add:** nothing new. `address-form-modal.svelte`'s accepted-but-unused `onclose` gets wired to the Dialog's `onOpenChange` so Escape/X/overlay dismiss runs `handleFormClose` and returns focus to the trigger — today dismissing it drops focus to `<body>` and leaves the CTA greyed as "Select Address" with the address already saved.

**Responsive:**

| Width | Behaviour |
| :-- | :-- |
| 360 | Single column, persistent labels, correct `inputmode`/`autocomplete` per field (ZIP stops forcing a numeric keypad on alphanumeric postcodes). Pinned CTA bar ≥44px; one CTA on screen at a time. |
| 390 | As 360, plus the order summary collapsed but discoverable above the form. |
| 768 | Still single column, but the total must be on screen — currently between 640 and 1023 there is neither a pinned bar nor a collapsible summary, so the total is off-screen for the whole form. Add the sticky bottom summary bar here. |
| 1024 | Two columns: form 1fr, summary 380px, sticky. Payment-step delivery address expanded, not behind a toggle. |
| 1280 / 1440 | Same, inside `.page-width` — replace Tailwind's `container` utility, and drop `min-h-screen` on `<main>`, which leaves a ~240px empty band above the footer on the desktop payment/review steps. |

**States:** idle · validating on blur, not on the first keystroke · invalid with the message next to the field, `aria-invalid` and `aria-describedby` (today an empty submit at 390px produces one `[role=alert]` at y=1140, out of view, listing only `errors[0]`) · submitting (button loading + disabled) · server error inline plus a banner that clears when the field is fixed · first load as a layout-shaped skeleton, not a spinner in a 384px box · empty cart on the payment step · success with the address card guarded (never the bare comma it renders today) and the money stated · failed rebuilt inside the checkout shell with `<CheckoutHeader step={3} />` and a retry that returns to payment. All state colour moves onto `--success`, `--destructive` and the new `--warning`; the blue guest-checkout banner, `bg-white` surfaces, `text-gray-900` headings, the two different error treatments across address and payment, and the invented `#fafafa` on the success page all resolve to `bg-card` / `text-foreground` / `text-muted-foreground` / `bg-destructive`.

---

### What must not change

**URLs and query parameters.** Route shapes stay exactly as they are: `/`, `/products`, `/products/[slug]`, `/categories/[slug]`, `/collections/[slug]`, `/[slug]`, `/checkout/{cart,address,payment,process,success,failed}`, the `(my)` and `(legal)` groups. Parameters read today and preserved: `search`, `sort`, `page`, `priceFrom`/`priceTo` and the facet keys (`src/lib/components/product-catalogue/{listing-header,desktop-filter,mobile-filter,listing-page}.svelte` and the wrapped core composable), `variant_id` on the PDP, `showEditAddress` on `/checkout/address`. `src/lib/components/product-catalogue/strip-page-on-filter.ts` is the existing seam for patching navigation — extend it rather than forking the composable. The UX-001 fix points submit at `/products?search=` — an existing route with an existing parameter; it adds nothing. `src/routes/robots.txt/+server.ts` already disallows `/*?*search=` and `src/routes/(www)/products/+page.svelte` canonicalises the term away, and both must keep doing so. `tests/product-listing.spec.ts` navigates `/products?category=non-existent`; `tests/e2e.spec.ts`, `home-page.spec.ts`, `navigation.spec.ts`, `cart.spec.ts`, `checkout.spec.ts` and `product-detail.spec.ts` run against `http://localhost:3000`.

**`data-testid` hooks.** They are emitted in exactly four files — `src/lib/components/product-catalogue/product-card.svelte` (11), `src/lib/theme/default/DefaultProductCard.svelte` (12), `src/lib/theme/lime/LimeProductCard.svelte` (1), `src/lib/theme/noor/NoorProductCard.svelte` (1) — and the names are `product-card-{product.id}`, `product-card-link`, `product-card-image-container`, `product-card-info-wrapper`, `product-card-price-container`, `product-card-selling-price`, `product-card-mrp`, `product-card-discount`, `product-card-rating-container`, `product-card-tag`, `product-title`, `wishlist-button`. `tests/product-detail.spec.ts:27` asserts `[data-testid="product-title"]`. **`src/app.css:356-357` styles lime by `[data-testid='product-card-selling-price']` and `[data-testid='product-card-mrp']`**, so these attributes are a styling contract as well as a test contract: when card markup moves into the shared `ProductCardMedia` frame (slice 3), the attributes move with the elements they are on. Lime and noor emit almost none of the set — add hooks there, never rename or drop an existing one. The vitest suites `tests/{product-card,cart-item,button,card,input,form,login-modal,status-cell,schema,load,validations,use-payment}.test.ts` pin component props and rendered output; run `bun run test:unit` per slice.

**Analytics and SEO.** `<GoogleAnalytics />` at `src/routes/+layout.svelte:142`, `<KlaviyoPlugin storeData={data?.store} />`, and `<StorePlugins />` in the three group layouts stay mounted and stay where they are (the only change proposed is UX-106's guard: `tawkTo.active` must imply a non-empty `tawkTo.account`, so a merchant cannot ship another business's Reamaze inbox). `src/lib/components/seo/{seo-header,canonical,structured-data,product-list-schema}.svelte` and `schema.ts` are untouched, as is the canonical policy recorded at `src/routes/+layout.svelte:120-124` — canonicals are owned per page, and the layout deliberately renders neither a canonical nor a description. The PDP `<h1>` correction (UX-003) changes the page body only; `SeoHeader`'s title and structured data already carry the product name. The one intentional SEO edit is the `SearchAction` `urlTemplate` at `src/routes/(www)/+page.svelte:158`, which must move with the submit target or it keeps publishing a dead route to search engines.

**Connector neutrality.** `kitcommerce.config.ts` keeps exactly one uncommented export; app code resolves everything through `$lib/core/services` and never imports a connector by name. Backend-specific corrections land in `src/lib/core/connectors/` — `gocommerce.ts` for the `query`/`q` parameter mismatch (UX-015) and the numeric-vs-string variant ids (UX-004), `default-store.json` and `static-store.ts` for the search plugin flag (UX-011/UX-018), `rest-guard.ts` for capability checks (UX-103). `src/lib/components/**` stays backend-agnostic: no `{ query, q: query }` at a shared call site, no connector name in a component, no new marker vocabulary — feature gating reads `store.plugins.*` and a `supports(path)` helper on the existing `rest-guard`. The other 25 connector modules in `src/lib/core/connectors/` must keep compiling against unchanged component props.

**Runtime theme switch.** `data-theme` stays on the root wrapper at `src/routes/+layout.svelte:147-151`, with `data-theme-source` beside it — UX_SYSTEM §1 lists this under Must preserve, and F9 *mirrors* the value onto `<html>` rather than moving it. `src/lib/theme/index.ts` keeps its precedence (store record → `PUBLIC_STOREFRONT_THEME` → default), its `AVAILABLE_THEMES` list of five and its `THEME_FONTS` map. `src/app.css` keeps one `[data-theme='…']` block per theme as the only place a theme's values live. `store.themeCss` injection at `+layout.svelte:39-43` and `:131-133` stays, and `StorePalette`/`StoreFont` keep applying the merchant palette at runtime — the improvement is to also emit it during SSR so the brand colour is in the first paint, not a post-hydration flip. Each theme keeps its own homepage, and lime and noor keep their own nav, footer and product card under `src/lib/theme/<theme>/`; `.page-width` and `.page-heading` in `src/app.css` remain the single shared rails, and no slice introduces a second max-width or a second token vocabulary.

## What could not be verified

The backend, the demo catalogue and one server fault put the following out of reach of a browser
check. Each was audited from code instead, and the findings say so.

- **The wine theme.** Its development server reverted to the default theme partway through the audit, so no wine finding was reproduced in a browser. Wine shares a footer branch and a product card with organic, which were rendered, so the shared code paths are covered indirectly.
- **Everything behind a sign-in.** The backend has no accounts and authentication throws a not-supported error, so the account area, order history, wishlist, saved addresses, the signup and password modals, and the logged-in checkout path were read rather than run.
- **Search as a shopper meets it.** The shipped store configuration disables the search plugin, so the trigger never renders. The panel was exercised by rewriting that flag in the served document, which shows the component code but not a configuration a merchant can currently produce.
- **Product media.** The three demo products carry no images, so the gallery, thumbnail rail, zoom, video handling and the image preload path never mounted.
- **Anything a plugin gates.** Coupons, wishlist, reviews, the newsletter, social sharing, the chat launchers and the trust badges are all inactive in this store, and the repository was read-only during the audit, so their markup was judged from source.
- **Anything a larger catalogue would show.** Pagination beyond one page and its fifty-page cap, facet counts, zero-result facet values, sorting, and category hierarchy never activated with three products and no categories.
- **Merchant-authored content.** The store serves no page blocks, banners, blog posts or content pages, so the block renderers and their responsive variants were verified against the compiler and the source.

## Editorial record

The area editors merged 95 findings into others, dropped 3, promoted 45 and demoted 9. Ids are
never reused, so gaps in the numbering are merges and drops.

| Dropped | Reason |
| :-- | :-- |
| UX-163 | The missing motion-duration tokens are already named as a known foundation gap in UX_SYSTEM section 2, and the finding carries no shopper-facing defect of its o |
| UX-208 | Compiler-warning cleanup with no observable defect on the listing. Its concrete instances are checkout payment components, the homepage and the carousel, all ou |
| UX-447 | A refutation, not a defect: no card in any theme renders a brand or vendor name, as the finder and verifier both concluded. Its only residue, the unused categor |

| Merged | Into |
| :-- | :-- |
| UX-118 | UX-007 |
| UX-116 | UX-014 |
| UX-416 | UX-110 |
| UX-133 | UX-016 |
| UX-140 | UX-019 |
| UX-424 | UX-017 |
| UX-143 | UX-129 |
| UX-141 | UX-134 |
| UX-138 | UX-136 |
| UX-147 | UX-136 |
| UX-426 | UX-139 |
| UX-430 | UX-149 |
| UX-026 | UX-024 |
| UX-029 | UX-024 |
| UX-153 | UX-023 |
| UX-037 | UX-028 |
| UX-184 | UX-031 |
| UX-152 | UX-032 |
| UX-034 | UX-033 |
| UX-036 | UX-035 |
| UX-177 | UX-042 |
| UX-189 | UX-042 |
| UX-044 | UX-043 |
| UX-159 | UX-151 |
| UX-174 | UX-151 |
| UX-183 | UX-151 |
| UX-169 | UX-158 |
| UX-178 | UX-158 |
| UX-179 | UX-170 |
| UX-181 | UX-171 |
| UX-437 | UX-171 |
| UX-439 | UX-176 |
| UX-195 | UX-052 |
| UX-200 | UX-198 |
| UX-199 | UX-051 |
| UX-203 | UX-051 |
| UX-441 | UX-206 |
| UX-444 | UX-057 |
| UX-445 | UX-229 |
| UX-231 | UX-230 |
| UX-233 | UX-232 |
| UX-449 | UX-446 |
| UX-004 | UX-002 |
| UX-251 | UX-062 |
| UX-068 | UX-063 |
| UX-237 | UX-064 |
| UX-067 | UX-066 |
| UX-248 | UX-238 |
| UX-242 | UX-241 |
| UX-247 | UX-243 |
| UX-250 | UX-245 |
| UX-450 | UX-252 |
| UX-451 | UX-252 |
| UX-457 | UX-253 |
| UX-255 | UX-254 |
| UX-262 | UX-256 |
| UX-260 | UX-258 |
| UX-455 | UX-258 |
| UX-264 | UX-072 |
| UX-277 | UX-072 |
| UX-289 | UX-077 |
| UX-272 | UX-263 |
| UX-279 | UX-278 |
| UX-464 | UX-283 |
| UX-091 | UX-081 |
| UX-319 | UX-085 |
| UX-468 | UX-085 |
| UX-089 | UX-086 |
| UX-305 | UX-087 |
| UX-318 | UX-088 |
| UX-303 | UX-090 |
| UX-472 | UX-299 |
| UX-312 | UX-300 |
| UX-471 | UX-308 |
| UX-474 | UX-323 |
| UX-098 | UX-097 |
| UX-337 | UX-099 |
| UX-485 | UX-483 |
| UX-372 | UX-350 |
| UX-381 | UX-352 |
| UX-486 | UX-352 |
| UX-357 | UX-356 |
| UX-366 | UX-363 |
| UX-369 | UX-365 |
| UX-379 | UX-365 |
| UX-491 | UX-365 |
| UX-488 | UX-367 |
| UX-487 | UX-370 |
| UX-382 | UX-380 |
| UX-390 | UX-389 |
| UX-404 | UX-386 |
| UX-495 | UX-391 |
| UX-399 | UX-398 |
| UX-501 | UX-496 |
| UX-502 | UX-497 |
