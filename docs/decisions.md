# Decisions

Owner decisions for the storefront, newest first. Read before proposing a change; changing a settled
decision needs the owner.

## 2026-10-29: A product's own badge is the label on its picture

GoCommerce gives each product a one-line Badge (engine metadata key `badge`), and the theme setting
`card_badge` gains `product_badge`, the default for a new store. The storefront takes the same
default when the setting is unset: a card and the product page's picture show the badge the
merchant wrote for that product, and a product without one shows no label, rather than its first
tag. `first_tag` and `first_highlight` still pick those sources, and `none` shows nothing. The
storefront reads the product's `metadata.badge`, the way highlights and free gifts arrive (D134).

## 2026-10-29: Prices drop ".00" and group their digits the shopper's way

Asked whether ₹2799.00 should read ₹2,799, the owner said "yes drop". A whole amount shows no
`.00`, paise still show (₹499.50), and the digits are grouped for the currency: Indian grouping for
rupees (₹12,999, ₹1,29,999), threes for every other currency. Core's `formatPrice` is
package-owned, so the storefront wraps it once, in `src/lib/utils/price.ts`, and every price a
shopper reads goes through it: cards, the product page, the bag, checkout, order pages, and the
filter sheet's price range and price chip. Core's symbol and layout stay as they were. A test fails
when a file imports core's `formatPrice` directly.

## 2026-10-29: The default theme shops like Bewakoof, and the store decides each part

The owner: "for the default theme, take reference from https://www.bewakoof.com/", and then "dont
leave everything for storefront to decide. keep maximum modifyable at admin".

Bewakoof is the reference for the default theme's merchandising patterns and density, not a look to
copy: no logo, name, artwork, copy or pictures of theirs. What the default theme took from it:

- **Palette.** A white canvas, neutral near-black text, one yellow (`--primary`, 47 100% 60%) for
  the action with dark text on it (12.2:1), green for savings (`--sale`, #198837, the engine's
  default for the `sale` setting), a calm blue for information (`--info`). Yellow cannot be ink
  (1.44:1 on white), so `text-primary`, `border-primary`, rings and the like read `--primary-ink`,
  the text colour on this theme, and selected pills and the current page take a dark edge.
- **Cards.** The label top left on the picture, the rating pill bottom left, the brand line in bold
  with the heart beside it under the picture, the name, then price, was-price and saving on one line.
- **Listings.** Title and product count on one line, round sub-category pictures, filter chips that
  open the filter sheet, the sticky Sort | Filter bar on a phone, a filter rail on a desktop.
- **Product page.** The picture edge to edge on a phone with the label and rating on it, the brand
  line, "2 left" under a low size, a Key highlights card of attribute pairs, the sticky Add to bag.

Every one of those choices is a key in the store's GoCommerce theme settings (engine PR #182), and
the storefront's value applies only when the key is unset: `sale`, `type_scale`, `heading_weight`,
`density`, the `card_*`, `list_*` and `pdp_*` keys. Visual keys become CSS variables in
`src/lib/composer/theme-tokens.ts`; the rest are parsed and checked in
`src/lib/composer/theme-options.ts`. A value outside its list is dropped, as with the colours.

The type and spacing keys move the one scale of the next entry; there is no second ladder.
`type_scale` moves every `--type-*` step together: `standard` is that scale, with its 16px body,
`compact` a step smaller with a 14px body, `large` a step larger with an 18px body. `heading_weight`
sets `--weight-heading`, the weight of every heading but the hero. Unset it is 700, the scale's
own weight, so the hero's 800 stays the one heavier line; GoCommerce's starting page saves
`extrabold`, so a store that keeps it gets Bewakoof's heavier headings. `density` moves `--space-*`,
`--grid-gap-*` and the page gutter, with `compact`, the scale's own values, when unset.

Kept from settled decisions where the reference differs: sentence case, not Bewakoof's capitals
("Add to bag", not "ADD TO BAG"); Inter, not a new face; the store's own colours over the theme's;
nothing invented (no rating without reviews, no "N left" without the variant's own count, no
offers, no "bestseller"); 2 / 3 / 4 / 5 product columns, not Bewakoof's three on a desktop (a store
can choose three); the sticky Add to bag only once the in-page button has scrolled away. Bewakoof's
free-shipping strip is not drawn: the engine gives the free-delivery threshold only for a cart, so
there is no figure to show a shopper who has none.

A card's name is one line by default (`card_title_lines: one`; two lines is the other choice), so
UX_SYSTEM's preference for two lines is now the store's choice.

The store defaults (`kitcommerce.config.ts`) no longer carry the Litekart demo shop's navy palette,
which had painted every GoCommerce store in one merchant's colours over the theme's own.

## 2026-10-29: One type and spacing scale on the default theme

