export default {
    name: "saveStoreCountry",
    kind: "HoudiniMutation",
    hash: "3572ab3dbd09f93d198240c4760f24105a436a6827c2f0191c2469cb16a312c5",

    raw: `mutation saveStoreCountry($id: String!, $country: ID, $default: Boolean, $active: Boolean) {
  saveStoreCountry(id: $id, country: $country, default: $default, active: $active) {
    id
    default
    active
    country
    name
    code
    user
    store
  }
}
`,

    rootType: "Mutation",

    selection: {
        saveStoreCountry: {
            type: "OneStoreCountry",
            keyRaw: "saveStoreCountry(id: $id, country: $country, default: $default, active: $active)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                },

                default: {
                    type: "Boolean",
                    keyRaw: "default",
                    nullable: true
                },

                active: {
                    type: "Boolean",
                    keyRaw: "active",
                    nullable: true
                },

                country: {
                    type: "ID",
                    keyRaw: "country",
                    nullable: true
                },

                name: {
                    type: "String",
                    keyRaw: "name",
                    nullable: true
                },

                code: {
                    type: "String",
                    keyRaw: "code",
                    nullable: true
                },

                user: {
                    type: "ID",
                    keyRaw: "user",
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
            country: "ID",
            default: "Boolean",
            active: "Boolean"
        },

        types: {}
    }
};

"HoudiniHash=3b808f791a4c2dc8623a8601f15e898d057555b9cbc876199b65b949e77ff6d8";