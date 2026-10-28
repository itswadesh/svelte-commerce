# Decisions

Owner decisions for the storefront, newest first. Read before proposing a change; changing a settled
decision needs the owner.

## 2026-10-28: The composed home page is "Bold and bright"

The owner chose "Bold and bright" for the default theme (engine D140). The composer's sections draw
it from the theme tokens, so a shop's colours restyle it: the hero's words sit on a block of the
accent colour (`--primary` with `--primary-foreground`) beside the picture, columns without
paragraphs become chunky rounded tiles two across on a phone with the whole tile one link, the
picture-with-words section is one rounded block of the quiet colour, and the benefits strip is a
dark band with the page's text and background colours swapped. Headings are heavier. Default
pictures are to be made with Google Gemini; until they exist a section without one draws its colour
block. The built-in home page (no layout published) is unchanged.

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
