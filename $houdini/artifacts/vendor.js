export default {
    name: "vendor",
    kind: "HoudiniQuery",
    hash: "8a99f2030c82e507d64e7433985e5c09294a0f32e8c1fd3acc7141fa32282ea4",

    raw: `query vendor($id: ID) {
  vendor(id: $id) {
    id
    slug
    businessName
    categories {
      id
    }
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
    about
    banners
    bannersCdn
    info {
      public
      store
      storePhotos
    }
    country {
      id
      name
    }
    user {
      id
      avatar
    }
    address {
      id
      firstName
      lastName
      address
      locality
      city
      state
      country
      zip
      lat
      lng
    }
    categories {
      id
      name
    }
    store {
      id
      name
      email
    }
    createdAt
    updatedAt
  }
}
`,

    rootType: "Query",

    selection: {
        vendor: {
            type: "Vendor",
            keyRaw: "vendor(id: $id)",
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
                        }
                    }
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

                about: {
                    type: "String",
                    keyRaw: "about",
                    nullable: true
                },

                banners: {
                    type: "String",
                    keyRaw: "banners",
                    nullable: true
                },

                bannersCdn: {
                    type: "String",
                    keyRaw: "bannersCdn",
                    nullable: true
                },

                info: {
                    type: "Info",
                    keyRaw: "info",
                    nullable: true,

                    fields: {
                        public: {
                            type: "Boolean",
                            keyRaw: "public",
                            nullable: true
                        },

                        store: {
                            type: "String",
                            keyRaw: "store",
                            nullable: true
                        },

                        storePhotos: {
                            type: "String",
                            keyRaw: "storePhotos",
                            nullable: true
                        }
                    }
                },

                country: {
                    type: "Country",
                    keyRaw: "country",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id"
                        },

                        name: {
                            type: "String",
                            keyRaw: "name"
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

                        avatar: {
                            type: "String",
                            keyRaw: "avatar",
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

                        city: {
                            type: "String",
                            keyRaw: "city",
                            nullable: true
                        },

                        state: {
                            type: "String",
                            keyRaw: "state",
                            nullable: true
                        },

                        country: {
                            type: "String",
                            keyRaw: "country",
                            nullable: true
                        },

                        zip: {
                            type: "String",
                            keyRaw: "zip",
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
            id: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=8a99f2030c82e507d64e7433985e5c09294a0f32e8c1fd3acc7141fa32282ea4";