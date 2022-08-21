export default {
    name: "categories",
    kind: "HoudiniQuery",
    hash: "134bb2f2728a1818020fdb75b846f1f467664143e490a55d20372da9de360b0e",

    raw: `query categories($page: Int, $search: String, $limit: Int, $sort: String, $megamenu: Boolean, $featured: Boolean, $active: Boolean, $img: Boolean, $shopbycategory: Boolean, $store: ID) {
  categories(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    megamenu: $megamenu
    featured: $featured
    active: $active
    img: $img
    shopbycategory: $shopbycategory
    store: $store
  ) {
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
      banner
      bannerCdn
      level
      link
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
      store
    }
  }
}
`,

    rootType: "Query",

    selection: {
        categories: {
            type: "categoryResSimple",
            keyRaw: "categories(page: $page, search: $search, limit: $limit, sort: $sort, megamenu: $megamenu, featured: $featured, active: $active, img: $img, shopbycategory: $shopbycategory, store: $store)",
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

                        store: {
                            type: "ID",
                            keyRaw: "store",
                            nullable: true
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
            megamenu: "Boolean",
            featured: "Boolean",
            active: "Boolean",
            img: "Boolean",
            shopbycategory: "Boolean",
            store: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=890b6d9fc864e593b631ea17b53facf917d28e751b17f247fa193d9d0fb21be5";