export default {
    name: "stripe",
    kind: "HoudiniMutation",
    hash: "edbac60f2f172e8897e08cdf82778e28a682b039b836ce7fcf6d20a13821cbcc",

    raw: `mutation stripe($address: ID, $paymentMethodId: String, $slot: ID) {
  stripe(address: $address, paymentMethodId: $paymentMethodId, slot: $slot) {
    id
    paymentOrderId
    paymentMode
    paymentGateway
    referenceId
    txMsg
    txTime
    invoiceId
    receipt
    paid
    amountPaid
    amountDue
    amountRefunded
    currency
    captured
    status
    orderId
    notes
    refundStatus
    description
    email
    contact
    fee
    tax
    errorCode
    errorDescription
    token
    clientSecret
    approvalUrl
  }
}
`,

    rootType: "Mutation",

    selection: {
        stripe: {
            type: "OnePayment",
            keyRaw: "stripe(address: $address, paymentMethodId: $paymentMethodId, slot: $slot)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                },

                paymentOrderId: {
                    type: "String",
                    keyRaw: "paymentOrderId",
                    nullable: true
                },

                paymentMode: {
                    type: "String",
                    keyRaw: "paymentMode",
                    nullable: true
                },

                paymentGateway: {
                    type: "String",
                    keyRaw: "paymentGateway",
                    nullable: true
                },

                referenceId: {
                    type: "String",
                    keyRaw: "referenceId",
                    nullable: true
                },

                txMsg: {
                    type: "String",
                    keyRaw: "txMsg",
                    nullable: true
                },

                txTime: {
                    type: "String",
                    keyRaw: "txTime",
                    nullable: true
                },

                invoiceId: {
                    type: "String",
                    keyRaw: "invoiceId",
                    nullable: true
                },

                receipt: {
                    type: "String",
                    keyRaw: "receipt",
                    nullable: true
                },

                paid: {
                    type: "Boolean",
                    keyRaw: "paid",
                    nullable: true
                },

                amountPaid: {
                    type: "Float",
                    keyRaw: "amountPaid",
                    nullable: true
                },

                amountDue: {
                    type: "Float",
                    keyRaw: "amountDue",
                    nullable: true
                },

                amountRefunded: {
                    type: "Float",
                    keyRaw: "amountRefunded",
                    nullable: true
                },

                currency: {
                    type: "String",
                    keyRaw: "currency",
                    nullable: true
                },

                captured: {
                    type: "Boolean",
                    keyRaw: "captured",
                    nullable: true
                },

                status: {
                    type: "String",
                    keyRaw: "status",
                    nullable: true
                },

                orderId: {
                    type: "String",
                    keyRaw: "orderId",
                    nullable: true
                },

                notes: {
                    type: "String",
                    keyRaw: "notes",
                    nullable: true
                },

                refundStatus: {
                    type: "String",
                    keyRaw: "refundStatus",
                    nullable: true
                },

                description: {
                    type: "String",
                    keyRaw: "description",
                    nullable: true
                },

                email: {
                    type: "String",
                    keyRaw: "email",
                    nullable: true
                },

                contact: {
                    type: "String",
                    keyRaw: "contact",
                    nullable: true
                },

                fee: {
                    type: "Float",
                    keyRaw: "fee",
                    nullable: true
                },

                tax: {
                    type: "Float",
                    keyRaw: "tax",
                    nullable: true
                },

                errorCode: {
                    type: "String",
                    keyRaw: "errorCode",
                    nullable: true
                },

                errorDescription: {
                    type: "String",
                    keyRaw: "errorDescription",
                    nullable: true
                },

                token: {
                    type: "String",
                    keyRaw: "token",
                    nullable: true
                },

                clientSecret: {
                    type: "String",
                    keyRaw: "clientSecret",
                    nullable: true
                },

                approvalUrl: {
                    type: "String",
                    keyRaw: "approvalUrl",
                    nullable: true
                }
            }
        }
    },

    input: {
        fields: {
            address: "ID",
            paymentMethodId: "String",
            slot: "ID"
        },

        types: {}
    }
};

"HoudiniHash=02f50b0fa4125a68f39f4bfab7164a5092d2087d5df63520d79ebdd6c2d05ff6";