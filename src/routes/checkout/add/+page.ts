import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '@sveltejs/kit'
export const load: PageLoad = async ({ url, session }) => {
if (!session?.me) {
	throw redirect(302, `/${loginUrl}?ref=${url.pathname}`);
}
return {}
}
