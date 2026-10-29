# Decisions

Owner decisions for the storefront, newest first. Read before proposing a change; changing a settled
decision needs the owner.

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

Kept from settled decisions where the reference differs: sentence case, not Bewakoof's capitals
("Add to bag", not "ADD TO BAG"); Inter, at its 800 weight for headings, not a new face; the store's
own colours over the theme's; nothing invented (no rating without reviews, no "N left" without the
variant's own count, no offers, no "bestseller"); 2 / 3 / 4 / 5 product columns, not Bewakoof's
three on a desktop (a store can choose three); the sticky Add to bag only once the in-page button has
scrolled away. Bewakoof's free-shipping strip is not drawn: the engine gives the free-delivery
threshold only for a cart, so there is no figure to show a shopper who has none.

Two UX_SYSTEM rules change with this, both by the owner's settings: body text is 16px by default
(`type_scale: standard`; the 13-15px of section 4 is `compact`), and a card's name is one line by
default (`card_title_lines: one`; two lines is the other choice).

The store defaults (`kitcommerce.config.ts`) no longer carry the Litekart demo shop's navy palette,
which had painted every GoCommerce store in one merchant's colours over the theme's own.

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
