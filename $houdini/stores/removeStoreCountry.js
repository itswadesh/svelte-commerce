import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/removeStoreCountry'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_removeStoreCountry = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_removeStoreCountry
