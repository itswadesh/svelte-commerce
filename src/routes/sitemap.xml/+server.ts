import { redirectToSitemap } from "@misiki/kitcommerce-core/request-handlers";
import { redirect } from "@sveltejs/kit";

export const GET = redirectToSitemap(redirect)
