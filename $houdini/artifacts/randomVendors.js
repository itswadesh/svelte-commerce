export default {
    name: "randomVendors",
    kind: "HoudiniQuery",
    hash: "5c342ad0623d5bfbff46ba946d018bbe1e4a3b2f10575be373c9b6eb2ca17ad0",

    raw: `query randomVendors($store: ID) {
  randomVendors(store: $store) {
    id
    slug
    businessName
    description
    verified
    bankAccountNo
    bankName
    bankIfsc
    bankAccountHolderName
    bankSwiftCode
    banner
    bannerCdn
    commissionType
    commissionValue
    zips
    freeShippingOn
    meta
    metaDescription
    metaKeywords
    metaTitle
    productSold
    ratings
    reviews
    shippingCharges
    storeName
    facebookUrl
    githubUrl
    googleUrl
    twitterUrl
    user {
      id
      avatar
      firstName
      lastName
    }
    address {
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
    }
    categories {
      id
      name
      img
      imgCdn
    }
    createdAt
    updatedAt
  }
}
`,

    rootType: "Query",

    selection: {
        randomVendors: {
            type: "Vendor",
            keyRaw: "randomVendors(store: $store)",
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

                description: {
                    type: "String",
                    keyRaw: "description",
                    nullable: true
                },

                verified: {
                    type: "Boolean",
                    keyRaw: "verified",
                    nullable: true
                },

                bankAccountNo: {
                    type: "Float",
                    keyRaw: "bankAccountNo",
                    nullable: true
                },

                bankName: {
                    type: "String",
                    keyRaw: "bankName",
                    nullable: true
                },

                bankIfsc: {
                    type: "String",
                    keyRaw: "bankIfsc",
                    nullable: true
                },

                bankAccountHolderName: {
                    type: "String",
                    keyRaw: "bankAccountHolderName",
                    nullable: true
                },

                bankSwiftCode: {
                    type: "String",
                    keyRaw: "bankSwiftCode",
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

                commissionType: {
                    type: "String",
                    keyRaw: "commissionType",
                    nullable: true
                },

                commissionValue: {
                    type: "Float",
                    keyRaw: "commissionValue",
                    nullable: true
                },

                zips: {
                    type: "String",
                    keyRaw: "zips",
                    nullable: true
                },

                freeShippingOn: {
                    type: "Float",
                    keyRaw: "freeShippingOn",
                    nullable: true
                },

                meta: {
                    type: "String",
                    keyRaw: "meta",
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

                metaTitle: {
                    type: "String",
                    keyRaw: "metaTitle",
                    nullable: true
                },

                productSold: {
                    type: "Int",
                    keyRaw: "productSold",
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

                shippingCharges: {
                    type: "Float",
                    keyRaw: "shippingCharges",
                    nullable: true
                },

                storeName: {
                    type: "String",
                    keyRaw: "storeName",
                    nullable: true
                },

                facebookUrl: {
                    type: "String",
                    keyRaw: "facebookUrl",
                    nullable: true
                },

                githubUrl: {
                    type: "String",
                    keyRaw: "githubUrl",
                    nullable: true
                },

                googleUrl: {
                    type: "String",
                    keyRaw: "googleUrl",
                    nullable: true
                },

                twitterUrl: {
                    type: "String",
                    keyRaw: "twitterUrl",
                    nullable: true
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

                        avatar: {
                            type: "String",
                            keyRaw: "avatar",
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

                address: {
                    type: "Address",
                    keyRaw: "address",
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
                        }
                    }
                },

                categories: {
                    type: "Category",
                    keyRaw: "categories",
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
                        },

                        imgCdn: {
                            type: "String",
                            keyRaw: "imgCdn",
                            nullable: true
                        }
                    }
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
                }
            }
        }
    },

    input: {
        fields: {
            store: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=5c342ad0623d5bfbff46ba946d018bbe1e4a3b2f10575be373c9b6eb2ca17ad0";