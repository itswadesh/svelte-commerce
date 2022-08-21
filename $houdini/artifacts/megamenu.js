export default {
    name: "megamenu",
    kind: "HoudiniQuery",
    hash: "cb49267451f7d3e46cd64cc89ac5c93824d0ba0170213454f27339eb6ff701dc",

    raw: `query megamenu($id: ID, $slug: String, $search: String, $sort: String, $featured: Boolean, $brand: ID, $store: ID) {
  megamenu(
    id: $id
    slug: $slug
    search: $search
    sort: $sort
    featured: $featured
    brand: $brand
    store: $store
  ) {
    id
    name
    slug
    img
    imgCdn
    banner
    bannerCdn
    featured
    link
    children {
      name
      slug
      img
      featured
      link
      children {
        name
        slug
        img
        featured
        link
        children {
          name
          slug
          img
          featured
          link
          children {
            name
            slug
            img
            featured
            link
            children {
              name
              slug
              img
              featured
              link
              children {
                name
                slug
                img
                featured
                children {
                  name
                  slug
                  img
                  featured
                  children {
                    name
                    slug
                    img
                    featured
                    children {
                      name
                      slug
                      img
                      featured
                      id
                    }
                    id
                  }
                  id
                }
                id
              }
              id
            }
            id
          }
          id
        }
        id
      }
      id
    }
  }
}
`,

    rootType: "Query",

    selection: {
        megamenu: {
            type: "Category",
            keyRaw: "megamenu(id: $id, slug: $slug, search: $search, sort: $sort, featured: $featured, brand: $brand, store: $store)",
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

                featured: {
                    type: "Boolean",
                    keyRaw: "featured",
                    nullable: true
                },

                link: {
                    type: "String",
                    keyRaw: "link",
                    nullable: true
                },

                children: {
                    type: "Category",
                    keyRaw: "children",
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

                        featured: {
                            type: "Boolean",
                            keyRaw: "featured",
                            nullable: true
                        },

                        link: {
                            type: "String",
                            keyRaw: "link",
                            nullable: true
                        },

                        children: {
                            type: "Category",
                            keyRaw: "children",
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

                                featured: {
                                    type: "Boolean",
                                    keyRaw: "featured",
                                    nullable: true
                                },

                                link: {
                                    type: "String",
                                    keyRaw: "link",
                                    nullable: true
                                },

                                children: {
                                    type: "Category",
                                    keyRaw: "children",
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

                                        featured: {
                                            type: "Boolean",
                                            keyRaw: "featured",
                                            nullable: true
                                        },

                                        link: {
                                            type: "String",
                                            keyRaw: "link",
                                            nullable: true
                                        },

                                        children: {
                                            type: "Category",
                                            keyRaw: "children",
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

                                                featured: {
                                                    type: "Boolean",
                                                    keyRaw: "featured",
                                                    nullable: true
                                                },

                                                link: {
                                                    type: "String",
                                                    keyRaw: "link",
                                                    nullable: true
                                                },

                                                children: {
                                                    type: "Category",
                                                    keyRaw: "children",
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

                                                        featured: {
                                                            type: "Boolean",
                                                            keyRaw: "featured",
                                                            nullable: true
                                                        },

                                                        link: {
                                                            type: "String",
                                                            keyRaw: "link",
                                                            nullable: true
                                                        },

                                                        children: {
                                                            type: "Category",
                                                            keyRaw: "children",
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

                                                                featured: {
                                                                    type: "Boolean",
                                                                    keyRaw: "featured",
                                                                    nullable: true
                                                                },

                                                                children: {
                                                                    type: "Category",
                                                                    keyRaw: "children",
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

                                                                        featured: {
                                                                            type: "Boolean",
                                                                            keyRaw: "featured",
                                                                            nullable: true
                                                                        },

                                                                        children: {
                                                                            type: "Category",
                                                                            keyRaw: "children",
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

                                                                                featured: {
                                                                                    type: "Boolean",
                                                                                    keyRaw: "featured",
                                                                                    nullable: true
                                                                                },

                                                                                children: {
                                                                                    type: "Category",
                                                                                    keyRaw: "children",
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

                                                                                        featured: {
                                                                                            type: "Boolean",
                                                                                            keyRaw: "featured",
                                                                                            nullable: true
                                                                                        },

                                                                                        id: {
                                                                                            type: "ID",
                                                                                            keyRaw: "id"
                                                                                        }
                                                                                    }
                                                                                },

                                                                                id: {
                                                                                    type: "ID",
                                                                                    keyRaw: "id"
                                                                                }
                                                                            }
                                                                        },

                                                                        id: {
                                                                            type: "ID",
                                                                            keyRaw: "id"
                                                                        }
                                                                    }
                                                                },

                                                                id: {
                                                                    type: "ID",
                                                                    keyRaw: "id"
                                                                }
                                                            }
                                                        },

                                                        id: {
                                                            type: "ID",
                                                            keyRaw: "id"
                                                        }
                                                    }
                                                },

                                                id: {
                                                    type: "ID",
                                                    keyRaw: "id"
                                                }
                                            }
                                        },

                                        id: {
                                            type: "ID",
                                            keyRaw: "id"
                                        }
                                    }
                                },

                                id: {
                                    type: "ID",
                                    keyRaw: "id"
                                }
                            }
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                }
            }
        }
    },

    input: {
        fields: {
            id: "ID",
            slug: "String",
            search: "String",
            sort: "String",
            featured: "Boolean",
            brand: "ID",
            store: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=cd85899929c396da2b945c5c123ac901bef6a58433a5983ad0c9e66c0fcd525d";