export default {
    name: "storeCountry",
    kind: "HoudiniQuery",
    hash: "22052894908deba81ea70718e5ec58daab01d3423b24beec7aeb868b3d23eea1",

    raw: `query storeCountry($id: ID!) {
  storeCountry(id: $id) {
    id
    default
    active
    name
    code
    country {
      id
      name
      value
      dialCode
      code
      img
      imgCdn
      flag
      lang
    }
    user {
      id
      firstName
      lastName
    }
  }
}
`,

    rootType: "Query",

    selection: {
        storeCountry: {
            type: "StoreCountry",
            keyRaw: "storeCountry(id: $id)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                },

                default: {
                    type: "Boolean",
                    keyRaw: "default",
                    nullable: true
                },

                active: {
                    type: "Boolean",
                    keyRaw: "active",
                    nullable: true
                },

                name: {
                    type: "String",
                    keyRaw: "name",
                    nullable: true
                },

                code: {
                    type: "String",
                    keyRaw: "code",
                    nullable: true
                },

                country: {
                    type: "Country",
                    keyRaw: "country",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id"
                        },

                        name: {
                            type: "String",
                            keyRaw: "name"
                        },

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        },

                        dialCode: {
                            type: "String",
                            keyRaw: "dialCode",
                            nullable: true
                        },

                        code: {
                            type: "String",
                            keyRaw: "code",
                            nullable: true
                        },

                        img: {
                            type: "String",
                            keyRaw: "img",
                            nullable: true
                        },

                        imgCdn: {
                            type: "String",
                            keyRaw: "imgCdn",
                            nullable: true
                        },

                        flag: {
                            type: "String",
                            keyRaw: "flag",
                            nullable: true
                        },

                        lang: {
                            type: "String",
                            keyRaw: "lang",
                            nullable: true
                        }
                    }
                },

                user: {
                    type: "User",
                    keyRaw: "user",
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
                        }
                    }
                }
            }
        }
    },

    input: {
        fields: {
            id: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=22052894908deba81ea70718e5ec58daab01d3423b24beec7aeb868b3d23eea1";