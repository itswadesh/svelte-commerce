export default {
    name: "removeStoreCountry",
    kind: "HoudiniMutation",
    hash: "377ac1a50a590ce3afab71dcb1e5bedde9a5c4eacdc45c332640509165290846",

    raw: `mutation removeStoreCountry($id: ID!) {
  removeStoreCountry(id: $id)
}
`,

    rootType: "Mutation",

    selection: {
        removeStoreCountry: {
            type: "Boolean",
            keyRaw: "removeStoreCountry(id: $id)",
            nullable: true
        }
    },

    input: {
        fields: {
            id: "ID"
        },

        types: {}
    }
};

"HoudiniHash=377ac1a50a590ce3afab71dcb1e5bedde9a5c4eacdc45c332640509165290846";