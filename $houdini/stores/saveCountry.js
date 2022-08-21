import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/saveCountry'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_saveCountry = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_saveCountry
