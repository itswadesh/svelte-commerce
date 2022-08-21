import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/getOtp'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_getOtp = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_getOtp
