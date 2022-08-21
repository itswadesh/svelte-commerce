export default {
    name: "login",
    kind: "HoudiniMutation",
    hash: "5bf2cd72368ca5591a4592a6dc34afb9b2c435c41f1d14fac483a845427af766",

    raw: `mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    email
    firstName
    lastName
    city
    phone
    avatar
    avatarCdn
    role
    verified
    active
    provider
    store {
      name
      id
    }
    vendor
    plan
    createdAt
    updatedAt
  }
}
`,

    rootType: "Mutation",

    selection: {
        login: {
            type: "User",
            keyRaw: "login(email: $email, password: $password)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                },

                email: {
                    type: "String",
                    keyRaw: "email",
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

                city: {
                    type: "String",
                    keyRaw: "city",
                    nullable: true
                },

                phone: {
                    type: "String",
                    keyRaw: "phone",
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

                store: {
                    type: "Store",
                    keyRaw: "store",
                    nullable: true,

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                },

                vendor: {
                    type: "ID",
                    keyRaw: "vendor",
                    nullable: true
                },

                plan: {
                    type: "String",
                    keyRaw: "plan",
                    nullable: true
                },

                createdAt: {
                    type: "String",
                    keyRaw: "createdAt",
                    nullable: true
                },

                updatedAt: {
                    type: "String",
                    keyRaw: "updatedAt",
                    nullable: true
                }
            }
        }
    },

    input: {
        fields: {
            email: "String",
            password: "String"
        },

        types: {}
    }
};

"HoudiniHash=f5dc5a1c94c8535072508336bd8d0092f59c52e60c2b0d10124fb4351ae1aca8";