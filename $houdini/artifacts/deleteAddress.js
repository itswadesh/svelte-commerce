export default {
    name: "deleteAddress",
    kind: "HoudiniMutation",
    hash: "86933e72e90365afcb3b8c7a514c962ce64c8349503a6793a6b864122a18eaf7",

    raw: `mutation deleteAddress($id: ID!) {
  deleteAddress(id: $id)
}
`,

    rootType: "Mutation",

    selection: {
        deleteAddress: {
            type: "Boolean",
            keyRaw: "deleteAddress(id: $id)",
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

"HoudiniHash=86933e72e90365afcb3b8c7a514c962ce64c8349503a6793a6b864122a18eaf7";