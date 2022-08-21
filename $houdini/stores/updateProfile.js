import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/updateProfile'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_updateProfile = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_updateProfile
