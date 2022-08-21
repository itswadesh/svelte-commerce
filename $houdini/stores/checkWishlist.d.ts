import type { checkWishlist$input, checkWishlist$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_checkWishlist: QueryStore<checkWishlist$result | undefined, checkWishlist$input, {}> 

export declare const checkWishlistStore: () => typeof GQL_checkWishlist

export default GQL_checkWishlist
