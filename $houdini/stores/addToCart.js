import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/addToCart'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_addToCart = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_addToCart
