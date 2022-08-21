import type { paymentMethod$input, paymentMethod$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_paymentMethod: QueryStore<paymentMethod$result | undefined, paymentMethod$input, {}> 

export declare const paymentMethodStore: () => typeof GQL_paymentMethod

export default GQL_paymentMethod
