export default {
    name: "category",
    kind: "HoudiniQuery",
    hash: "fbd01fab8e96054606c810568cafda31a159ed90eed5de032fb658103b754a81",

    raw: `query category($id: String, $slug: String) {
  category(id: $id, slug: $slug) {
    id
    name
    categoryId
    description
    slug
    img
    imgCdn
    banner
    bannerCdn
    level
    link
    pathA {
      slug
      name
      id
    }
    metaTitle
    metaDescription
    metaKeywords
    keywords
    position
    megamenu
    active
    featured
    featuredSort
    shopbycategory
    createdAt
    updatedAt
    parent {
      name
      id
    }
    children {
      id
      name
      img
    }
    attributes {
      id
      name
      show
      category
      active
    }
    brand {
      id
      name
    }
  }
}
`,

    rootType: "Query",

    selection: {
        category: {
            type: "Category",
            keyRaw: "category(id: $id, slug: $slug)",
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

                categoryId: {
                    type: "String",
                    keyRaw: "categoryId",
                    nullable: true
                },

                description: {
                    type: "String",
                    keyRaw: "description",
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

                banner: {
                    type: "String",
                    keyRaw: "banner",
                    nullable: true
                },

                bannerCdn: {
                    type: "String",
                    keyRaw: "bannerCdn",
                    nullable: true
                },

                level: {
                    type: "Int",
                    keyRaw: "level",
                    nullable: true
                },

                link: {
                    type: "String",
                    keyRaw: "link",
                    nullable: true
                },

                pathA: {
                    type: "Category",
                    keyRaw: "pathA",
                    nullable: true,

                    fields: {
                        slug: {
                            type: "String",
                            keyRaw: "slug",
                            nullable: true
                        },

                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                },

                metaTitle: {
                    type: "String",
                    keyRaw: "metaTitle",
                    nullable: true
                },

                metaDescription: {
                    type: "String",
                    keyRaw: "metaDescription",
                    nullable: true
                },

                metaKeywords: {
                    type: "String",
                    keyRaw: "metaKeywords",
                    nullable: true
                },

                keywords: {
                    type: "String",
                    keyRaw: "keywords",
                    nullable: true
                },

                position: {
                    type: "Int",
                    keyRaw: "position",
                    nullable: true
                },

                megamenu: {
                    type: "Boolean",
                    keyRaw: "megamenu",
                    nullable: true
                },

                active: {
                    type: "Boolean",
                    keyRaw: "active",
                    nullable: true
                },

                featured: {
                    type: "Boolean",
                    keyRaw: "featured",
                    nullable: true
                },

                featuredSort: {
                    type: "Float",
                    keyRaw: "featuredSort",
                    nullable: true
                },

                shopbycategory: {
                    type: "Boolean",
                    keyRaw: "shopbycategory",
                    nullable: true
                },

                createdAt: {
                    type: "String",
                    keyRaw: "createdAt",
                    nullable: true
                },

                updatedAt: {
                    type: "String",
                    keyRaw: "updatedAt",
                    nullable: true
                },

                parent: {
                    type: "Category",
                    keyRaw: "parent",
                    nullable: true,

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                },

                children: {
                    type: "Category",
                    keyRaw: "children",
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

                        img: {
                            type: "String",
                            keyRaw: "img",
                            nullable: true
                        }
                    }
                },

                attributes: {
                    type: "Attribute",
                    keyRaw: "attributes",
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

                        show: {
                            type: "Boolean",
                            keyRaw: "show",
                            nullable: true
                        },

                        category: {
                            type: "String",
                            keyRaw: "category",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        }
                    }
                },

                brand: {
                    type: "Brand",
                    keyRaw: "brand",
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
                        }
                    }
                }
            }
        }
    },

    input: {
        fields: {
            id: "String",
            slug: "String"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=20f2217d04590057fb3f36f5f698776ded1e2877ce41c69af1cc918539130769";