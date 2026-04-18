# arialshop.com — SEO Improvements Checklist
> **Site:** https://arialshop.com  
> **Stack:** SvelteKit (Litekart) · SSR · Misiki backend  
> **Audited:** April 2026  
> **For:** Coding agent implementation tasks

---

## Legend
- `[CRITICAL]` — Blocks organic ranking entirely. Fix before anything else.
- `[HIGH]` — Significant ranking or indexability impact.
- `[MEDIUM]` — Improves relevance, CTR, or long-tail coverage.
- `[LOW]` — Polish and E-E-A-T signals.

---

## 1. Title Tags & Meta Descriptions

- [ ] **[CRITICAL]** Rewrite homepage `<title>` tag  
  - Current: `"Arialshop - Shop Online for Top Products"`  
  - Target: `"Arialshop — Women's Fashion, Dresses & Co-ord Sets | Up to 70% Off"`  
  - File: `src/routes/+page.svelte` or layout head

- [ ] **[CRITICAL]** Add unique `<title>` tags to all category/listing pages  
  - Pattern: `"Women's {Category} Online India — Buy at Best Price | Arialshop"`  
  - Implement as dynamic `<svelte:head>` with category name interpolation

- [ ] **[HIGH]** Improve PDP title tag format  
  - Current: `"{product.name}"` (bare name only)  
  - Target: `"{product.name} — Buy Online at Arialshop | Free Delivery"`  
  - File: `src/routes/products/[slug]/+page.svelte`

- [ ] **[CRITICAL]** Add `<meta name="description">` to ALL pages  
  - Homepage: 155-char brand + USP + CTA summary  
  - PDP: `"{product.name} in {color}. {short_description}. Free delivery on orders over ₹X. Easy 7-day returns."`  
  - Category pages: Unique 150-160 char descriptions per category  
  - Policy pages: Minimal but present (prevents Google auto-generating bad snippets)

- [ ] **[HIGH]** Add Open Graph meta tags to all pages  
  ```html
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:image" content="{product.images[0]}" />
  <meta property="og:url" content="https://arialshop.com{$page.url.pathname}" />
  <meta property="og:type" content="product" /> <!-- on PDPs -->
  <meta property="og:site_name" content="Arialshop" />
  ```

- [ ] **[HIGH]** Add Twitter Card meta tags  
  ```html
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{description}" />
  <meta name="twitter:image" content="{product.images[0]}" />
  ```

---

## 2. Heading Structure & Content

- [ ] **[HIGH]** Add meaningful `<h1>` to homepage  
  - Current: No H1. "NEW ARRIVALS" is likely a styled div.  
  - Target: `<h1>Shop Women's Fashion Online — Dresses, Co-ord Sets & More</h1>`  
  - Can be visually hidden if design doesn't accommodate it

- [ ] **[HIGH]** Add H2/H3 structure to PDPs  
  - Add `<h2>Product Details</h2>` above description  
  - Add `<h2>Size Guide</h2>` above measurements  
  - Add `<h2>Delivery & Returns</h2>` above policy snippet  
  - File: `src/routes/products/[slug]/+page.svelte`

- [ ] **[HIGH]** Expand product descriptions — minimum 150 words per PDP  
  - Current: ~30 words, generic warehouse copy  
  - Add: fabric care instructions, styling tips, occasion use  
  - Consider: AI-generation pipeline using product name + category + attributes

- [ ] **[CRITICAL]** Create category landing pages with editorial content  
  - Routes needed: `/womens-dresses`, `/co-ord-sets`, `/jeans`, `/tops`, `/skirts`, `/sweatshirts`  
  - Each page needs: unique H1, 200–300 word intro paragraph, filtered product grid, unique meta  
  - File: `src/routes/[category]/+page.svelte` (new route)

- [ ] **[MEDIUM]** Set up a blog / editorial section  
  - Route: `/blog` and `/blog/[slug]`  
  - Minimum viable: 2–4 articles/month  
  - Target topics: "how to style a maxi skirt", "best co-ord sets 2025", "women's fashion trends India"  
  - Helps build topical authority in women's fashion niche

---

## 3. Structured Data (JSON-LD)

### 3a. Product Schema (PDPs) — CRITICAL

