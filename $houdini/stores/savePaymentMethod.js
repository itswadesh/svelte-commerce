import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/savePaymentMethod'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_savePaymentMethod = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_savePaymentMethod
