export default {
    name: "me",
    kind: "HoudiniQuery",
    hash: "b61d47dadf3d4c8d73b91ee643267b14a9022c7109eb005948591c3ef4a3fe1b",

    raw: `query me {
  me {
    id
    firstName
    lastName
    email
    phone
    gender
    role
    verified
    active
    provider
    avatar
    avatarCdn
    referralCode
    currentBalance
    store
  }
}
`,

    rootType: "Query",

    selection: {
        me: {
            type: "UserOne",
            keyRaw: "me",
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

                gender: {
                    type: "String",
                    keyRaw: "gender",
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

                provider: {
                    type: "String",
                    keyRaw: "provider",
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

                referralCode: {
                    type: "String",
                    keyRaw: "referralCode",
                    nullable: true
                },

                currentBalance: {
                    type: "Float",
                    keyRaw: "currentBalance",
                    nullable: true
                },

                store: {
                    type: "ID",
                    keyRaw: "store",
                    nullable: true
                }
            }
        }
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=02283f5d8929c7bc647291fc102d0aa22af4dd56146508f35ee77fa6cbca0b36";