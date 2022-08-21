import type { INIT$input, INIT$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_INIT: QueryStore<INIT$result | undefined, INIT$input, {}> 

export declare const INITStore: () => typeof GQL_INIT

export default GQL_INIT
