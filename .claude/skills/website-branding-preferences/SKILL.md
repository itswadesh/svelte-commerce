---
name: website-branding-preferences
description: Apply the user's default website branding preferences. Use when building, editing, redesigning, cloning, recreating, or implementing a website, landing page, ecommerce UI, frontend app, or brand-bearing web experience, especially when a logo, brand name, header, navbar, hero, favicon, or site identity is involved.
version: 1.0.0
user-invocable: true
argument-hint: "[source brand or site]"
---

## Rules

- Do not use exact real logos, copied logo marks, or lookalike logo artwork for website builds unless the user explicitly provides permission and assets.
- Replace logo marks with the website name itself as a text wordmark in the UI.
- Rename the brand/site name to `Website-$1` by default, preserving `$1` as the user-provided or inferred original brand/site identifier.
- If the source brand name is ambiguous, choose a simple descriptive suffix for `$1` from the user's request or the project context.
- Apply the text wordmark consistently in navbars, headers, footers, favicons where practical, metadata, page titles, mock data, and visible copy touched by the task.
- Keep the result visually polished: treat `Website-$1` as the brand, not as a placeholder label.

## Examples

- A Shopify-inspired storefront for "Acme" should display `Website-Acme` as text instead of an Acme logo.
- A redesign based on an existing site should replace copied logo imagery with a styled `Website-[source-name]` wordmark.
