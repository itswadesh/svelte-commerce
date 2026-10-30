import { initActiveConnector } from '$lib/core/connectors/init'
import { cartService } from '$lib/core/services'
import { guardPlainAdds } from '$lib/product/designable'

guardPlainAdds(cartService)

export const init = initActiveConnector
