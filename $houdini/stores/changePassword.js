import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/changePassword'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_changePassword = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_changePassword
