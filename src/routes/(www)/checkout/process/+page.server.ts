import { redirect } from "@sveltejs/kit"
import { wwwCheckoutProcessLoadServer } from "$lib/core/load-functions/index.js"

export const load = wwwCheckoutProcessLoadServer(redirect)

