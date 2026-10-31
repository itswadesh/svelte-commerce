# Decisions

Owner decisions for the storefront, newest first. Read before proposing a change; changing a settled
decision needs the owner.

## 2026-10-31: A store that adds tax on top says its checkout total is before tax

A review found that on a store whose prices exclude tax (GoCommerce D177, `prices_include_tax`
false), checkout called its bottom line "Total" and the order then charged more: ₹151 shown, ₹158.56
charged on an 18% rate. The engine works tax out only when it places the order, and no cart or
checkout endpoint quotes it before then. Until the engine offers that quote, the storefront does
not work tax out itself, because a copy of the engine's tax rules would drift from them. Instead,
when the cart says it leaves tax out (`taxIncluded` false) and carries none, and the store does
not say its prices include tax, the cart, address, payment, review and failed steps label the
figure "Total before tax", with "Any tax is added when you place your order." under it. The pinned
bar uses the same label. The confirmation page, the order page and order tracking show a "Tax" row
when the order's tax was added on top (`taxIncluded` false). A store whose prices include tax
(`store.currency.includesTax` true) reads as before. A GoCommerce store that has not chosen gets
the install default, tax added on top, so it shows the label. A cart that does not say it leaves
tax out reads as before, whatever the store record says, because its total is already final.
Litekart's demo store and `default-store.json` both say `includesTax` false on backends whose cart
total is final. Showing the real total before the order needs an engine quote endpoint.

## 2026-10-31: The payment step's total includes cash on delivery's extra charge

The owner reported that the cash on delivery charge was not added on the payment step. A store can
set an extra charge for cash on delivery (GoCommerce D165), and the engine adds it to a cash order,
so a shopper agreed to one total and was charged another. The payment step now shows the charge
beside the option before the choice ("Cash on delivery · ₹60 extra"). Choosing it adds a "Cash on
delivery charge" line to the price summary, and the total and the review step include it. Another
method shows neither. The confirmation page, the order page and order tracking show the charge
from the order, and only when it is above zero. The figure is the payment method's `fee` and the
order's `codCharges`, which the connector fills (gocommerce-connector 0.27.0). A connector that
sends neither shows nothing new.

## 2026-10-30: A product made to a design is never added plain

