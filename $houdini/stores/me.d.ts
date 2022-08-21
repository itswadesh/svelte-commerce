import type { me$input, me$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_me: QueryStore<me$result | undefined, null, {}> 

export declare const meStore: () => typeof GQL_me

export default GQL_me
