import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/saveStoreCountry'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_saveStoreCountry = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_saveStoreCountry
