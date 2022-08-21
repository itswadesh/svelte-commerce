import type { cart$input, cart$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_cart: QueryStore<cart$result | undefined, cart$input, {}> 

export declare const cartStore: () => typeof GQL_cart

export default GQL_cart