The engine now marks every product `designable` and refuses a plain add of a designable one with
`design_required` (GoCommerce #211, D174), because a quick add bought a blank print. The storefront
follows the flag. A plain product's page no longer asks for a customizer setup. A designable
product's page offers Design yours even when its setup failed to load: the button reads the setup
again, and if it still cannot, says "Couldn't open the designer." with Try again, never Add to bag.
Every card or list that offered a one-tap add (the listing, search, collections, cross-sells,
related products, a seller's store page, the bag's suggestions and the wishlist) offers Design
yours instead, a link to the product page. Buy again offers Design again, a link to the product
page, for a past line that was designed and for a product made to a design. Undo after removing a
designed line from the bag puts back the same design. A product with no flag, from an older engine
or connector, behaves as before. When a stale flag still lets a plain add through, the cart service
puts the refusal in plain words, "This one is made to your design. Design it first.", keeps the
bag, and turns that product's cards to Design yours. The Lime and Noor cards are out of design scope
and keep their quick add; there the reworded refusal is the guard. Complete-the-set add-ons carry no
flag from the engine, so the same refusal is their only guard. The shopping assistant's
recommendations keep their add button: the assistant runs only on Litekart, which neither sends the
flag nor refuses a plain add.

## 2026-10-30: A shopper designs their own print, and the bag shows it

The owner asked for a product customizer like Zapvi's (GoCommerce D162, stage 2 of 3). On a product
the merchant made designable, the product page's one action becomes "Design yours", because the
product is made to a design. It opens the editor: full screen on a phone, with the mockup in the
middle, close, undo, redo, zoom and preview along the top, the tools along the bottom and Add to bag
under them; on a desktop, the canvas beside a tool panel. Only the tools the merchant switched on
are offered (photo, words, shapes, background, stickers), with a layer list. One function draws the
design for the screen, the preview and the print file, so what the shopper sees is what is printed.
The print file is exactly `round(mm / 25.4 × dpi)` pixels a side, as a PNG so the print area's round
corners stay clear. The merchant's consent line shows before a photo is chosen, and a photo under
the setup's smallest size is flagged as likely to print soft, never refused. Add to bag uploads the
preview and the print file, saves the design and adds it as a line of its own, with any add-ons
ticked in "Complete the set". The bag, checkout, confirmation and order pages show the shopper's
design in place of the product picture, labelled "Your design". A connector without the customizer,
an older release of one, or a product that cannot be designed gives the ordinary page, so this ships
before the connector release does. Templates, matching add-ons and a customization fee are stage 3.

Uploads go through the storefront's own proxy, and adapter-node refuses a request body over
`BODY_SIZE_LIMIT`, 512 KB unless set. Every chosen photo is redrawn in the browser, turned upright,
and sent as a plain JPEG (a PNG only when it has see-through parts), at most 12 megapixels and twice
the print file's longest side: the engine refuses HEIC, WebP and some costly files it could read,
more pixels never print sharper, and a smaller upload is faster on a phone's data. The print file is
a PNG and can still approach the engine's 15 MB limit, so a deployment selling designs sets
`BODY_SIZE_LIMIT=16M`; the `Dockerfile` and `docker-compose.yml` do. A print file over the limit
gets a plain message asking for a simpler design, not a silent failure, and every other failed
upload, save or add says so in plain words, never in the engine's or HTTP's.

## 2026-10-30: Criteo's OneTag, per store, behind the cookie choice

The owner asked for Criteo's tag (`dynamic.criteo.com/js/ld/ld.js?a=<account>`). The account is
each store's own: the engine's `criteo` plugin, which the gocommerce connector hands over as
`store.plugins.criteo`. It is never hard-coded, because one deployment serves many stores. The tag
loads on the first interaction. Criteo does not read Google's consent mode, so a saved cookie choice
decides, and without one, visitors whose time zone is in the opt-in regions (Europe and the
Atlantic islands, as `app.html` treats them) wait for "Accept all". A store with Criteo shows the
cookie banner.

Amended 2026-10-30, the owner: "send Criteo product, cart and purchase events too". Criteo is now one
of the ad tags in `ad-tags.ts`, which hears the GA4 events the storefront already sends, so it loads,
waits for consent and hears events exactly as the Meta and TikTok pixels do: a product view is
`viewItem`, a listing `viewList` (its first three products), the basket page and the start of
checkout `viewBasket` with each line's ID, price and quantity, and a purchase with an order number
`trackTransaction` with its currency. Adding one item is not sent: Criteo's basket event wants the
whole basket. No email is sent. The separate Criteo component is gone. Listing pages now send
GA4's `view_item_list` and the bag page `view_cart`, which nothing sent before, so every tag hears
them; their item IDs follow `view_item`'s (SKU, else the product ID), and a store's Criteo product
feed must use the same IDs for the ads to show the right products.

## 2026-10-30: Google reviews are Google's, live, and the survey uses the engine's order data

The owner asked to "integrate google reviews" (engine D161). The home page's Google reviews section
shows the store's Google rating, count and Google's most relevant reviews only after the engine has
read them from Google, and only when the section nears the screen: Google's terms forbid keeping
them, so every view is a call the store pays for, and nothing loads for a shopper who never scrolls
there. It credits each author by name, photo and profile link, links each review on Google Maps and
to Google's report page, says how the reviews were chosen, links to all of them, and carries the
Google Maps logo, as Google's Places policies ask. It emits no structured data: Google's review
snippet rules say not to mark up ratings from another site. The confirmation page's Google Customer
Reviews offer no longer builds its fields here: the old block pasted a merchant ID from the static
record into script text, read the email from the emptied cart, and invented a delivery date seven
days out. The engine now builds every field from the order and offers no survey without a real
delivery estimate. Google's scripts load after the page: the survey when the browser is idle, the
store widget on the first interaction.

## 2026-10-30: The strip above the header is one thin line

The owner: "keep the heads up notification above header thinner". The header's announcement strip,
the hello bar and the composer's announcement-bar section are each one 30px line at every width,
down from 38–45px (55–75px on a phone, where long text wrapped to two or three lines). Text too
long for the width ends in an ellipsis. The header strip's link fills the whole bar, and the
composer section's link takes the bar's full height: 30px targets, above WCAG 2.2's 24px floor,
rather than the 44px they borrowed from the bar's padding. The hello bar's messages are the
merchant's own HTML, so a link at the end of a message too long for a phone is cut off with the
rest of it; keep a linked message short.


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
  the text colour on this theme, and selected pills and the current page take a dark edge. A line,
  bar or dot in the accent (slider fills, step bars, the bottom bar's active dot, a radio's dot, a
  switch that is on) is drawn in the ink too (`bg-primary-ink`), so a store's light accent never
  draws a faint line on white.
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

## 2026-10-29: The contact page shows what the store published, and a map only on a tap

The owner asked for a better contact page "can include a google map", as a feature every store gets
from its own settings (engine decision D156). The page shows WhatsApp, call and email cards, the
address, opening hours and a map, each only when the store set it; one it did not set is simply
absent, and the JSON-LD asserts the same and nothing more. Google's map does not load with the page:
a still map drawn in CSS with a "Show map" button stands in its place, and the frame, always on
`www.google.com`, is put in when the shopper taps. "Open in Google Maps" is a plain link beside it.
A map location the page cannot draw (a share link) is opened, never replaced by a map of the
address it was set to correct. An Indian number reads as `+91 98765 43210` only when the store's
published country is India; nothing is guessed from the currency or the template's default
country. The page sends no CSP header of its own: a header on one page of a client-routed site
stays for the rest of the visit and would block the YouTube and payment frames on later pages.

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

## 2026-10-30: The app writes its own head tags

Compared with another store's product page, ours shared links badly: the vendored SeoHeader always
said og:type "website", passed site-relative pictures through (Facebook, WhatsApp and X fetch only
full URLs), emitted an empty keywords tag and had no robots, locale or price tags.
`src/lib/components/seo/seo-header.svelte` now writes the tags itself instead of wrapping it. Product
pages are og:type "product" with product:price and product:availability; every picture, in the tags
and in the JSON-LD, is a full URL; the robots tag carries only permissions (max-image-preview:large),
never "index", so a page's own noindex is not contradicted. The product BreadcrumbList runs from Home
to the product. A product weight is published only with a known unit. The fallback description no
longer promises free delivery.

## 2026-10-30: The store's ad and analytics tags, one bridge, behind the cookie choice

The owner asked for the popular ad and analytics integrations (GoCommerce D160). The Meta pixel,
Microsoft Clarity, Hotjar and the TikTok, Pinterest and Snap pixels are each the store's own ID
from the engine, which the gocommerce connector hands over as `store.plugins.<name>`; none is ever
hard-coded. Each loads the vendor's own base code on the shopper's first interaction, like Klaviyo,
and only where the cookie choice allows: a saved choice decides (ad cookies for the four pixels,
analytics for Clarity and Hotjar), and without one, visitors whose time zone is in the opt-in
regions wait for the banner, which a store with any of these tags shows. The pixels hear the
shopping events the storefront already sends GA4 (`view_item`, `add_to_cart`, `begin_checkout`,
`purchase`) by listening on `window.gtag`, so there is one place events are fired, not one per
vendor; `begin_checkout` is now sent from the address step. Meta's Purchase carries the order
number as its eventID, which the engine's Conversions API also sends, so Meta counts the sale once.

## 2026-10-30: Google Analytics, Ads and Tag Manager wait for the cookie choice like every other tag

The engine's google-analytics plugin (GA4 measurement ID, Tag Manager container, Google Ads ID and
conversion label) now reaches the store as `store.plugins.googleTagManager`, the shape Litekart
used, and loads through the same bridge as the pixels: on the first interaction, only where the
cookie choice allows (analytics for GA4 and Tag Manager, ad cookies for Ads), never while the
address carries an email, a token or a key, and a choice taken back reloads without it. Core's
`GoogleAnalytics` loader, which put Google's tags in the head of every page before any choice, is
no longer rendered. GA4 and Ads share one Google tag on a data layer of its own (`gcLayer`): it gets
the page's consent commands first, then only the events handed on after consent, each with its
e-commerce parameters alone (core also attaches the shopper's hashed contact details, address, IP
addresses and user agent, and signing out sends the whole user record). GA4's events go to GA4
only; a purchase with a conversion label is the Ads conversion, so an Ads account counts a sale
once. The page's own `dataLayer` keeps every event since the page opened, which is why neither tag
reads it.

A Tag Manager container takes over GA4 and Ads: the storefront then loads only the container, on
its own layer too (`gtmLayer`), and hands it each event in the shape Google's Tag Manager
e-commerce guide gives (`{ event, ecommerce }`). Google's advice is to deploy each product through
one of the two, and a container can hold either, so loading the IDs as well could count every page
view and sale twice; a store with a container sets GA4 and Ads up inside it, reading `gtmLayer`.

GA4 starts on the first interaction, like every tag here, so a visit that never scrolls, taps or
types is not counted; sessions and bounce figures will differ from a tag loaded in the page head.

## 2026-10-30: Cookie settings in every footer

A cookie choice has to be as easy to take back as it was to give (DPDP, GDPR). Every footer
(default, lime, noor and checkout) offers "Cookie settings" on a store that loads a tag; it opens
the consent banner again, and a choice taken back reloads the page without the tags.

## 2026-10-30: No personal data in a URL

The owner's standing rule: no email, phone, token or name in a URL, since every analytics tag
records the page's address and the history keeps it. The page after sign-up gets the address in
SvelteKit's navigation state and greets the shopper without it after a reload; the sign-in form
hands the typed address to the reset form in memory instead of an `email` query.
