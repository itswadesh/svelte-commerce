import type { productSlug$input, productSlug$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_productSlug: QueryStore<productSlug$result | undefined, productSlug$input, {}> 

export declare const productSlugStore: () => typeof GQL_productSlug

export default GQL_productSlug
