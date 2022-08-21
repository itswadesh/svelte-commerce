export default {
    name: "resendEmail",
    kind: "HoudiniMutation",
    hash: "8cb64cf7ec6d629cbcf829e39df1efec5036b5c903bec8f034b97389fdda5f75",

    raw: `mutation resendEmail($email: String) {
  resendEmail(email: $email)
}
`,

    rootType: "Mutation",

    selection: {
        resendEmail: {
            type: "String",
            keyRaw: "resendEmail(email: $email)",
            nullable: true
        }
    },

    input: {
        fields: {
            email: "String"
        },

        types: {}
    }
};

"HoudiniHash=8cb64cf7ec6d629cbcf829e39df1efec5036b5c903bec8f034b97389fdda5f75";