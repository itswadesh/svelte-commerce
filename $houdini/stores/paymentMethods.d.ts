import type { paymentMethods$input, paymentMethods$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_paymentMethods: QueryStore<paymentMethods$result | undefined, paymentMethods$input, {}> 

export declare const paymentMethodsStore: () => typeof GQL_paymentMethods

export default GQL_paymentMethods
