export default {
    name: "blogs",
    kind: "HoudiniQuery",
    hash: "4b8c2150ffd3040145f09c0a3d6e93b382b53b8fdae1084c3fd503e648884bf1",

    raw: `query blogs($page: Int, $search: String, $limit: Int, $sort: String, $store: ID) {
  blogs(page: $page, search: $search, limit: $limit, sort: $sort, store: $store) {
    count
    page
    pageSize
    data {
      id
      title
      slug
      active
      excerpt
      content
      published_at
      img
      imgCdn
      createdAt
      updatedAt
      user {
        firstName
        lastName
        avatar
        id
      }
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
        blogs: {
            type: "blogRes",
            keyRaw: "blogs(page: $page, search: $search, limit: $limit, sort: $sort, store: $store)",
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
                    type: "Blog",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id"
                        },

                        title: {
                            type: "String",
                            keyRaw: "title",
                            nullable: true
                        },

                        slug: {
                            type: "String",
                            keyRaw: "slug",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        },

                        excerpt: {
                            type: "String",
                            keyRaw: "excerpt",
                            nullable: true
                        },

                        content: {
                            type: "String",
                            keyRaw: "content",
                            nullable: true
                        },

                        published_at: {
                            type: "String",
                            keyRaw: "published_at",
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

                        createdAt: {
                            type: "String",
                            keyRaw: "createdAt"
                        },

                        updatedAt: {
                            type: "String",
                            keyRaw: "updatedAt"
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

                                avatar: {
                                    type: "String",
                                    keyRaw: "avatar",
                                    nullable: true
                                },

                                id: {
                                    type: "ID",
                                    keyRaw: "id",
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

"HoudiniHash=8ecbbabf4f9831739124da3502855ff577fdace78e50d71ff27eadf398bff92f";