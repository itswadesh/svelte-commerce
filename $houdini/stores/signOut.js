import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/signOut'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_signOut = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_signOut
