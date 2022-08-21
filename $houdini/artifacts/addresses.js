export default {
    name: "addresses",
    kind: "HoudiniQuery",
    hash: "b09485e1516f9d888609b08ccf817310991682a16dd353f261203d45f35a7a30",

    raw: `query addresses($page: Int, $search: String, $limit: Int, $sort: String, $store: ID) {
  addresses(
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
      email
      firstName
      lastName
      address
      locality
      town
      city
      country
      state
      zip
      phone
      lat
      lng
      active
      verified
      createdAt
      updatedAt
      store
    }
  }
}
`,

    rootType: "Query",

    selection: {
        addresses: {
            type: "addressRes",
            keyRaw: "addresses(page: $page, search: $search, limit: $limit, sort: $sort, store: $store)",
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
                    type: "Address",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id"
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

                        address: {
                            type: "String",
                            keyRaw: "address",
                            nullable: true
                        },

                        locality: {
                            type: "String",
                            keyRaw: "locality",
                            nullable: true
                        },

                        town: {
                            type: "String",
                            keyRaw: "town",
                            nullable: true
                        },

                        city: {
                            type: "String",
                            keyRaw: "city",
                            nullable: true
                        },

                        country: {
                            type: "String",
                            keyRaw: "country",
                            nullable: true
                        },

                        state: {
                            type: "String",
                            keyRaw: "state",
                            nullable: true
                        },

                        zip: {
                            type: "String",
                            keyRaw: "zip",
                            nullable: true
                        },

                        phone: {
                            type: "String",
                            keyRaw: "phone",
                            nullable: true
                        },

                        lat: {
                            type: "Float",
                            keyRaw: "lat",
                            nullable: true
                        },

                        lng: {
                            type: "Float",
                            keyRaw: "lng",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        },

                        verified: {
                            type: "Boolean",
                            keyRaw: "verified",
                            nullable: true
                        },

                        createdAt: {
                            type: "String",
                            keyRaw: "createdAt"
                        },

                        updatedAt: {
                            type: "String",
                            keyRaw: "updatedAt"
                        },

                        store: {
                            type: "ID",
                            keyRaw: "store",
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
            sort: "String",
            store: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=de68318551e8bdf9e2eac58ac725105e5f9910997d687027952487a4da4bd906";