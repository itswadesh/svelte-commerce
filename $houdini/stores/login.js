import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/login'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_login = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_login
