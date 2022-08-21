import type { myWishlist$input, myWishlist$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_myWishlist: QueryStore<myWishlist$result | undefined, myWishlist$input, {}> 

export declare const myWishlistStore: () => typeof GQL_myWishlist

export default GQL_myWishlist
