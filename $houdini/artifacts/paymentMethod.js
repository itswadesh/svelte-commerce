export default {
    name: "paymentMethod",
    kind: "HoudiniQuery",
    hash: "e059fac7273413158870ab424dc75a33c3f05f06f5f791ae7de2f5c1aa7e217e",

    raw: `query paymentMethod($id: ID!) {
  paymentMethod(id: $id) {
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
`,

    rootType: "Query",

    selection: {
        paymentMethod: {
            type: "PaymentMethod",
            keyRaw: "paymentMethod(id: $id)",
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

"HoudiniHash=e059fac7273413158870ab424dc75a33c3f05f06f5f791ae7de2f5c1aa7e217e";