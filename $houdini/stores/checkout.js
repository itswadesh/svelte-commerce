import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/checkout'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_checkout = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_checkout
