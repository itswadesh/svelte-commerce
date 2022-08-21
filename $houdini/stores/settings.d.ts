import type { settings$input, settings$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_settings: QueryStore<settings$result | undefined, null, {}> 

export declare const settingsStore: () => typeof GQL_settings

export default GQL_settings
