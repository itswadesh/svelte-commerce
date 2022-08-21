export default {
    name: "countries",
    kind: "HoudiniQuery",
    hash: "1721a195e17f89a622112de0368146297b2aa0b9875a8ba5be46bc89e1eec601",

    raw: `query countries($page: Int, $search: String, $limit: Int, $sort: String) {
  countries(page: $page, search: $search, limit: $limit, sort: $sort) {
    count
    page
    pageSize
    data {
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
}
`,

    rootType: "Query",

    selection: {
        countries: {
            type: "countryRes",
            keyRaw: "countries(page: $page, search: $search, limit: $limit, sort: $sort)",
            nullable: true,

            fields: {
                count: {
                    type: "Int",
                    keyRaw: "count",
                    nullable: true
                },

                page: {
                    type: "Int",
                    keyRaw: "page",
                    nullable: true
                },

                pageSize: {
                    type: "Int",
                    keyRaw: "pageSize",
                    nullable: true
                },

                data: {
                    type: "Country",
                    keyRaw: "data",
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
            }
        }
    },

    input: {
        fields: {
            page: "Int",
            search: "String",
            limit: "Int",
            sort: "String"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=1c89a5fce7a14ac36c61f7554bfc865e699e915ef426098bc99c9bfb889fd118";