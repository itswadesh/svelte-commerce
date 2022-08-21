export default {
    name: "products",
    kind: "HoudiniQuery",
    hash: "556eab19f8447260f5a3c7b8d4a1c5b940142d2b689a83ba5d63f62c9d3dc6b9",

    raw: `query products($page: Int, $skip: Int, $limit: Int, $search: String, $sku: String, $name: String, $brand: String, $status: String, $price: String, $sort: String, $vendor: String, $category: String, $active: Boolean, $featured: Boolean, $new: Boolean, $hot: Boolean, $sale: Boolean, $where: String, $store: ID, $types: [String]) {
  products(
    page: $page
    skip: $skip
    limit: $limit
    search: $search
    sku: $sku
    name: $name
    brand: $brand
    status: $status
    price: $price
    sort: $sort
    vendor: $vendor
    category: $category
    active: $active
    featured: $featured
    new: $new
    hot: $hot
    sale: $sale
    where: $where
    store: $store
    types: $types
  ) {
    count
    pageSize
    noOfPage
    page
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
      formattedMrp
      formattedPrice
      slots {
        id
        name
        value
      }
      store {
        id
        name
        email
      }
      category {
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
}
`,

    rootType: "Query",

    selection: {
        products: {
            type: "SearchRes",
            keyRaw: "products(page: $page, skip: $skip, limit: $limit, search: $search, sku: $sku, name: $name, brand: $brand, status: $status, price: $price, sort: $sort, vendor: $vendor, category: $category, active: $active, featured: $featured, new: $new, hot: $hot, sale: $sale, where: $where, store: $store, types: $types)",
            nullable: true,

            fields: {
                count: {
                    type: "Int",
                    keyRaw: "count",
                    nullable: true
                },

                pageSize: {
                    type: "Int",
                    keyRaw: "pageSize",
                    nullable: true
                },

                noOfPage: {
                    type: "Int",
                    keyRaw: "noOfPage",
                    nullable: true
                },

                page: {
                    type: "Int",
                    keyRaw: "page",
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

                        category: {
                            type: "Category",
                            keyRaw: "category",
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
            }
        }
    },

    input: {
        fields: {
            page: "Int",
            skip: "Int",
            limit: "Int",
            search: "String",
            sku: "String",
            name: "String",
            brand: "String",
            status: "String",
            price: "String",
            sort: "String",
            vendor: "String",
            category: "String",
            active: "Boolean",
            featured: "Boolean",
            new: "Boolean",
            hot: "Boolean",
            sale: "Boolean",
            where: "String",
            store: "ID",
            types: "String"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=c264d635b825fb32b2bddedd24b7a5c38d8722afff274407a783f52740dfc57b";