export default {
    name: "country",
    kind: "HoudiniQuery",
    hash: "95d09ff0e77a2a6124999754c7aa9bc88042826aa97a4802ea095787ca90c1d5",

    raw: `query country($id: String) {
  country(id: $id) {
    id
    name
    value
    dialCode
    code
    img
    imgCdn
    flag
    lang
    states {
      name
      id
    }
    sort
    active
  }
}
`,

    rootType: "Query",

    selection: {
        country: {
            type: "Country",
            keyRaw: "country(id: $id)",
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
                },

                states: {
                    type: "State",
                    keyRaw: "states",
                    nullable: true,

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name"
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                },

                sort: {
                    type: "Int",
                    keyRaw: "sort",
                    nullable: true
                },

                active: {
                    type: "Boolean",
                    keyRaw: "active",
                    nullable: true
                }
            }
        }
    },

    input: {
        fields: {
            id: "String"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=013ca864e168034b3c4a34113c7b02264d79147d45483fa9d87e702235d64006";