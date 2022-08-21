import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/paySuccessPageHit'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_paySuccessPageHit = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_paySuccessPageHit
