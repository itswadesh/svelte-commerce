import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/deleteCountry'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_deleteCountry = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_deleteCountry
