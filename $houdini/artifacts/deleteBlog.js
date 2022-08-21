export default {
    name: "deleteBlog",
    kind: "HoudiniMutation",
    hash: "1638b6be277c04acc04a49a9199780372538dc5fd8905c4a58e044cae847c9f8",

    raw: `mutation deleteBlog($id: ID!) {
  deleteBlog(id: $id)
}
`,

    rootType: "Mutation",

    selection: {
        deleteBlog: {
            type: "Boolean",
            keyRaw: "deleteBlog(id: $id)",
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

"HoudiniHash=1638b6be277c04acc04a49a9199780372538dc5fd8905c4a58e044cae847c9f8";