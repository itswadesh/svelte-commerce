import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/deleteAddress'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_deleteAddress = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_deleteAddress
