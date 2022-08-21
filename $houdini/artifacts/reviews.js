export default {
    name: "reviews",
    kind: "HoudiniQuery",
    hash: "a446304c5c1a4f16e8452aa5b9129a39c36a512ceee50e4af8b989f159c3711e",

    raw: `query reviews($page: Int, $search: String, $limit: Int, $sort: String, $store: ID) {
  reviews(page: $page, search: $search, limit: $limit, sort: $sort, store: $store) {
    count
    page
    pageSize
    data {
      id
      rating
      message
      active
      createdAt
      updatedAt
      pid {
        name
        slug
        img
        imgCdn
        type
        id
      }
      user {
        firstName
        lastName
        phone
        id
      }
      vendor {
        id
        slug
        businessName
        banner
        bannerCdn
      }
      store {
        id
        name
        email
      }
    }
  }
}
`,

    rootType: "Query",

    selection: {
        reviews: {
            type: "ReviewRes",
            keyRaw: "reviews(page: $page, search: $search, limit: $limit, sort: $sort, store: $store)",
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
                    type: "Review",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id"
                        },

                        rating: {
                            type: "Float",
                            keyRaw: "rating",
                            nullable: true
                        },

                        message: {
                            type: "String",
                            keyRaw: "message",
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
                        },

                        pid: {
                            type: "Product",
                            keyRaw: "pid",
                            nullable: true,

                            fields: {
                                name: {
                                    type: "String",
                                    keyRaw: "name",
                                    nullable: true
                                },

                                slug: {
                                    type: "String",
                                    keyRaw: "slug",
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

                                type: {
                                    type: "String",
                                    keyRaw: "type",
                                    nullable: true
                                },

                                id: {
                                    type: "ID",
                                    keyRaw: "id",
                                    nullable: true
                                }
                            }
                        },

                        user: {
                            type: "User",
                            keyRaw: "user",
                            nullable: true,

                            fields: {
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

                                phone: {
                                    type: "String",
                                    keyRaw: "phone",
                                    nullable: true
                                },

                                id: {
                                    type: "ID",
                                    keyRaw: "id",
                                    nullable: true
                                }
                            }
                        },

                        vendor: {
                            type: "Vendor",
                            keyRaw: "vendor",
                            nullable: true,

                            fields: {
                                id: {
                                    type: "ID",
                                    keyRaw: "id",
                                    nullable: true
                                },

                                slug: {
                                    type: "String",
                                    keyRaw: "slug",
                                    nullable: true
                                },

                                businessName: {
                                    type: "String",
                                    keyRaw: "businessName",
                                    nullable: true
                                },

                                banner: {
                                    type: "String",
                                    keyRaw: "banner",
                                    nullable: true
                                },

                                bannerCdn: {
                                    type: "String",
                                    keyRaw: "bannerCdn",
                                    nullable: true
                                }
                            }
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

"HoudiniHash=ce33b7304112a5446e40b72bd17dc53549a08e4c2531ceab453632465a756799";