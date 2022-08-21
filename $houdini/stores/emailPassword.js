import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/emailPassword'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_emailPassword = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_emailPassword
