import { redirect } from "@sveltejs/kit"

export const checkSecuredCatalogue = (isAuthCookiePresent: boolean, referer: string | null, url: URL) => {
  if (isAuthCookiePresent) return

  let redirectUrl = new URL(referer || url.origin)
  if (redirectUrl.pathname === url.pathname) redirectUrl = new URL(url.origin)
  redirectUrl.searchParams.set("show_auth", "true")
  redirectUrl.searchParams.set("redirect", url.pathname + url.search)
  redirect(307, redirectUrl)
}
