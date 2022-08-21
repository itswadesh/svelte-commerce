export default {
    name: "cashfreePayNowNew",
    kind: "HoudiniMutation",
    hash: "3f38576133772a093dc60f99ae9b1a52cff6b2cbabf2e6241e635f5a795e9e6f",

    raw: `mutation cashfreePayNowNew($address: ID, $slot: ID) {
  cashfreePayNowNew(address: $address, slot: $slot) {
    orderId
    token
    redirectUrl
    id
  }
}
`,

    rootType: "Mutation",

    selection: {
        cashfreePayNowNew: {
            type: "Payment",
            keyRaw: "cashfreePayNowNew(address: $address, slot: $slot)",
            nullable: true,

            fields: {
                orderId: {
                    type: "String",
                    keyRaw: "orderId",
                    nullable: true
                },

                token: {
                    type: "String",
                    keyRaw: "token",
                    nullable: true
                },

                redirectUrl: {
                    type: "String",
                    keyRaw: "redirectUrl",
                    nullable: true
                },

                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                }
            }
        }
    },

    input: {
        fields: {
            address: "ID",
            slot: "ID"
        },

        types: {}
    }
};

"HoudiniHash=ab6fb747a96e322af48a7a732985246a9ba4fba9bafa96fb9c0cf4ea7aa9002e";