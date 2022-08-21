import { houdiniConfig } from '$houdini'
import artifact from '../artifacts/saveAddress'
import { mutationStore } from '../runtime/stores'
import { defaultConfigValues } from '../runtime/lib'

export const GQL_saveAddress = mutationStore({
    config: defaultConfigValues(houdiniConfig),
	artifact,
})

export default GQL_saveAddress
