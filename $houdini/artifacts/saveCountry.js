export default {
    name: "saveCountry",
    kind: "HoudiniMutation",
    hash: "130e5a3016521393b21796ccccad9f39185499878085d0e58686e71aebf0a826",

    raw: `mutation saveCountry($id: String, $name: String, $value: String, $dialCode: String, $code: String, $img: String, $flag: String, $lang: String, $sort: Int, $active: Boolean) {
  saveCountry(
    id: $id
    name: $name
    value: $value
    dialCode: $dialCode
    code: $code
    img: $img
    flag: $flag
    lang: $lang
    sort: $sort
    active: $active
  ) {
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
    createdAt
    updatedAt
  }
}
`,

    rootType: "Mutation",

    selection: {
        saveCountry: {
            type: "Country",
            keyRaw: "saveCountry(id: $id, name: $name, value: $value, dialCode: $dialCode, code: $code, img: $img, flag: $flag, lang: $lang, sort: $sort, active: $active)",
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
                },

                createdAt: {
                    type: "String",
                    keyRaw: "createdAt"
                },

                updatedAt: {
                    type: "String",
                    keyRaw: "updatedAt"
                }
            }
        }
    },

    input: {
        fields: {
            id: "String",
            name: "String",
            value: "String",
            dialCode: "String",
            code: "String",
            img: "String",
            flag: "String",
            lang: "String",
            sort: "Int",
            active: "Boolean"
        },

        types: {}
    }
};

"HoudiniHash=b015020c549ff989e6e2404e530d3451c5296fd12ed770a7a0185b56521c5426";