- [ ] **[CRITICAL]** Add `Product` JSON-LD to every PDP  
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "{product.name}",
    "image": ["{product.images[0]}", "{product.images[1]}"],
    "description": "{product.description}",
    "sku": "{product.sku}",
    "brand": {
      "@type": "Brand",
      "name": "Arialshop"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://arialshop.com/products/{product.slug}",
      "priceCurrency": "INR",
      "price": "{product.price}",
      "priceValidUntil": "{next_year}",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  }
  ```

- [ ] **[CRITICAL]** Add `aggregateRating` to Product schema once reviews are live  
  ```json
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "24"
  }
  ```

### 3b. BreadcrumbList Schema — HIGH

- [ ] **[HIGH]** Add `BreadcrumbList` JSON-LD to all PDPs and category pages  
  ```json
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://arialshop.com" },
      { "@type": "ListItem", "position": 2, "name": "Women's Skirts", "item": "https://arialshop.com/skirts" },
      { "@type": "ListItem", "position": 3, "name": "Tiered Maxi Skirt", "item": "https://arialshop.com/products/tiered-maxi-skirt" }
    ]
  }
  ```

### 3c. Organization & WebSite Schema — HIGH

- [ ] **[HIGH]** Add `Organization` JSON-LD to homepage / root layout  
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Arialshop",
    "url": "https://arialshop.com",
    "logo": "https://misiki.s3.amazonaws.com/stores/.../logo-smsqyjuaxtbe.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://www.instagram.com/arialshop",
      "https://www.facebook.com/arialshop"
    ]
  }
  ```

- [ ] **[MEDIUM]** Add `WebSite` schema with `SearchAction` for sitelinks search box  
  ```json
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://arialshop.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://arialshop.com/products?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }
  ```

### 3d. FAQPage Schema — MEDIUM

- [ ] **[MEDIUM]** Add `FAQPage` JSON-LD to PDPs (3–5 Q&As per product)  
  ```json
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What material is the Tiered Maxi Skirt made of?",
        "acceptedAnswer": { "@type": "Answer", "text": "This skirt is made of 100% cotton woven fabric..." }
      },
      {
        "@type": "Question",
        "name": "Does this skirt run true to size?",
        "acceptedAnswer": { "@type": "Answer", "text": "This is a loose-fit style. We recommend your regular size..." }
      },
      {
        "@type": "Question",
        "name": "What is the return policy for this item?",
        "acceptedAnswer": { "@type": "Answer", "text": "Easy 7-day return and replacement. See our full refund policy." }
      }
    ]
  }
  ```

---

## 4. Technical SEO & Crawlability

- [ ] **[CRITICAL]** Fix homepage SSR — product cards must render in initial HTML  
  - Verify `+page.server.js` is fetching and returning products  
  - Googlebot currently sees an empty `NEW ARRIVALS` section with no product cards  
  - Do NOT rely on client-side fetch for content visible above the fold

- [ ] **[CRITICAL]** Generate and submit XML sitemap  
  - Route: `src/routes/sitemap.xml/+server.js`  
  - Include: all PDPs, category pages, blog posts, policy pages  
  - Exclude: `/my/*`, `/cart`, `/checkout`, paginated duplicates  
  - Submit to Google Search Console after deployment

- [ ] **[HIGH]** Add `robots.txt`  
  - Route: `src/routes/robots.txt/+server.js`  
  ```
  User-agent: *
  Allow: /
  Disallow: /my/
  Disallow: /cart
  Disallow: /checkout
  Disallow: /admin
  Sitemap: https://arialshop.com/sitemap.xml
  ```

- [ ] **[HIGH]** Add `<link rel="canonical">` to all pages  
  - Prevents duplicate content from sort/filter URL params  
  - Implementation: in root `+layout.svelte` using `$page.url.origin + $page.url.pathname` (strips query params)  
  ```html
  <link rel="canonical" href="{canonicalUrl}" />
  ```

- [ ] **[HIGH]** Fix image filenames — rename to SEO-friendly slugs  
  - Current: `logo-smsqyjuaxtbe.png` (random hash)  
  - Target: `arialshop-logo.png`, `tiered-maxi-skirt-white-cotton.jpg`  
  - Apply naming convention at upload time in the admin panel

