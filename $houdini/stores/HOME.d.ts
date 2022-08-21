import type { HOME$input, HOME$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_HOME: QueryStore<HOME$result | undefined, HOME$input, {}> 

export declare const HOMEStore: () => typeof GQL_HOME

export default GQL_HOME
