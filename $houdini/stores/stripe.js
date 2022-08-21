import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/stripe'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_stripe = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_stripe
