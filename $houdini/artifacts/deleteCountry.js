export default {
    name: "deleteCountry",
    kind: "HoudiniMutation",
    hash: "9f3f6f435ca01bd1fc974bcb09b875873b4d4e2e635c5119937293e45c427337",

    raw: `mutation deleteCountry($id: ID!) {
  deleteCountry(id: $id)
}
`,

    rootType: "Mutation",

    selection: {
        deleteCountry: {
            type: "Boolean",
            keyRaw: "deleteCountry(id: $id)",
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

"HoudiniHash=ef00065ba8ca1c091f4929707b253998c6c910277d35ede6dd3917f20af5afdb";