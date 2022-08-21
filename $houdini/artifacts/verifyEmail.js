export default {
    name: "verifyEmail",
    kind: "HoudiniMutation",
    hash: "e93535a72f07184c575e062bbe07681e162c0e30ecc0fcd987e219144bdf7387",

    raw: `mutation verifyEmail($id: ID!, $token: String!, $expires: String!, $signature: String!, $store: ID) {
  verifyEmail(
    id: $id
    token: $token
    expires: $expires
    signature: $signature
    store: $store
  )
}
`,

    rootType: "Mutation",

    selection: {
        verifyEmail: {
            type: "Boolean",
            keyRaw: "verifyEmail(id: $id, token: $token, expires: $expires, signature: $signature, store: $store)",
            nullable: true
        }
    },

    input: {
        fields: {
            id: "ID",
            token: "String",
            expires: "String",
            signature: "String",
            store: "ID"
        },

        types: {}
    }
};

"HoudiniHash=8cdd1210af913d3e29d40061f85e0b8e183ac85940469c062da81893538c7910";