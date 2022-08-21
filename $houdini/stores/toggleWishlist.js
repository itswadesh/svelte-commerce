import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/toggleWishlist'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_toggleWishlist = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_toggleWishlist
