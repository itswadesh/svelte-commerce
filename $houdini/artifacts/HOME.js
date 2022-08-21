export default {
    name: "HOME",
    kind: "HoudiniQuery",
    hash: "1f224a4f55463ef57832477761c58f67727bb0494b6f005053c6c14f3fc11127",

    raw: `query HOME($store: ID, $zip: String) {
  brands(parent: null, limit: 30, page: 0, featured: true, store: $store) {
    count
    page
    pageSize
    data {
      id
      brandId
      name
      slug
      img
      imgCdn
      position
      info
      meta
      metaTitle
      metaDescription
      metaKeywords
      facebookUrl
      instaUrl
      twitterUrl
      linkedinUrl
      youtubeUrl
      pinterestUrl
      googleUrl
      active
      featured
      store {
        id
        name
        email
        phone
        active
      }
      createdAt
      updatedAt
    }
  }
  categories(img: true, shopbycategory: true, store: $store, sort: "featuredSort") {
    count
    page
    pageSize
    data {
      id
      name
      namePath
      categoryId
      parent
      slug
      img
      imgCdn
      link
      level
      metaTitle
      metaDescription
      metaKeywords
      position
      megamenu
      active
      featured
      shopbycategory
      createdAt
      updatedAt
      store
    }
  }
  banners(sort: "sort", pageId: "home", active: true, store: $store) {
    count
    page
    pageSize
    data {
      id
      link
      heading
      img
      imgCdn
      sort
      type
      pageId
      groupId
      groupTitle
      active
      isMobile
      createdAt
      updatedAt
      store
    }
  }
  youMayLike(store: $store) {
    id
    sku
    barcode
    description
    productMasterId
    slug
    name
    type
    foodType
    price
    mrp
    stock
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
    ratings
    reviews
    itemId
    warranty
    discount
    ageMin
    ageMax
    ageUnit
    cgst
    sgst
    igst
    returnInfo
    description
    keyFeatures
    expiryDate
    vendor {
      businessName
      id
    }
    productDetails {
      name
      value
      id
    }
    specifications {
      name
      value
      id
    }
    countryOfOrigin
    stock
  }
  trending(type: "hot", store: $store) {
    id
    sku
    barcode
    description
    productMasterId
    slug
    name
    type
    foodType
    price
    mrp
    stock
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
    ratings
    reviews
    itemId
    warranty
    discount
    ageMin
    ageMax
    ageUnit
    cgst
    sgst
    igst
    returnInfo
    description
    keyFeatures
    expiryDate
    vendor {
      businessName
      id
    }
    productDetails {
      name
      value
      id
    }
    specifications {
      name
      value
      id
    }
    countryOfOrigin
    stock
  }
  popular(store: $store, page: 0, zip: $zip) {
    data {
      id
      slug
      name
      type
      price
      mrp
      discount
      stock
      img
      imgCdn
      images
      imagesCdn
      time
      ratings
      reviews
      zips
      foodType
      expiryDate
      vendor {
        id
        slug
        businessName
        banner
        bannerCdn
      }
    }
    count
    pageSize
    page
  }
  groupByBanner(active: true, pageId: "home", store: $store) {
    _id {
      title
      type
    }
    data {
      link
      heading
      img
      imgCdn
      sort
      type
      pageId
      store
      active
      groupId
      groupTitle
      createdAt
      updatedAt
      id
    }
  }
}
`,

    rootType: "Query",

    selection: {
        brands: {
            type: "brandRes",
            keyRaw: "brands(parent: null, limit: 30, page: 0, featured: true, store: $store)",
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
                    type: "Brand",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id"
                        },

                        brandId: {
                            type: "String",
                            keyRaw: "brandId",
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

                        imgCdn: {
                            type: "String",
                            keyRaw: "imgCdn",
                            nullable: true
                        },

                        position: {
                            type: "Int",
                            keyRaw: "position",
                            nullable: true
                        },

                        info: {
                            type: "String",
                            keyRaw: "info",
                            nullable: true
                        },

                        meta: {
                            type: "String",
                            keyRaw: "meta",
                            nullable: true
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

                        facebookUrl: {
                            type: "String",
                            keyRaw: "facebookUrl",
                            nullable: true
                        },

                        instaUrl: {
                            type: "String",
                            keyRaw: "instaUrl",
                            nullable: true
                        },

                        twitterUrl: {
                            type: "String",
                            keyRaw: "twitterUrl",
                            nullable: true
                        },

                        linkedinUrl: {
                            type: "String",
                            keyRaw: "linkedinUrl",
                            nullable: true
                        },

                        youtubeUrl: {
                            type: "String",
                            keyRaw: "youtubeUrl",
                            nullable: true
                        },

                        pinterestUrl: {
                            type: "String",
                            keyRaw: "pinterestUrl",
                            nullable: true
                        },

                        googleUrl: {
                            type: "String",
                            keyRaw: "googleUrl",
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
                                },

                                active: {
                                    type: "Boolean",
                                    keyRaw: "active",
                                    nullable: true
                                }
                            }
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
            }
        },

        categories: {
            type: "categoryResSimple",
            keyRaw: "categories(img: true, shopbycategory: true, store: $store, sort: \"featuredSort\")",
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
                    type: "CategorySimple",
                    keyRaw: "data",
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

                        namePath: {
                            type: "String",
                            keyRaw: "namePath",
                            nullable: true
                        },

                        categoryId: {
                            type: "ID",
                            keyRaw: "categoryId",
                            nullable: true
                        },

                        parent: {
                            type: "ID",
                            keyRaw: "parent",
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

                        link: {
                            type: "String",
                            keyRaw: "link",
                            nullable: true
                        },

                        level: {
                            type: "Int",
                            keyRaw: "level",
                            nullable: true
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

                        store: {
                            type: "ID",
                            keyRaw: "store",
                            nullable: true
                        }
                    }
                }
            }
        },

        banners: {
            type: "bannerRes",
            keyRaw: "banners(sort: \"sort\", pageId: \"home\", active: true, store: $store)",
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
                    type: "OneBanner",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id"
                        },

                        link: {
                            type: "String",
                            keyRaw: "link",
                            nullable: true
                        },

                        heading: {
                            type: "String",
                            keyRaw: "heading",
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

                        sort: {
                            type: "Int",
                            keyRaw: "sort",
                            nullable: true
                        },

                        type: {
                            type: "String",
                            keyRaw: "type",
                            nullable: true
                        },

                        pageId: {
                            type: "String",
                            keyRaw: "pageId",
                            nullable: true
                        },

                        groupId: {
                            type: "String",
                            keyRaw: "groupId",
                            nullable: true
                        },

                        groupTitle: {
                            type: "String",
                            keyRaw: "groupTitle",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        },

                        isMobile: {
                            type: "Boolean",
                            keyRaw: "isMobile",
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

                        store: {
                            type: "ID",
                            keyRaw: "store",
                            nullable: true
                        }
                    }
                }
            }
        },

        youMayLike: {
            type: "Product",
            keyRaw: "youMayLike(store: $store)",
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

                description: {
                    type: "String",
                    keyRaw: "description",
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

                type: {
                    type: "String",
                    keyRaw: "type",
                    nullable: true
                },

                foodType: {
                    type: "String",
                    keyRaw: "foodType",
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

                discount: {
                    type: "Float",
                    keyRaw: "discount",
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

                keyFeatures: {
                    type: "String",
                    keyRaw: "keyFeatures",
                    nullable: true
                },

                expiryDate: {
                    type: "String",
                    keyRaw: "expiryDate",
                    nullable: true
                },

                vendor: {
                    type: "Vendor",
                    keyRaw: "vendor",
                    nullable: true,

                    fields: {
                        businessName: {
                            type: "String",
                            keyRaw: "businessName",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        }
                    }
                },

                productDetails: {
                    type: "Feature",
                    keyRaw: "productDetails",
                    nullable: true,

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                },

                specifications: {
                    type: "Feature",
                    keyRaw: "specifications",
                    nullable: true,

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                },

                countryOfOrigin: {
                    type: "String",
                    keyRaw: "countryOfOrigin",
                    nullable: true
                }
            }
        },

        trending: {
            type: "Product",
            keyRaw: "trending(type: \"hot\", store: $store)",
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

                description: {
                    type: "String",
                    keyRaw: "description",
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

                type: {
                    type: "String",
                    keyRaw: "type",
                    nullable: true
                },

                foodType: {
                    type: "String",
                    keyRaw: "foodType",
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

                discount: {
                    type: "Float",
                    keyRaw: "discount",
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

                keyFeatures: {
                    type: "String",
                    keyRaw: "keyFeatures",
                    nullable: true
                },

                expiryDate: {
                    type: "String",
                    keyRaw: "expiryDate",
                    nullable: true
                },

                vendor: {
                    type: "Vendor",
                    keyRaw: "vendor",
                    nullable: true,

                    fields: {
                        businessName: {
                            type: "String",
                            keyRaw: "businessName",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        }
                    }
                },

                productDetails: {
                    type: "Feature",
                    keyRaw: "productDetails",
                    nullable: true,

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                },

                specifications: {
                    type: "Feature",
                    keyRaw: "specifications",
                    nullable: true,

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                },

                countryOfOrigin: {
                    type: "String",
                    keyRaw: "countryOfOrigin",
                    nullable: true
                }
            }
        },

        popular: {
            type: "SearchRes",
            keyRaw: "popular(store: $store, page: 0, zip: $zip)",
            nullable: true,

            fields: {
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

                        expiryDate: {
                            type: "String",
                            keyRaw: "expiryDate",
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
                        }
                    }
                },

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

                page: {
                    type: "Int",
                    keyRaw: "page",
                    nullable: true
                }
            }
        },

        groupByBanner: {
            type: "bannerGroup",
            keyRaw: "groupByBanner(active: true, pageId: \"home\", store: $store)",
            nullable: true,

            fields: {
                _id: {
                    type: "bgData",
                    keyRaw: "_id",
                    nullable: true,

                    fields: {
                        title: {
                            type: "String",
                            keyRaw: "title",
                            nullable: true
                        },

                        type: {
                            type: "String",
                            keyRaw: "type",
                            nullable: true
                        }
                    }
                },

                data: {
                    type: "OneBanner",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        link: {
                            type: "String",
                            keyRaw: "link",
                            nullable: true
                        },

                        heading: {
                            type: "String",
                            keyRaw: "heading",
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

                        sort: {
                            type: "Int",
                            keyRaw: "sort",
                            nullable: true
                        },

                        type: {
                            type: "String",
                            keyRaw: "type",
                            nullable: true
                        },

                        pageId: {
                            type: "String",
                            keyRaw: "pageId",
                            nullable: true
                        },

                        store: {
                            type: "ID",
                            keyRaw: "store",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        },

                        groupId: {
                            type: "String",
                            keyRaw: "groupId",
                            nullable: true
                        },

                        groupTitle: {
                            type: "String",
                            keyRaw: "groupTitle",
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
            store: "ID",
            zip: "String"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=1c04c832220461894ae9673e2a865ca2d1b8b2432df4a6cef9c9872a81912aa4";