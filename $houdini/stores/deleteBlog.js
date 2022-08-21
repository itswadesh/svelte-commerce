import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/deleteBlog'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_deleteBlog = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_deleteBlog
