export default {
    name: "paymentMethodsAdmin",
    kind: "HoudiniQuery",
    hash: "dcd75b5e5d966147c7d2dc3cb79d3f736802ada1636b61abdb60905966ced2d4",

    raw: `query paymentMethodsAdmin($page: Int, $search: String, $limit: Int, $sort: String, $active: Boolean, $store: ID) {
  paymentMethodsAdmin(
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
      isError
    }
  }
}
`,

    rootType: "Query",

    selection: {
        paymentMethodsAdmin: {
            type: "PayMethodRes",
            keyRaw: "paymentMethodsAdmin(page: $page, search: $search, limit: $limit, sort: $sort, active: $active, store: $store)",
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
                        },

                        isError: {
                            type: "Boolean",
                            keyRaw: "isError",
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
            active: "Boolean",
            store: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=bf63efaaa647e2ab8e3dab1818f70718443ff07e884111cd348a6bc7077e22c7";