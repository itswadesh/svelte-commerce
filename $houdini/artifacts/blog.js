export default {
    name: "blog",
    kind: "HoudiniQuery",
    hash: "94eb730c69ee1741e6eb89d7cb2d83444bdd4cb61161f9e366db6425ad0eb3d4",

    raw: `query blog($id: String!) {
  blog(id: $id) {
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
`,

    rootType: "Query",

    selection: {
        blog: {
            type: "Blog",
            keyRaw: "blog(id: $id)",
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

"HoudiniHash=c67a5f9153b1ca755e79a4360dc78ca798b1f91fb008b3a89b58373e8320f8cb";