- [ ] **[HIGH]** Fix ALL image alt text  
  - Logo: `alt="Arialshop — Women's Fashion Online"`  
  - Products: `alt="{product.name} in {product.color} — {product.category}"`  
  - Payment icons in footer: add descriptive alt for each (Visa, Mastercard, etc.)

- [ ] **[HIGH]** Add `loading="lazy"` to below-fold images; `fetchpriority="high"` to hero/LCP image  
  - First product image on PDP: `fetchpriority="high"` + `loading="eager"`  
  - All other images: `loading="lazy"`

- [ ] **[MEDIUM]** Handle pagination SEO on `/products` listing  
  - Add `<link rel="next">` and `<link rel="prev">` on paginated pages  
  - OR: set canonical on all paginated pages to page 1 (simpler, may lose deep indexed pages)

- [ ] **[MEDIUM]** Create a proper 404 page  
  - File: `src/routes/+error.svelte`  
  - Must include: search bar, bestseller products, navigation links  
  - Return HTTP 404 status code (not 200)

- [ ] **[HIGH]** Fix SKU rendering bug — number displays as `6.61305E+11`  
  - Store and render SKU as string, not float  
  - This also impacts Product schema `sku` field — must be exact string match  
  - File: wherever product data is rendered on PDP

- [ ] **[HIGH]** Remove duplicate logo/header rendering (logo appears 3×)  
  - Causes duplicate `<header>` and nav blocks in DOM  
  - Confuses crawlers on page structure and internal link weight  
  - This is a critical layout bug in the SvelteKit component tree

---

## 5. URL Structure & Internal Linking

- [ ] **[CRITICAL]** Create category-based URL structure  
  - Current: all products under `/products/[slug]`  
  - Target: `/womens-dresses/[slug]`, `/co-ord-sets/[slug]`, `/jeans/[slug]`  
  - If restructuring is too risky: at minimum create `/products/category/[slug]` filter pages with unique URLs + 301 redirects from old paths

- [ ] **[HIGH]** Add visible breadcrumb navigation component on PDPs and PLPs  
  - Renders as: `Home > Women's Clothing > Skirts > Tiered Maxi Skirt`  
  - Must match the BreadcrumbList JSON-LD schema exactly  
  - File: new `Breadcrumb.svelte` component

- [ ] **[HIGH]** Add "Related Products" block on every PDP  
  - Minimum 4 items, same category  
  - Creates internal links between PDPs — distributes PageRank  
  - File: `src/routes/products/[slug]/+page.svelte`

- [ ] **[MEDIUM]** Expand footer with deep category links  
  - Add column: "Shop by Category" → Dresses, Tops, Jeans, Co-ord Sets, Skirts, Sweatshirts  
  - Add column: "Trending Now" → link to 3–4 bestseller PDPs  
  - File: footer component

- [ ] **[MEDIUM]** Create SEO landing pages for commercial intent queries  
  - Examples: `/buy-maxi-skirt-online-india`, `/women-coord-sets-under-2000`  
  - Each page: unique H1, 200-word intro, product grid filtered by relevant tag

---

## 6. Content & Keyword Strategy

- [ ] **[HIGH]** Expand product name format for search relevance  
  - Current: `"Tiered maxi skirt"` (17 chars)  
  - Target: `"White Cotton Tiered Maxi Skirt — Casual Loose Fit for Women"` (60 chars)  
  - Pattern: `"{Color} {Material} {Product Type} — {Fit/Style} for {Audience}"`

- [ ] **[HIGH]** Include target keyword in first paragraph of every product description  
  - Keyword should appear naturally within first 100 words  
  - Target: primary search term + 1–2 LSI variants

- [ ] **[MEDIUM]** Build a review system and prompt post-purchase reviews  
  - Reviews create keyword-rich UGC that freshens page content  
  - Trigger: post-purchase email at day 7 asking for a review  
  - Display: star rating + review text on PDP

- [ ] **[MEDIUM]** Create a standalone `/size-guide` page  
  - Full size chart for all categories (dresses, tops, bottoms, co-ord sets)  
  - Ranks for `"arialshop size guide"` and `"women's clothing size chart India"`  
  - Link from every PDP size selector

