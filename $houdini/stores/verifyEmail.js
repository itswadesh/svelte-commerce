import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/verifyEmail'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_verifyEmail = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_verifyEmail
