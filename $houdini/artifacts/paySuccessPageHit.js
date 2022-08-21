export default {
    name: "paySuccessPageHit",
    kind: "HoudiniMutation",
    hash: "12b2c483262027ab1d7a927feba5d8c324cd9e894503f5c6a77019f8ede31b26",

    raw: `mutation paySuccessPageHit($orderId: ID, $paymentReferenceId: String) {
  paySuccessPageHit(orderId: $orderId, paymentReferenceId: $paymentReferenceId) {
    id
    orderNo
    otp
    createdAt
    paySuccess
    paymentMode
    paymentStatus
    paymentCurrency
    paymentReferenceId
    paymentOrderId
    paymentReceipt
    invoiceId
    paymentGateway
    codPaid
    baseCodPaid
    amountPaid
    amountDue
    paymentMsg
    paymentTime
    paid
    totalAmountRefunded
    baseTotalAmountRefunded
    amount {
      qty
      subtotal
      tax
      discount
      total
      shipping
    }
    baseAmount {
      qty
      subtotal
      tax
      discount
      total
      shipping
    }
    userFirstName
    userLastName
    userPhone
    userEmail
    address {
      firstName
      lastName
      town
      city
      state
      zip
      address
      lat
      lng
      id
    }
    items {
      id
      pid
      posInvoiceNo
      itemOrderNo
      name
      barcode
      img
      imgCdn
      slug
      foodType
      price
      basePrice
      qty
      shippingCharge
      baseShippingCharge
      tax
      baseTax
      time
      usedOptions {
        name
        val
        dates
      }
      brandName
      brandImg
      color
      size
      status
      type
      returnReason
      status
      amountRefunded
      baseAmountRefunded
      vendorBusinessName
      vendorAddress {
        firstName
        lastName
        town
        city
        state
        zip
        address
        lat
        lng
        id
      }
      orderHistory {
        status
        title
        body
        icon
        public
        index
        time
        id
      }
    }
  }
}
`,

    rootType: "Mutation",

    selection: {
        paySuccessPageHit: {
            type: "Order",
            keyRaw: "paySuccessPageHit(orderId: $orderId, paymentReferenceId: $paymentReferenceId)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                },

                orderNo: {
                    type: "String",
                    keyRaw: "orderNo",
                    nullable: true
                },

                otp: {
                    type: "String",
                    keyRaw: "otp",
                    nullable: true
                },

                createdAt: {
                    type: "String",
                    keyRaw: "createdAt",
                    nullable: true
                },

                paySuccess: {
                    type: "Int",
                    keyRaw: "paySuccess",
                    nullable: true
                },

                paymentMode: {
                    type: "String",
                    keyRaw: "paymentMode",
                    nullable: true
                },

                paymentStatus: {
                    type: "String",
                    keyRaw: "paymentStatus",
                    nullable: true
                },

                paymentCurrency: {
                    type: "String",
                    keyRaw: "paymentCurrency",
                    nullable: true
                },

                paymentReferenceId: {
                    type: "String",
                    keyRaw: "paymentReferenceId",
                    nullable: true
                },

                paymentOrderId: {
                    type: "String",
                    keyRaw: "paymentOrderId",
                    nullable: true
                },

                paymentReceipt: {
                    type: "String",
                    keyRaw: "paymentReceipt",
                    nullable: true
                },

                invoiceId: {
                    type: "String",
                    keyRaw: "invoiceId",
                    nullable: true
                },

                paymentGateway: {
                    type: "String",
                    keyRaw: "paymentGateway",
                    nullable: true
                },

                codPaid: {
                    type: "Float",
                    keyRaw: "codPaid",
                    nullable: true
                },

                baseCodPaid: {
                    type: "Float",
                    keyRaw: "baseCodPaid",
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

                paymentMsg: {
                    type: "String",
                    keyRaw: "paymentMsg",
                    nullable: true
                },

                paymentTime: {
                    type: "String",
                    keyRaw: "paymentTime",
                    nullable: true
                },

                paid: {
                    type: "Boolean",
                    keyRaw: "paid",
                    nullable: true
                },

                totalAmountRefunded: {
                    type: "Float",
                    keyRaw: "totalAmountRefunded",
                    nullable: true
                },

                baseTotalAmountRefunded: {
                    type: "Float",
                    keyRaw: "baseTotalAmountRefunded",
                    nullable: true
                },

                amount: {
                    type: "Amount",
                    keyRaw: "amount",
                    nullable: true,

                    fields: {
                        qty: {
                            type: "Int",
                            keyRaw: "qty",
                            nullable: true
                        },

                        subtotal: {
                            type: "Float",
                            keyRaw: "subtotal",
                            nullable: true
                        },

                        tax: {
                            type: "Float",
                            keyRaw: "tax",
                            nullable: true
                        },

                        discount: {
                            type: "Float",
                            keyRaw: "discount",
                            nullable: true
                        },

                        total: {
                            type: "Float",
                            keyRaw: "total",
                            nullable: true
                        },

                        shipping: {
                            type: "Float",
                            keyRaw: "shipping",
                            nullable: true
                        }
                    }
                },

                baseAmount: {
                    type: "Amount",
                    keyRaw: "baseAmount",
                    nullable: true,

                    fields: {
                        qty: {
                            type: "Int",
                            keyRaw: "qty",
                            nullable: true
                        },

                        subtotal: {
                            type: "Float",
                            keyRaw: "subtotal",
                            nullable: true
                        },

                        tax: {
                            type: "Float",
                            keyRaw: "tax",
                            nullable: true
                        },

                        discount: {
                            type: "Float",
                            keyRaw: "discount",
                            nullable: true
                        },

                        total: {
                            type: "Float",
                            keyRaw: "total",
                            nullable: true
                        },

                        shipping: {
                            type: "Float",
                            keyRaw: "shipping",
                            nullable: true
                        }
                    }
                },

                userFirstName: {
                    type: "String",
                    keyRaw: "userFirstName",
                    nullable: true
                },

                userLastName: {
                    type: "String",
                    keyRaw: "userLastName",
                    nullable: true
                },

                userPhone: {
                    type: "String",
                    keyRaw: "userPhone",
                    nullable: true
                },

                userEmail: {
                    type: "String",
                    keyRaw: "userEmail",
                    nullable: true
                },

                address: {
                    type: "Address",
                    keyRaw: "address",
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

                        town: {
                            type: "String",
                            keyRaw: "town",
                            nullable: true
                        },

                        city: {
                            type: "String",
                            keyRaw: "city",
                            nullable: true
                        },

                        state: {
                            type: "String",
                            keyRaw: "state",
                            nullable: true
                        },

                        zip: {
                            type: "String",
                            keyRaw: "zip",
                            nullable: true
                        },

                        address: {
                            type: "String",
                            keyRaw: "address",
                            nullable: true
                        },

                        lat: {
                            type: "Float",
                            keyRaw: "lat",
                            nullable: true
                        },

                        lng: {
                            type: "Float",
                            keyRaw: "lng",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                },

                items: {
                    type: "OrderItem",
                    keyRaw: "items",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        },

                        pid: {
                            type: "ID",
                            keyRaw: "pid",
                            nullable: true
                        },

                        posInvoiceNo: {
                            type: "String",
                            keyRaw: "posInvoiceNo",
                            nullable: true
                        },

                        itemOrderNo: {
                            type: "String",
                            keyRaw: "itemOrderNo",
                            nullable: true
                        },

                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        barcode: {
                            type: "String",
                            keyRaw: "barcode",
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

                        slug: {
                            type: "String",
                            keyRaw: "slug",
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

                        basePrice: {
                            type: "Float",
                            keyRaw: "basePrice",
                            nullable: true
                        },

                        qty: {
                            type: "Int",
                            keyRaw: "qty",
                            nullable: true
                        },

                        shippingCharge: {
                            type: "Float",
                            keyRaw: "shippingCharge",
                            nullable: true
                        },

                        baseShippingCharge: {
                            type: "Float",
                            keyRaw: "baseShippingCharge",
                            nullable: true
                        },

                        tax: {
                            type: "Float",
                            keyRaw: "tax",
                            nullable: true
                        },

                        baseTax: {
                            type: "Float",
                            keyRaw: "baseTax",
                            nullable: true
                        },

                        time: {
                            type: "String",
                            keyRaw: "time",
                            nullable: true
                        },

                        usedOptions: {
                            type: "UsedOption",
                            keyRaw: "usedOptions",
                            nullable: true,

                            fields: {
                                name: {
                                    type: "String",
                                    keyRaw: "name",
                                    nullable: true
                                },

                                val: {
                                    type: "String",
                                    keyRaw: "val",
                                    nullable: true
                                },

                                dates: {
                                    type: "String",
                                    keyRaw: "dates",
                                    nullable: true
                                }
                            }
                        },

                        brandName: {
                            type: "String",
                            keyRaw: "brandName",
                            nullable: true
                        },

                        brandImg: {
                            type: "String",
                            keyRaw: "brandImg",
                            nullable: true
                        },

                        color: {
                            type: "String",
                            keyRaw: "color",
                            nullable: true
                        },

                        size: {
                            type: "String",
                            keyRaw: "size",
                            nullable: true
                        },

                        status: {
                            type: "String",
                            keyRaw: "status",
                            nullable: true
                        },

                        type: {
                            type: "String",
                            keyRaw: "type",
                            nullable: true
                        },

                        returnReason: {
                            type: "String",
                            keyRaw: "returnReason",
                            nullable: true
                        },

                        amountRefunded: {
                            type: "Float",
                            keyRaw: "amountRefunded",
                            nullable: true
                        },

                        baseAmountRefunded: {
                            type: "Float",
                            keyRaw: "baseAmountRefunded",
                            nullable: true
                        },

                        vendorBusinessName: {
                            type: "String",
                            keyRaw: "vendorBusinessName",
                            nullable: true
                        },

                        vendorAddress: {
                            type: "Address",
                            keyRaw: "vendorAddress",
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

                                town: {
                                    type: "String",
                                    keyRaw: "town",
                                    nullable: true
                                },

                                city: {
                                    type: "String",
                                    keyRaw: "city",
                                    nullable: true
                                },

                                state: {
                                    type: "String",
                                    keyRaw: "state",
                                    nullable: true
                                },

                                zip: {
                                    type: "String",
                                    keyRaw: "zip",
                                    nullable: true
                                },

                                address: {
                                    type: "String",
                                    keyRaw: "address",
                                    nullable: true
                                },

                                lat: {
                                    type: "Float",
                                    keyRaw: "lat",
                                    nullable: true
                                },

                                lng: {
                                    type: "Float",
                                    keyRaw: "lng",
                                    nullable: true
                                },

                                id: {
                                    type: "ID",
                                    keyRaw: "id"
                                }
                            }
                        },

                        orderHistory: {
                            type: "OrderHistory",
                            keyRaw: "orderHistory",
                            nullable: true,

                            fields: {
                                status: {
                                    type: "String",
                                    keyRaw: "status",
                                    nullable: true
                                },

                                title: {
                                    type: "String",
                                    keyRaw: "title",
                                    nullable: true
                                },

                                body: {
                                    type: "String",
                                    keyRaw: "body",
                                    nullable: true
                                },

                                icon: {
                                    type: "String",
                                    keyRaw: "icon",
                                    nullable: true
                                },

                                public: {
                                    type: "Boolean",
                                    keyRaw: "public",
                                    nullable: true
                                },

                                index: {
                                    type: "Int",
                                    keyRaw: "index",
                                    nullable: true
                                },

                                time: {
                                    type: "String",
                                    keyRaw: "time",
                                    nullable: true
                                },

                                id: {
                                    type: "String",
                                    keyRaw: "id",
                                    nullable: true
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
            orderId: "ID",
            paymentReferenceId: "String"
        },

        types: {}
    }
};

"HoudiniHash=30fa7a0044e0e061fde7d4206d2715b479ea57e77748027aba4f2af335625fe1";