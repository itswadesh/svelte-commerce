export default {
    name: "paymentMethods",
    kind: "HoudiniQuery",
    hash: "c94fe98fa92a3d9cac64f3ca66010ec13c19aac0392dd1adba65b17306f5598f",

    raw: `query paymentMethods($page: Int, $search: String, $limit: Int, $sort: String, $store: ID, $active: Boolean) {
  paymentMethods(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    active: $active
    store: $store
  ) {
    count
    page
    pageSize
    data {
      id
      name
      img
      imgCdn
      value
      color
      key
      text
      qrcode
      type
      instructions
      position
      active
    }
  }
}
`,

    rootType: "Query",

    selection: {
        paymentMethods: {
            type: "PayMethodRes",
            keyRaw: "paymentMethods(page: $page, search: $search, limit: $limit, sort: $sort, active: $active, store: $store)",
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
                    type: "PaymentMethod",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "String",
                            keyRaw: "id"
                        },

                        name: {
                            type: "String",
                            keyRaw: "name"
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

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        },

                        color: {
                            type: "String",
                            keyRaw: "color",
                            nullable: true
                        },

                        key: {
                            type: "String",
                            keyRaw: "key",
                            nullable: true
                        },

                        text: {
                            type: "String",
                            keyRaw: "text",
                            nullable: true
                        },

                        qrcode: {
                            type: "String",
                            keyRaw: "qrcode",
                            nullable: true
                        },

                        type: {
                            type: "String",
                            keyRaw: "type",
                            nullable: true
                        },

                        instructions: {
                            type: "String",
                            keyRaw: "instructions",
                            nullable: true
                        },

                        position: {
                            type: "Int",
                            keyRaw: "position",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
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
            store: "ID",
            active: "Boolean"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=5f89d3c130e81ca1c7be33c499e4e2e307e742f38222f668170f37df09383ce1";