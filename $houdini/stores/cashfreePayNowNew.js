import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/cashfreePayNowNew'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_cashfreePayNowNew = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_cashfreePayNowNew
