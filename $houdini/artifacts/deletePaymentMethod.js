export default {
    name: "deletePaymentMethod",
    kind: "HoudiniMutation",
    hash: "fc8375768580243ae97111d8375c834fcdf77a0990fc8e57a46a4864300f4b5a",

    raw: `mutation deletePaymentMethod($id: ID!) {
  deletePaymentMethod(id: $id)
}
`,

    rootType: "Mutation",

    selection: {
        deletePaymentMethod: {
            type: "Boolean",
            keyRaw: "deletePaymentMethod(id: $id)",
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

"HoudiniHash=fc8375768580243ae97111d8375c834fcdf77a0990fc8e57a46a4864300f4b5a";