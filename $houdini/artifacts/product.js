export default {
    name: "product",
    kind: "HoudiniQuery",
    hash: "76b4112bed6fe61a31b0b75c1be4f0673a695e44c2231c6f74e1e43c2a623a9d",

    raw: `query product($id: ID!, $zip: String, $optionValues: [ID]) {
  product(id: $id, zip: $zip, optionValues: $optionValues) {
    id
    slug
    name
    description
    type
    price
    mrp
    discount
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
    ratings
    reviews
    sku
    hsn
    group
    barcode
    gender
    gtin
    condition
    trending
    featured
    hot
    new
    sale
    recommended
    title
    itemId
    warranty
    metaDescription
    keywords
    keywordsA
    ageMin
    ageMax
    ageUnit
    styleCode
    eanNo
    articleCode
    productMasterId
    currency
    manufacturer
    countryOfOrigin
    returnInfo
    link
    gender
    condition
    gtin
    cgst
    sgst
    igst
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
    slots {
      id
      name
      value
    }
    country {
      id
      name
    }
    sizeGroup {
      _id
      slug
      size {
        name
        id
      }
      id
    }
    colorGroup {
      _id
      slug
      color {
        name
        color_code
        id
      }
      id
    }
    brand {
      id
      name
    }
    parentBrand {
      id
      name
    }
    color {
      id
      name
    }
    size {
      id
      name
    }
    category {
      id
      name
      slug
      pathA {
        name
        slug
        id
      }
    }
    categories {
      id
      name
    }
    categoryPool {
      id
      name
    }
    keyFeatures
    features {
      id
      name
      value
    }
    specifications {
      id
      name
      value
    }
    productDetails {
      id
      name
      value
    }
    channels {
      id
      title
      img
      scheduleDateTime
      user {
        firstName
        lastName
        id
      }
    }
    collections {
      id
      name
      description
      active
      images
      img
      q
      sort
      type
    }
    options {
      id
      name
      inputType
      required
      preselectDefault
      position
      values {
        id
        name
        default
        position
        direction
        isPercent
        value
      }
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
    relatedProducts {
      id
      name
      slug
      img
    }
    returnInfo
    returnAllowed
    replaceAllowed
    returnValidityInDays
    replaceValidityInDays
    files
    unit
    dimensionUnit
    formattedMrp
    formattedPrice
    createdAt
    updatedAt
  }
}
`,

    rootType: "Query",

    selection: {
        product: {
            type: "Product",
            keyRaw: "product(id: $id, zip: $zip, optionValues: $optionValues)",
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

                discount: {
                    type: "Float",
                    keyRaw: "discount",
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

                group: {
                    type: "String",
                    keyRaw: "group",
                    nullable: true
                },

                barcode: {
                    type: "String",
                    keyRaw: "barcode",
                    nullable: true
                },

                gender: {
                    type: "String",
                    keyRaw: "gender",
                    nullable: true
                },

                gtin: {
                    type: "String",
                    keyRaw: "gtin",
                    nullable: true
                },

                condition: {
                    type: "String",
                    keyRaw: "condition",
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

                styleCode: {
                    type: "String",
                    keyRaw: "styleCode",
                    nullable: true
                },

                eanNo: {
                    type: "String",
                    keyRaw: "eanNo",
                    nullable: true
                },

                articleCode: {
                    type: "String",
                    keyRaw: "articleCode",
                    nullable: true
                },

                productMasterId: {
                    type: "String",
                    keyRaw: "productMasterId",
                    nullable: true
                },

                currency: {
                    type: "String",
                    keyRaw: "currency",
                    nullable: true
                },

                manufacturer: {
                    type: "String",
                    keyRaw: "manufacturer",
                    nullable: true
                },

                countryOfOrigin: {
                    type: "String",
                    keyRaw: "countryOfOrigin",
                    nullable: true
                },

                returnInfo: {
                    type: "String",
                    keyRaw: "returnInfo",
                    nullable: true
                },

                link: {
                    type: "String",
                    keyRaw: "link",
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
                },

                slots: {
                    type: "Slot",
                    keyRaw: "slots",
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

                        value: {
                            type: "String",
                            keyRaw: "value",
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

                sizeGroup: {
                    type: "Product",
                    keyRaw: "sizeGroup",
                    nullable: true,

                    fields: {
                        _id: {
                            type: "ID",
                            keyRaw: "_id",
                            nullable: true
                        },

                        slug: {
                            type: "String",
                            keyRaw: "slug",
                            nullable: true
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

                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        }
                    }
                },

                colorGroup: {
                    type: "Product",
                    keyRaw: "colorGroup",
                    nullable: true,

                    fields: {
                        _id: {
                            type: "ID",
                            keyRaw: "_id",
                            nullable: true
                        },

                        slug: {
                            type: "String",
                            keyRaw: "slug",
                            nullable: true
                        },

                        color: {
                            type: "Color",
                            keyRaw: "color",
                            nullable: true,

                            fields: {
                                name: {
                                    type: "String",
                                    keyRaw: "name",
                                    nullable: true
                                },

                                color_code: {
                                    type: "String",
                                    keyRaw: "color_code",
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
                            keyRaw: "id",
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
                },

                parentBrand: {
                    type: "Brand",
                    keyRaw: "parentBrand",
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

                category: {
                    type: "Category",
                    keyRaw: "category",
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

                        pathA: {
                            type: "Category",
                            keyRaw: "pathA",
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

                                id: {
                                    type: "ID",
                                    keyRaw: "id"
                                }
                            }
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
                        }
                    }
                },

                categoryPool: {
                    type: "Category",
                    keyRaw: "categoryPool",
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

                keyFeatures: {
                    type: "String",
                    keyRaw: "keyFeatures",
                    nullable: true
                },

                features: {
                    type: "Feature",
                    keyRaw: "features",
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

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        }
                    }
                },

                specifications: {
                    type: "Feature",
                    keyRaw: "specifications",
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

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        }
                    }
                },

                productDetails: {
                    type: "Feature",
                    keyRaw: "productDetails",
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

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        }
                    }
                },

                channels: {
                    type: "Channel",
                    keyRaw: "channels",
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

                        img: {
                            type: "String",
                            keyRaw: "img",
                            nullable: true
                        },

                        scheduleDateTime: {
                            type: "Float",
                            keyRaw: "scheduleDateTime",
                            nullable: true
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

                                id: {
                                    type: "ID",
                                    keyRaw: "id",
                                    nullable: true
                                }
                            }
                        }
                    }
                },

                collections: {
                    type: "Collection",
                    keyRaw: "collections",
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

                        description: {
                            type: "String",
                            keyRaw: "description",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        },

                        images: {
                            type: "String",
                            keyRaw: "images",
                            nullable: true
                        },

                        img: {
                            type: "String",
                            keyRaw: "img",
                            nullable: true
                        },

                        q: {
                            type: "String",
                            keyRaw: "q",
                            nullable: true
                        },

                        sort: {
                            type: "String",
                            keyRaw: "sort",
                            nullable: true
                        },

                        type: {
                            type: "String",
                            keyRaw: "type",
                            nullable: true
                        }
                    }
                },

                options: {
                    type: "Option",
                    keyRaw: "options",
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

                        inputType: {
                            type: "String",
                            keyRaw: "inputType",
                            nullable: true
                        },

                        required: {
                            type: "Boolean",
                            keyRaw: "required",
                            nullable: true
                        },

                        preselectDefault: {
                            type: "Boolean",
                            keyRaw: "preselectDefault",
                            nullable: true
                        },

                        position: {
                            type: "Int",
                            keyRaw: "position",
                            nullable: true
                        },

                        values: {
                            type: "OptionValue",
                            keyRaw: "values",
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

                                default: {
                                    type: "Boolean",
                                    keyRaw: "default",
                                    nullable: true
                                },

                                position: {
                                    type: "Int",
                                    keyRaw: "position",
                                    nullable: true
                                },

                                direction: {
                                    type: "String",
                                    keyRaw: "direction",
                                    nullable: true
                                },

                                isPercent: {
                                    type: "Boolean",
                                    keyRaw: "isPercent",
                                    nullable: true
                                },

                                value: {
                                    type: "Float",
                                    keyRaw: "value",
                                    nullable: true
                                }
                            }
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
                },

                relatedProducts: {
                    type: "Product",
                    keyRaw: "relatedProducts",
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
                        }
                    }
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

                replaceValidityInDays: {
                    type: "Int",
                    keyRaw: "replaceValidityInDays",
                    nullable: true
                },

                files: {
                    type: "String",
                    keyRaw: "files",
                    nullable: true
                },

                unit: {
                    type: "String",
                    keyRaw: "unit",
                    nullable: true
                },

                dimensionUnit: {
                    type: "String",
                    keyRaw: "dimensionUnit",
                    nullable: true
                },

                formattedMrp: {
                    type: "String",
                    keyRaw: "formattedMrp",
                    nullable: true
                },

                formattedPrice: {
                    type: "String",
                    keyRaw: "formattedPrice",
                    nullable: true
                },

                createdAt: {
                    type: "String",
                    keyRaw: "createdAt"
                },

                updatedAt: {
                    type: "String",
                    keyRaw: "updatedAt"
                }
            }
        }
    },

    input: {
        fields: {
            id: "ID",
            zip: "String",
            optionValues: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=1cb69f930a0c5474b9fdd4499ebfce21cef5085d49ce609adbab16d490568ed3";