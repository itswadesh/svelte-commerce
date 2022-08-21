import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/verifyOtp'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_verifyOtp = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_verifyOtp
