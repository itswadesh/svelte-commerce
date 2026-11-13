import { initActiveConnector } from '$lib/core/connectors/init'
import { connectorName } from '$lib/core/connectors/active'
import { skipMissingShelves } from '$lib/core/connectors/missing-shelves'
import { cartService, collectionService, productService } from '$lib/core/services'
import { guardPlainAdds } from '$lib/product/designable'

guardPlainAdds(cartService)
// GoCommerce's shelves are collections; other backends mean something else by "featured".
if (connectorName === 'gocommerce') skipMissingShelves(productService, collectionService)

export const init = initActiveConnector