The owner asked for the default theme's font sizes, weights, alignment, spacing, density and line
heights to be studied and made consistent. The scale is the role table in UX_SYSTEM section 4,
held as `--type-*`, `--leading-*`, `--tracking-*`, `--weight-heading`, `--space-*` and
`--grid-gap-*` tokens in `src/app.css` on the default theme, and the store's type and spacing
settings move it (the entry above). What it settles: page and section titles take one weight on
every page, 700 unless the store chose another, the weight the composed home page (D140) set, and
only the hero is 800; a heading over a band is the same size wherever it appears (home shelves,
customer ratings, related products); paragraphs a shopper reads are 16px at 1.5 on phones and
desktops, while card and control text stays on the compact 12–14px steps (a card's price is
16px); headings carry no positive tracking; and 12px is the floor for anything a shopper reads (the phone menu, at 9–12px,
now meets it). The lime, noor, wine and organic themes keep their type; the composer's shared
sections fall back to their old values there.

## 2026-10-28: A new store's footer links its standard pages, shown once published

The owner asked that every new store get its mandatory pages, linked from the footer. GoCommerce
now drafts About us, Contact us, Privacy policy, Terms and conditions, Shipping policy and Refund
and returns policy for each new store and puts all six in its footer (engine decision D145). The
footer hides a link to any of those pages until the store publishes it, under every name a menu
uses for it (`/privacy-policy`, `/pages/privacy`, `/p/privacy-policy`), so a draft is never a dead
link or placeholder text in front of shoppers. Contact us is the storefront's own form and always
shows. Which pages a store publishes is remembered per store for a minute, not per server process.

## 2026-10-28: The composed home page is "Bold and bright"

The owner chose "Bold and bright" for the default theme (engine D140). The composer's sections draw
it from the theme tokens, so a shop's colours restyle it: the hero's words sit on a block of the
accent colour (`--primary` with `--primary-foreground`) beside the picture, columns without
paragraphs become chunky rounded tiles two across on a phone with the whole tile one link, the
picture-with-words section is one rounded block of the quiet colour, and the benefits strip is a
dark band with the page's text and background colours swapped. Headings are heavier. The default
pictures come with the engine's starting page and are served by the engine
(`/x/layouts/starter/1/…`, made absolute by the connector like any `/media/…` picture; the engine serves them without a store named, since a shopper's `<img>` names none): Unsplash
photographs of Indian women for the hero and the picture beside words (the owner, 2026-10-28: "you
can use unsplash royalty free images that include human (indian girls)", overriding the no-stock-photo
rule for this theme) and Google Gemini pictures for the tiles. Tiles with a picture stay tiles, the
picture inside the tile. The hero and the picture beside words read the shop's `image_alt`, falling
back to the heading. A section whose picture a shop clears draws its colour block.

The owner, 2026-10-28: "yes, show the bold starter to unpublished stores". The engine answers a home
page never published with the starting page and its look, so this storefront draws it; the built-in
home page now shows only while the theme editor is switched off.

## 2026-10-28: Categories come from the Shopify taxonomy, switched on per store

GoCommerce keeps Shopify's product taxonomy as the one master list of categories, and each store
switches on the categories it wants from it. A new store gets no fixed starter list, and the full
tree is not copied into every store. The owner chose this over starter sets per shop type and
over keeping the taxonomy only as an optional whole-tree import. The storefront's filter and
menus show only a store's active categories.

## 2026-10-27: Product picture shape and fit are set in GoCommerce

The shop sets the shape of product pictures (square, portrait 3:4, tall 2:3, landscape 4:3) and
whether they fill the frame or show whole in the panel's theme settings (engine D128). They reach
the cards as `--product-image-ratio` and `--product-image-fit` and win over any ratio a caller
passes, so every card shows the shop's shape. Unset, the card falls back to the store record's
`productImageAspectRatio` (square, from `kitcommerce.config.ts`) and shows the whole picture.

## 2026-10-27: The backend picks the theme, or it is the default

A backend with a theme feature (Litekart, GoCommerce) decides the theme through the store record,
and the storefront uses it. A backend without one (Saleor, Medusa, Shopify) gets the default theme.
A theme name this build does not ship also falls back to the default. `PUBLIC_STOREFRONT_THEME`
was removed, so a deployment can no longer force a theme.

## 2026-10-27: Inter everywhere on the default theme

Headings, body, buttons, the logo wordmark and portalled dialogs all use Inter. Lora, the former
heading serif, is no longer downloaded, and the hero's italic emphasis is upright, since Inter's
italic is not loaded. A merchant's admin-set body font (`store.themeFontFamily`) still overrides
the body face. The wine, organic, lime and noor themes keep their own fonts.

## 2026-10-26: No all-caps text on the default theme

Labels, buttons, eyebrows, status pills and step labels are sentence case, with no `uppercase`
class, no `text-transform: uppercase` and no caps-only letter-spacing. The owner asked for it after
the account, auth and shop pages were unified, so the whole storefront reads in one voice.
`scripts/check-tokens.mjs` fails on all-caps styling in default-theme files. The wine, organic, lime
and noor themes keep their own type treatment.
