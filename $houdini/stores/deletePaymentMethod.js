import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/deletePaymentMethod'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_deletePaymentMethod = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_deletePaymentMethod
