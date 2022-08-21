export default {
    name: "myWishlist",
    kind: "HoudiniQuery",
    hash: "bb1294bfb02b045a1779352874b01bcb8d9d04715b33867c0f396446bb2b81ec",

    raw: `query myWishlist($page: Int, $search: String, $limit: Int, $sort: String, $store: ID) {
  myWishlist(
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
      active
      createdAt
      updatedAt
      product {
        id
        name
        slug
        img
        price
        mrp
        formattedPrice
        discount
        foodType
        vendor {
          id
          slug
          businessName
          banner
          bannerCdn
        }
        brand {
          id
          name
          img
        }
      }
      variant {
        id
        name
      }
      user {
        id
        firstName
        lastName
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
        myWishlist: {
            type: "wishlistRes",
            keyRaw: "myWishlist(page: $page, search: $search, limit: $limit, sort: $sort, store: $store)",
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
                    type: "Wishlist",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
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

                        product: {
                            type: "Product",
                            keyRaw: "product",
                            nullable: true,

                            fields: {
                                id: {
                                    type: "ID",
                                    keyRaw: "id",
                                    nullable: true
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

                                price: {
                                    type: "Float",
                                    keyRaw: "price",
                                    nullable: true
                                },

                                mrp: {
                                    type: "Float",
                                    keyRaw: "mrp",
                                    nullable: true
                                },

                                formattedPrice: {
                                    type: "String",
                                    keyRaw: "formattedPrice",
                                    nullable: true
                                },

                                discount: {
                                    type: "Float",
                                    keyRaw: "discount",
                                    nullable: true
                                },

                                foodType: {
                                    type: "String",
                                    keyRaw: "foodType",
                                    nullable: true
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
                                        },

                                        img: {
                                            type: "String",
                                            keyRaw: "img",
                                            nullable: true
                                        }
                                    }
                                }
                            }
                        },

                        variant: {
                            type: "Product",
                            keyRaw: "variant",
                            nullable: true,

                            fields: {
                                id: {
                                    type: "ID",
                                    keyRaw: "id",
                                    nullable: true
                                },

                                name: {
                                    type: "String",
                                    keyRaw: "name",
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

"HoudiniHash=d78290056b8f1731e1e71c4696832a53d86f8fa67128381ebafcbd912ebc25b1";