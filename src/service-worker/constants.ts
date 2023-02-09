import { build, files, version } from '$service-worker'

export const CACHE = 'litekart-cache-v1'

export const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
]
