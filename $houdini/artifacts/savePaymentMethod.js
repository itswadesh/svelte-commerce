export default {
    name: "savePaymentMethod",
    kind: "HoudiniMutation",
    hash: "694a4ffedcd78d806a34030570bde26dc4ef07d9ce7f8ef6d594fc0bd956c799",

    raw: `mutation savePaymentMethod($id: String!, $name: String, $value: String, $key: String, $color: String, $img: String, $qrcode: String, $type: String, $text: String, $instructions: String, $position: Int, $active: Boolean) {
  savePaymentMethod(
    id: $id
    name: $name
    value: $value
    key: $key
    color: $color
    img: $img
    qrcode: $qrcode
    type: $type
    text: $text
    instructions: $instructions
    position: $position
    active: $active
  ) {
    id
    name
    key
    color
    img
    qrcode
    type
    imgCdn
    text
    instructions
    value
    position
    active
  }
}
`,

    rootType: "Mutation",

    selection: {
        savePaymentMethod: {
            type: "PaymentMethod",
            keyRaw: "savePaymentMethod(id: $id, name: $name, value: $value, key: $key, color: $color, img: $img, qrcode: $qrcode, type: $type, text: $text, instructions: $instructions, position: $position, active: $active)",
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

                key: {
                    type: "String",
                    keyRaw: "key",
                    nullable: true
                },

                color: {
                    type: "String",
                    keyRaw: "color",
                    nullable: true
                },

                img: {
                    type: "String",
                    keyRaw: "img",
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

                imgCdn: {
                    type: "String",
                    keyRaw: "imgCdn",
                    nullable: true
                },

                text: {
                    type: "String",
                    keyRaw: "text",
                    nullable: true
                },

                instructions: {
                    type: "String",
                    keyRaw: "instructions",
                    nullable: true
                },

                value: {
                    type: "String",
                    keyRaw: "value",
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
    },

    input: {
        fields: {
            id: "String",
            name: "String",
            value: "String",
            key: "String",
            color: "String",
            img: "String",
            qrcode: "String",
            type: "String",
            text: "String",
            instructions: "String",
            position: "Int",
            active: "Boolean"
        },

        types: {}
    }
};

"HoudiniHash=fc66534ddd7d28cb95a344b3b5dcd983820a1de7f5204f9957c523d23e9cc232";