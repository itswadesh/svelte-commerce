import { page } from "$app/state";

export function appendOneTimeCartId(path: string) {
  const oneTimeCartId = page.url.searchParams.get('cart_id')
  if (oneTimeCartId)
    return `${path}?cart_id=${oneTimeCartId}`
  else
    return path
}
