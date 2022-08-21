export default {
    name: "states",
    kind: "HoudiniQuery",
    hash: "2d717ca15d95570f02ad978e5442fcd2292bb43837e4ec3510539e5fab90295d",

    raw: `query states($page: Int, $search: String, $limit: Int, $sort: String, $country: ID, $countryCode: String) {
  states(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    country: $country
    countryCode: $countryCode
  ) {
    count
    page
    pageSize
    data {
      id
      name
      value
      code
      img
      imgCdn
      flag
      lang
      sort
      active
      createdAt
      updatedAt
    }
  }
}
`,

    rootType: "Query",

    selection: {
        states: {
            type: "stateRes",
            keyRaw: "states(page: $page, search: $search, limit: $limit, sort: $sort, country: $country, countryCode: $countryCode)",
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
                    type: "State",
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
            }
        }
    },

    input: {
        fields: {
            page: "Int",
            search: "String",
            limit: "Int",
            sort: "String",
            country: "ID",
            countryCode: "String"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=28e49cd8b45c79bcd008d0af05b23fdc4be04a15e467f1cea691e9f63947895d";