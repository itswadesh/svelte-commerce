import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/myAddresses'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_myAddresses",
    paginated: false,
    paginationMethods: [],
})

export const GQL_myAddresses = factory()

export const myAddressesStore = factory

export default GQL_myAddresses
