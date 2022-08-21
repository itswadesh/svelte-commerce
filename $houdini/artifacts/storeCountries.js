export default {
    name: "storeCountries",
    kind: "HoudiniQuery",
    hash: "41134cad187473fc5c9061fbbb8b3755479d74e471bd1722d9191c75b36eb21a",

    raw: `query storeCountries($page: Int, $search: String, $limit: Int, $sort: String, $store: ID!) {
  storeCountries(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    store: $store
  ) {
    count
    page
    pageSize
    data {
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
        email
      }
    }
  }
}
`,

    rootType: "Query",

    selection: {
        storeCountries: {
            type: "StoreCountryRes",
            keyRaw: "storeCountries(page: $page, search: $search, limit: $limit, sort: $sort, store: $store)",
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
                    type: "StoreCountry",
                    keyRaw: "data",
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
                                },

                                email: {
                                    type: "String",
                                    keyRaw: "email",
                                    nullable: true
                                }
                            }
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
            sort: "String",
            store: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=13f06540a1b18c1929e4da8b7a51666ae9046149ca8d851cafc6f1b05f4a3309";