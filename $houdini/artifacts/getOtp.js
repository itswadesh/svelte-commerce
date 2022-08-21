export default {
    name: "getOtp",
    kind: "HoudiniMutation",
    hash: "c792a99a036ba7ce0e718951689a8ba55d004b9d98bbc4a4e78110486b870c01",

    raw: `mutation getOtp($phone: String!, $role: String, $store: ID) {
  getOtp(phone: $phone, role: $role, store: $store) {
    otp
    timer
  }
}
`,

    rootType: "Mutation",

    selection: {
        getOtp: {
            type: "Otp",
            keyRaw: "getOtp(phone: $phone, role: $role, store: $store)",
            nullable: true,

            fields: {
                otp: {
                    type: "String",
                    keyRaw: "otp",
                    nullable: true
                },

                timer: {
                    type: "Int",
                    keyRaw: "timer",
                    nullable: true
                }
            }
        }
    },

    input: {
        fields: {
            phone: "String",
            role: "String",
            store: "ID"
        },

        types: {}
    }
};

"HoudiniHash=c792a99a036ba7ce0e718951689a8ba55d004b9d98bbc4a4e78110486b870c01";