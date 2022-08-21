export default {
    name: "changePassword",
    kind: "HoudiniMutation",
    hash: "6d806ec4d251e7687cc3f95a9d586d7f568fdda9cfb79cee3f5a3e7fa62bd238",

    raw: `mutation changePassword($oldPassword: String!, $password: String!, $passwordConfirmation: String!) {
  changePassword(
    oldPassword: $oldPassword
    password: $password
    passwordConfirmation: $passwordConfirmation
  )
}
`,

    rootType: "Mutation",

    selection: {
        changePassword: {
            type: "Boolean",
            keyRaw: "changePassword(oldPassword: $oldPassword, password: $password, passwordConfirmation: $passwordConfirmation)",
            nullable: true
        }
    },

    input: {
        fields: {
            oldPassword: "String",
            password: "String",
            passwordConfirmation: "String"
        },

        types: {}
    }
};

"HoudiniHash=e5148bfe1046645639a54400dacdca121e4d8f3d0f369803380c7d72c166f826";