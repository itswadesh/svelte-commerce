export default {
    name: "emailPassword",
    kind: "HoudiniMutation",
    hash: "e5b61225e37c1110db90456dd897721165d23a711698a8cfb3cc13c36cda12b0",

    raw: `mutation emailPassword($email: String!, $referrer: String!) {
  emailPassword(email: $email, referrer: $referrer)
}
`,

    rootType: "Mutation",

    selection: {
        emailPassword: {
            type: "String",
            keyRaw: "emailPassword(email: $email, referrer: $referrer)",
            nullable: true
        }
    },

    input: {
        fields: {
            email: "String",
            referrer: "String"
        },

        types: {}
    }
};

"HoudiniHash=e5b61225e37c1110db90456dd897721165d23a711698a8cfb3cc13c36cda12b0";