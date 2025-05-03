import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
	const domain = url.host
	const robotsTxt = `# we use Litekart as our ecommerce platform

User-agent: *
Disallow: /checkout/*
Disallow: /my/*
Disallow: /products/*sort_by*
Disallow: /*/products/*sort_by*
Disallow: /products/*+*
Disallow: /products/*%2B*
Disallow: /products/*%2b*
Disallow: /*/products/*+*
Disallow: /*/products/*%2B*
Disallow: /*/products/*%2b*
Disallow: */products/*filter*&*filter*
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /policies/
Disallow: /*/policies/
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /apple-app-site-association
Disallow: /.well-known/litekart/monorail
Disallow: /cdn/wpm/*.js
Sitemap: https://${domain}/sitemaps/${domain}-sitemaps/sitemap_index.xml

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/*
Disallow: /my/*
Disallow: /*?*oseid=*
Disallow: /*preview_script_id*
Disallow: /cdn/wpm/*.js

User-agent: Nutch
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 10
Disallow: /my/*
Disallow: /checkouts/*
Disallow: /products/*sort_by*
Disallow: /*/products/*sort_by*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /apple-app-site-association
Disallow: /.well-known/litekart/monorail
Disallow: /cdn/wpm/*.js
Sitemap: https://${domain}/sitemaps/${domain}-sitemaps/sitemap_index.xml

User-agent: AhrefsSiteAudit
Crawl-delay: 10
Disallow: /my/*
Disallow: /checkouts/*
Disallow: /products/*sort_by*
Disallow: /*/products/*sort_by*
Disallow: /products/*+*
Disallow: /products/*%2B*
Disallow: /products/*%2b*
Disallow: /*/products/*+*
Disallow: /*/products/*%2B*
Disallow: /*/products/*%2b*
Disallow: */products/*filter*&*filter*
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /policies/
Disallow: /*/policies/
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /apple-app-site-association
Disallow: /.well-known/litekart/monorail
Disallow: /cdn/wpm/*.js
Sitemap: https://${domain}/sitemaps/${domain}-sitemaps/sitemap_index.xml

User-agent: MJ12bot
Crawl-delay: 10

User-agent: Pinterest
Crawl-delay: 1`

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain'
		}
	})
}
