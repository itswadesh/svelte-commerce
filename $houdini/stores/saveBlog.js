import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/saveBlog'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_saveBlog = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_saveBlog
