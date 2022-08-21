import type { myOrderItems$input, myOrderItems$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_myOrderItems: QueryStore<myOrderItems$result | undefined, myOrderItems$input, {}> 

export declare const myOrderItemsStore: () => typeof GQL_myOrderItems

export default GQL_myOrderItems
