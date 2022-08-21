import type { megamenu$input, megamenu$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_megamenu: QueryStore<megamenu$result | undefined, megamenu$input, {}> 

export declare const megamenuStore: () => typeof GQL_megamenu

export default GQL_megamenu
