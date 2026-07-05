/**
 * HTML extraction — pulls embedded <style> blocks, inline styles, Google Fonts
 * links, logo/favicon assets, store metadata, and slices the page into named
 * structural sections (header / hero / product-card / footer …) that the AI
 * restyle step later pairs with svelte-commerce components.
 */
import * as cheerio from 'cheerio';
import fs from 'node:fs';
import { ingestCss } from './css.js';

const SECTION_MATCHERS = [
  { name: 'header',       sel: 'header, .header, .site-header, .navbar, nav.main-nav, #header' },
  { name: 'hero',         sel: '.hero, .banner, .slider, .carousel, .jumbotron, #hero, .main-banner' },
  { name: 'product-card', sel: '.product-card, .product-item, .product, .card.product, .grid-item.product, [class*="product-card"]' },
  { name: 'product-grid', sel: '.products, .product-grid, .product-list, .collection-grid, [class*="product-grid"]' },
  { name: 'category-nav', sel: '.categories, .category-list, .collections, [class*="category"]' },
  { name: 'testimonial',  sel: '.testimonial, .reviews, .review, [class*="testimonial"]' },
  { name: 'newsletter',   sel: '.newsletter, .subscribe, [class*="newsletter"]' },
  { name: 'footer',       sel: 'footer, .footer, .site-footer, #footer' },
  { name: 'announcement', sel: '.announcement, .topbar, .top-bar, .promo-bar, [class*="announcement"]' },
];

export function extractHtml(htmlFiles, signals) {
  const structure = { sections: {}, assets: {}, meta: {}, googleFonts: [], pages: [] };

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html);
    structure.pages.push(file);

    // 1) Embedded <style> blocks feed the same CSS signal pipeline
    $('style').each((_, el) => ingestCss($(el).text(), signals, `inline:${file}`));

    // 2) Inline style="" attributes (weighted low, but real)
    $('[style]').each((_, el) => {
      const styleAttr = $(el).attr('style') || '';
      const tag = el.tagName || 'div';
      const cls = ($(el).attr('class') || '').split(/\s+/).slice(0, 3).join('.');
      ingestCss(`${tag}${cls ? '.' + cls : ''} { ${styleAttr} }`, signals, `attr:${file}`);
    });

    // 3) Google Fonts / font links
    $('link[href*="fonts.googleapis"], link[href*="fonts.bunny"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        structure.googleFonts.push(href);
        for (const m of href.matchAll(/family=([^&:]+)/g)) {
          signals.fonts.push({ family: decodeURIComponent(m[1]).replace(/\+/g, ' '), selector: '@import', context: ['linked'] });
        }
      }
    });

    // 4) Assets: logo + favicon
    if (!structure.assets.logo) {
      const logo = $('img[class*="logo"], .logo img, a[class*="logo"] img, header img, img[alt*="logo" i]').first();
      if (logo.length) structure.assets.logo = logo.attr('src');
    }
    if (!structure.assets.favicon) {
      const fav = $('link[rel*="icon"]').first();
      if (fav.length) structure.assets.favicon = fav.attr('href');
    }

    // 5) Store metadata
    structure.meta.title ||= $('title').text().trim() || undefined;
    structure.meta.description ||= $('meta[name="description"]').attr('content');
    structure.meta.themeColor ||= $('meta[name="theme-color"]').attr('content');
    structure.meta.ogSiteName ||= $('meta[property="og:site_name"]').attr('content');

    // 6) Structural sections → outerHTML snippets for the AI restyle step
    for (const { name, sel } of SECTION_MATCHERS) {
      if (structure.sections[name]) continue;
      const el = $(sel).first();
      if (el.length) {
        structure.sections[name] = {
          html: trimHtml($.html(el), 12000),
          classes: el.attr('class') || '',
          sourceFile: file,
        };
      }
    }
  }
  return structure;
}

function trimHtml(html, max) {
  if (html.length <= max) return html;
  return html.slice(0, max) + '\n<!-- …truncated -->';
}
