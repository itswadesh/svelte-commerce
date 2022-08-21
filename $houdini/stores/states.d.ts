import type { states$input, states$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_states: QueryStore<states$result | undefined, states$input, {}> 

export declare const statesStore: () => typeof GQL_states

export default GQL_states
