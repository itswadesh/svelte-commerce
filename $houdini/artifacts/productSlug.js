export default {
    name: "productSlug",
    kind: "HoudiniQuery",
    hash: "93fa829181a4d6d1f2c9819f10efd9e8399d10672fb1c77103e0cfe9934cf101",

    raw: `query productSlug($slug: String!) {
  productSlug(slug: $slug) {
    id
    name
    description
    metaDescription
    createdAt
    updatedAt
    sku
    hsn
    popularity
    slug
    img
    imgCdn
    images
    imagesCdn
    price
    mrp
    formattedPrice
    formattedMrp
    stock
    isUnlimited
    trackInventory
    ratings
    reviews
    returnInfo
    replaceValidityInDays
    returnAllowed
    replaceValidityInDays
    replaceAllowed
    color {
      id
      name
    }
    size {
      name
      id
    }
    brand {
      name
      id
    }
    vendor {
      id
      slug
      businessName
      banner
      bannerCdn
      ratings
      reviews
      info {
        store
        public
        storePhotos
      }
    }
  }
}
`,

    rootType: "Query",

    selection: {
        productSlug: {
            type: "Product",
            keyRaw: "productSlug(slug: $slug)",
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

                description: {
                    type: "String",
                    keyRaw: "description",
                    nullable: true
                },

                metaDescription: {
                    type: "String",
                    keyRaw: "metaDescription",
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

                sku: {
                    type: "String",
                    keyRaw: "sku",
                    nullable: true
                },

                hsn: {
                    type: "String",
                    keyRaw: "hsn",
                    nullable: true
                },

                popularity: {
                    type: "Float",
                    keyRaw: "popularity",
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

                images: {
                    type: "String",
                    keyRaw: "images",
                    nullable: true
                },

                imagesCdn: {
                    type: "String",
                    keyRaw: "imagesCdn",
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

                formattedMrp: {
                    type: "String",
                    keyRaw: "formattedMrp",
                    nullable: true
                },

                stock: {
                    type: "Int",
                    keyRaw: "stock",
                    nullable: true
                },

                isUnlimited: {
                    type: "Boolean",
                    keyRaw: "isUnlimited",
                    nullable: true
                },

                trackInventory: {
                    type: "Boolean",
                    keyRaw: "trackInventory",
                    nullable: true
                },

                ratings: {
                    type: "Float",
                    keyRaw: "ratings",
                    nullable: true
                },

                reviews: {
                    type: "Int",
                    keyRaw: "reviews",
                    nullable: true
                },

                returnInfo: {
                    type: "String",
                    keyRaw: "returnInfo",
                    nullable: true
                },

                replaceValidityInDays: {
                    type: "Int",
                    keyRaw: "replaceValidityInDays",
                    nullable: true
                },

                returnAllowed: {
                    type: "Boolean",
                    keyRaw: "returnAllowed",
                    nullable: true
                },

                replaceAllowed: {
                    type: "Boolean",
                    keyRaw: "replaceAllowed",
                    nullable: true
                },

                color: {
                    type: "Color",
                    keyRaw: "color",
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
                },

                size: {
                    type: "Size",
                    keyRaw: "size",
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

                brand: {
                    type: "Brand",
                    keyRaw: "brand",
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
                        },

                        ratings: {
                            type: "Float",
                            keyRaw: "ratings",
                            nullable: true
                        },

                        reviews: {
                            type: "Int",
                            keyRaw: "reviews",
                            nullable: true
                        },

                        info: {
                            type: "Info",
                            keyRaw: "info",
                            nullable: true,

                            fields: {
                                store: {
                                    type: "String",
                                    keyRaw: "store",
                                    nullable: true
                                },

                                public: {
                                    type: "Boolean",
                                    keyRaw: "public",
                                    nullable: true
                                },

                                storePhotos: {
                                    type: "String",
                                    keyRaw: "storePhotos",
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
            slug: "String"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=d26a9651eebdd359d59decf7292ec6ce9e8167ab707131fbeb8f73155ab68049";