- [ ] **[MEDIUM]** Audit and fix credibility-damaging discount percentages  
  - "WESTERN DRESS" shows 90% OFF (₹999 vs ₹9999)  
  - Extreme discounts trigger Google Shopping disapprovals and hurt brand trust  
  - Keep discounts ≤ 70% or ensure MRP is realistic and consistent

- [ ] **[HIGH]** Create `/about-us` page for E-E-A-T signals  
  - Include: brand founding story, sourcing philosophy, team/founder mention  
  - Google's E-E-A-T framework scores D2C stores lower without brand identity content  
  - Link from footer

---

## 7. Google Tools & Monitoring

- [ ] **[CRITICAL]** Connect Google Search Console  
  - Verify ownership via DNS TXT record or HTML file  
  - Submit sitemap: `https://arialshop.com/sitemap.xml`  
  - Monitor: Index Coverage, Core Web Vitals, Search Performance weekly

- [ ] **[HIGH]** Set up Google Merchant Center for Shopping feed  
  - Generate product feed (XML or Google Sheets) from Litekart product data  
  - Required fields: `id`, `title`, `description`, `link`, `image_link`, `price`, `availability`, `brand`, `gtin` or `mpn`  
  - Enables free Google Shopping listings + Shopping Ads

- [ ] **[HIGH]** Run PageSpeed Insights on homepage and top PDP  
  - Target: LCP < 2.5s, CLS < 0.1, FID/INP < 200ms  
  - Quick fixes: preload LCP image, add image dimensions to prevent CLS, defer non-critical JS

- [ ] **[MEDIUM]** Connect Google Analytics 4 (GA4)  
  - Implement via `+layout.svelte` or GTM  
  - Configure ecommerce events: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`  
  - Link GA4 to GSC and Merchant Center

- [ ] **[MEDIUM]** Set up Bing Webmaster Tools  
  - Submit same sitemap  
  - India has meaningful Bing traffic from Windows/Edge devices

---

## Implementation Priority Order

| Phase | Tasks | Est. Impact |
|-------|-------|-------------|
| **Phase 1 — Week 1** | Fix SSR homepage, add meta descriptions, add Product schema JSON-LD, fix image alt text, fix SKU bug, fix duplicate logo | Indexability unlocked |
| **Phase 2 — Week 2** | Create category pages, add breadcrumbs + BreadcrumbList schema, add canonical tags, generate sitemap + robots.txt | Category ranking begins |
| **Phase 3 — Week 3** | Expand product descriptions, fix product title format, add Organization + WebSite schema, create About Us page | E-E-A-T + rich snippets |
| **Phase 4 — Month 2** | Add OG/Twitter tags, related products, footer deep links, FAQ schema, review system, size guide page | CTR + long-tail coverage |
| **Phase 5 — Ongoing** | Blog content, SEO landing pages, Google Merchant Center feed, GSC monitoring | Topical authority growth |

---

## Files Most Likely to Change

```
src/
├── app.html                          # Global <head> defaults
├── routes/
│   ├── +layout.svelte                # Canonical, OG tags, GA4
│   ├── +page.svelte                  # Homepage SSR fix + H1
│   ├── +page.server.js               # Homepage SSR product fetch
│   ├── products/
│   │   └── [slug]/
│   │       ├── +page.svelte          # PDP title, schema, breadcrumbs, alt text
│   │       └── +page.server.js       # Ensure full product data loaded server-side
│   ├── [category]/
│   │   └── +page.svelte              # NEW: category landing pages
│   ├── sitemap.xml/
│   │   └── +server.js                # NEW: dynamic sitemap
│   ├── robots.txt/
│   │   └── +server.js                # NEW: robots.txt
│   └── about-us/
│       └── +page.svelte              # NEW: About Us page
├── lib/
│   └── components/
│       ├── Breadcrumb.svelte         # NEW: breadcrumb nav component
│       ├── SchemaProduct.svelte      # NEW: Product JSON-LD injector
│       └── RelatedProducts.svelte   # NEW: related products block
```

---

*Generated by Swadesh Behera / Misiki Technologies — arialshop.com SEO audit, April 2026*
