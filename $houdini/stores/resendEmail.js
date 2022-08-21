import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/resendEmail'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_resendEmail = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_resendEmail
