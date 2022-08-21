export default {
    name: "saveAddress",
    kind: "HoudiniMutation",
    hash: "f350dfb6df5e9cbdcc205ccde4ae6ccf0d914724a4ab7735ae251afb915ced8d",

    raw: `mutation saveAddress($id: String!, $firstName: String, $lastName: String, $type: String, $address: String, $locality: String, $town: String, $district: String, $city: String, $country: String, $state: String, $zip: String, $phone: String, $email: String, $lat: Float, $lng: Float, $store: ID, $isResidential: Boolean) {
  saveAddress(
    id: $id
    firstName: $firstName
    lastName: $lastName
    type: $type
    address: $address
    locality: $locality
    town: $town
    district: $district
    city: $city
    country: $country
    state: $state
    zip: $zip
    phone: $phone
    email: $email
    lat: $lat
    lng: $lng
    store: $store
    isResidential: $isResidential
  ) {
    id
    firstName
    lastName
    address
    locality
    town
    district
    city
    type
    country
    state
    zip
    phone
    email
    lat
    lng
    isResidential
    store
  }
}
`,

    rootType: "Mutation",

    selection: {
        saveAddress: {
            type: "Address",
            keyRaw: "saveAddress(id: $id, firstName: $firstName, lastName: $lastName, type: $type, address: $address, locality: $locality, town: $town, district: $district, city: $city, country: $country, state: $state, zip: $zip, phone: $phone, email: $email, lat: $lat, lng: $lng, store: $store, isResidential: $isResidential)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id"
                },

                firstName: {
                    type: "String",
                    keyRaw: "firstName",
                    nullable: true
                },

                lastName: {
                    type: "String",
                    keyRaw: "lastName",
                    nullable: true
                },

                address: {
                    type: "String",
                    keyRaw: "address",
                    nullable: true
                },

                locality: {
                    type: "String",
                    keyRaw: "locality",
                    nullable: true
                },

                town: {
                    type: "String",
                    keyRaw: "town",
                    nullable: true
                },

                district: {
                    type: "String",
                    keyRaw: "district",
                    nullable: true
                },

                city: {
                    type: "String",
                    keyRaw: "city",
                    nullable: true
                },

                type: {
                    type: "String",
                    keyRaw: "type",
                    nullable: true
                },

                country: {
                    type: "String",
                    keyRaw: "country",
                    nullable: true
                },

                state: {
                    type: "String",
                    keyRaw: "state",
                    nullable: true
                },

                zip: {
                    type: "String",
                    keyRaw: "zip",
                    nullable: true
                },

                phone: {
                    type: "String",
                    keyRaw: "phone",
                    nullable: true
                },

                email: {
                    type: "String",
                    keyRaw: "email",
                    nullable: true
                },

                lat: {
                    type: "Float",
                    keyRaw: "lat",
                    nullable: true
                },

                lng: {
                    type: "Float",
                    keyRaw: "lng",
                    nullable: true
                },

                isResidential: {
                    type: "Boolean",
                    keyRaw: "isResidential",
                    nullable: true
                },

                store: {
                    type: "ID",
                    keyRaw: "store",
                    nullable: true
                }
            }
        }
    },

    input: {
        fields: {
            id: "String",
            firstName: "String",
            lastName: "String",
            type: "String",
            address: "String",
            locality: "String",
            town: "String",
            district: "String",
            city: "String",
            country: "String",
            state: "String",
            zip: "String",
            phone: "String",
            email: "String",
            lat: "Float",
            lng: "Float",
            store: "ID",
            isResidential: "Boolean"
        },

        types: {}
    }
};

"HoudiniHash=44a875306b0e83da90d6d659376ef5366c44d1a66e5210f5f81cdbcce9327edd";