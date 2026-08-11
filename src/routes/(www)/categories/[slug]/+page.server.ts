import { redirect } from '@sveltejs/kit'

// `/categories/<slug>` was served from a hardcoded demo fixture in the core package: a literal
// object with exactly three keys (women/men/home), all three carrying the same fabricated
// collections, subcategory names, product counts and litekart.in S3 images. Every real category
// link 404'd, and the three that resolved published invented content — headings, breadcrumbs and
// another company's images — under the merchant's own domain with a self-referencing canonical.
//
// The bare slug route is the canonical listing for a category (see CLAUDE.md link conventions),
// so `/categories/<slug>` permanently redirects to `/<slug>` instead of rendering the fixture.
export const load = async ({ params }: { params: { slug: string } }) => {
	redirect(301, `/${params.slug}`)
}
