export default {
    name: "verifyOtp",
    kind: "HoudiniMutation",
    hash: "9fc2301a781e14f4c4af0695040414b873b6013e924db8c204fe8e4807752b56",

    raw: `mutation verifyOtp($phone: String!, $otp: String!, $store: ID) {
  verifyOtp(phone: $phone, otp: $otp, store: $store) {
    id
    firstName
    lastName
    email
    phone
    role
    verified
    active
    avatar
    avatarCdn
    sid
  }
}
`,

    rootType: "Mutation",

    selection: {
        verifyOtp: {
            type: "User",
            keyRaw: "verifyOtp(phone: $phone, otp: $otp, store: $store)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                },

                firstName: {
                    type: "String",
                    keyRaw: "firstName",
                    nullable: true
                },

                lastName: {
                    type: "String",
                    keyRaw: "lastName",
                    nullable: true
                },

                email: {
                    type: "String",
                    keyRaw: "email",
                    nullable: true
                },

                phone: {
                    type: "String",
                    keyRaw: "phone",
                    nullable: true
                },

                role: {
                    type: "String",
                    keyRaw: "role",
                    nullable: true
                },

                verified: {
                    type: "Boolean",
                    keyRaw: "verified",
                    nullable: true
                },

                active: {
                    type: "Boolean",
                    keyRaw: "active",
                    nullable: true
                },

                avatar: {
                    type: "String",
                    keyRaw: "avatar",
                    nullable: true
                },

                avatarCdn: {
                    type: "String",
                    keyRaw: "avatarCdn",
                    nullable: true
                },

                sid: {
                    type: "String",
                    keyRaw: "sid",
                    nullable: true
                }
            }
        }
    },

    input: {
        fields: {
            phone: "String",
            otp: "String",
            store: "ID"
        },

        types: {}
    }
};

"HoudiniHash=88e124bba162cc004c3eadf55a9a087ec40c9311940b63954dd6ce21b31642f2";