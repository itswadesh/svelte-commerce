export default {
    name: "vendorProfile",
    kind: "HoudiniQuery",
    hash: "13133bb583e3d087431670817f7698544d2b7091a21b5ea77d2552aabc13e58c",

    raw: `query vendorProfile($vendor: ID!) {
  vendorProfile(vendor: $vendor) {
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
    products {
      count
      page
      pageSize
      data {
        id
        sku
        barcode
        productMasterId
        slug
        name
        description
        type
        price
        mrp
        stock
        trackInventory
        tax
        img
        imgCdn
        images
        imagesCdn
        time
        active
        popularity
        position
        trending
        featured
        hot
        new
        sale
        recommended
        title
        metaDescription
        keywords
        keywordsA
        ratings
        reviews
        itemId
        warranty
        ageMin
        ageMax
        ageUnit
        cgst
        sgst
        igst
        returnInfo
        returnAllowed
        replaceAllowed
        returnValidityInDays
        sizechart
        batchNo
        mfgDate
        expired
        expiryDate
        isSearchable
        isUnlimited
        totalSold
        preOrder
        zips
        foodType
        deliveryDetails
      }
    }
    createdAt
    updatedAt
  }
}
`,

    rootType: "Query",

    selection: {
        vendorProfile: {
            type: "Vendor",
            keyRaw: "vendorProfile(vendor: $vendor)",
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

                products: {
                    type: "SearchRes",
                    keyRaw: "products",
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
                            type: "Product",
                            keyRaw: "data",
                            nullable: true,

                            fields: {
                                id: {
                                    type: "ID",
                                    keyRaw: "id",
                                    nullable: true
                                },

                                sku: {
                                    type: "String",
                                    keyRaw: "sku",
                                    nullable: true
                                },

                                barcode: {
                                    type: "String",
                                    keyRaw: "barcode",
                                    nullable: true
                                },

                                productMasterId: {
                                    type: "String",
                                    keyRaw: "productMasterId",
                                    nullable: true
                                },

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

                                description: {
                                    type: "String",
                                    keyRaw: "description",
                                    nullable: true
                                },

                                type: {
                                    type: "String",
                                    keyRaw: "type",
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

                                stock: {
                                    type: "Int",
                                    keyRaw: "stock",
                                    nullable: true
                                },

                                trackInventory: {
                                    type: "Boolean",
                                    keyRaw: "trackInventory",
                                    nullable: true
                                },

                                tax: {
                                    type: "Float",
                                    keyRaw: "tax",
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

                                time: {
                                    type: "String",
                                    keyRaw: "time",
                                    nullable: true
                                },

                                active: {
                                    type: "Boolean",
                                    keyRaw: "active",
                                    nullable: true
                                },

                                popularity: {
                                    type: "Float",
                                    keyRaw: "popularity",
                                    nullable: true
                                },

                                position: {
                                    type: "Float",
                                    keyRaw: "position",
                                    nullable: true
                                },

                                trending: {
                                    type: "Boolean",
                                    keyRaw: "trending",
                                    nullable: true
                                },

                                featured: {
                                    type: "Boolean",
                                    keyRaw: "featured",
                                    nullable: true
                                },

                                hot: {
                                    type: "Boolean",
                                    keyRaw: "hot",
                                    nullable: true
                                },

                                new: {
                                    type: "Boolean",
                                    keyRaw: "new",
                                    nullable: true
                                },

                                sale: {
                                    type: "Boolean",
                                    keyRaw: "sale",
                                    nullable: true
                                },

                                recommended: {
                                    type: "Boolean",
                                    keyRaw: "recommended",
                                    nullable: true
                                },

                                title: {
                                    type: "String",
                                    keyRaw: "title",
                                    nullable: true
                                },

                                metaDescription: {
                                    type: "String",
                                    keyRaw: "metaDescription",
                                    nullable: true
                                },

                                keywords: {
                                    type: "String",
                                    keyRaw: "keywords",
                                    nullable: true
                                },

                                keywordsA: {
                                    type: "String",
                                    keyRaw: "keywordsA",
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

                                itemId: {
                                    type: "String",
                                    keyRaw: "itemId",
                                    nullable: true
                                },

                                warranty: {
                                    type: "String",
                                    keyRaw: "warranty",
                                    nullable: true
                                },

                                ageMin: {
                                    type: "Int",
                                    keyRaw: "ageMin",
                                    nullable: true
                                },

                                ageMax: {
                                    type: "Int",
                                    keyRaw: "ageMax",
                                    nullable: true
                                },

                                ageUnit: {
                                    type: "String",
                                    keyRaw: "ageUnit",
                                    nullable: true
                                },

                                cgst: {
                                    type: "Float",
                                    keyRaw: "cgst",
                                    nullable: true
                                },

                                sgst: {
                                    type: "Float",
                                    keyRaw: "sgst",
                                    nullable: true
                                },

                                igst: {
                                    type: "Float",
                                    keyRaw: "igst",
                                    nullable: true
                                },

                                returnInfo: {
                                    type: "String",
                                    keyRaw: "returnInfo",
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

                                returnValidityInDays: {
                                    type: "Int",
                                    keyRaw: "returnValidityInDays",
                                    nullable: true
                                },

                                sizechart: {
                                    type: "String",
                                    keyRaw: "sizechart",
                                    nullable: true
                                },

                                batchNo: {
                                    type: "String",
                                    keyRaw: "batchNo",
                                    nullable: true
                                },

                                mfgDate: {
                                    type: "String",
                                    keyRaw: "mfgDate",
                                    nullable: true
                                },

                                expired: {
                                    type: "Boolean",
                                    keyRaw: "expired",
                                    nullable: true
                                },

                                expiryDate: {
                                    type: "String",
                                    keyRaw: "expiryDate",
                                    nullable: true
                                },

                                isSearchable: {
                                    type: "Boolean",
                                    keyRaw: "isSearchable",
                                    nullable: true
                                },

                                isUnlimited: {
                                    type: "Boolean",
                                    keyRaw: "isUnlimited",
                                    nullable: true
                                },

                                totalSold: {
                                    type: "Int",
                                    keyRaw: "totalSold",
                                    nullable: true
                                },

                                preOrder: {
                                    type: "Boolean",
                                    keyRaw: "preOrder",
                                    nullable: true
                                },

                                zips: {
                                    type: "String",
                                    keyRaw: "zips",
                                    nullable: true
                                },

                                foodType: {
                                    type: "String",
                                    keyRaw: "foodType",
                                    nullable: true
                                },

                                deliveryDetails: {
                                    type: "String",
                                    keyRaw: "deliveryDetails",
                                    nullable: true
                                }
                            }
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
            vendor: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=ee5dd8483611ccd960ab37e121646db6e398375f78d3a9e93793221c584fdd17";