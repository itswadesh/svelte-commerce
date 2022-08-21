export default {
    name: "popularSearches",
    kind: "HoudiniQuery",
    hash: "9376f0f29fa810e1e07dd15e72acbf19c71646717eacce1fc9007b73191675ff",

    raw: `query popularSearches($page: Int, $limit: Int, $search: String, $sort: String, $store: ID, $domain: String) {
  popularSearches(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    store: $store
    domain: $domain
  ) {
    count
    page
    pageSize
    data {
      id
      text
      popularity
      store {
        id
        name
        email
        phone
      }
    }
  }
}
`,

    rootType: "Query",

    selection: {
        popularSearches: {
            type: "PopularSearchRes",
            keyRaw: "popularSearches(page: $page, search: $search, limit: $limit, sort: $sort, store: $store, domain: $domain)",
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
                    type: "PopularSearch",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id"
                        },

                        text: {
                            type: "String",
                            keyRaw: "text",
                            nullable: true
                        },

                        popularity: {
                            type: "String",
                            keyRaw: "popularity",
                            nullable: true
                        },

                        store: {
                            type: "Store",
                            keyRaw: "store",
                            nullable: true,

                            fields: {
                                id: {
                                    type: "ID",
                                    keyRaw: "id"
                                },

                                name: {
                                    type: "String",
                                    keyRaw: "name",
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
            limit: "Int",
            search: "String",
            sort: "String",
            store: "ID",
            domain: "String"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=035a5e1eefa7e3c4e526fd9e4e5b2cb5e86f92b007ca165bb4914b9aabeeb5bf";