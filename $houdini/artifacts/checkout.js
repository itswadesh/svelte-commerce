export default {
    name: "checkout",
    kind: "HoudiniMutation",
    hash: "e5ffa617ff071b751d99cd95df14f352bba31cb0470a5affcbff593393bc6e3a",

    raw: `mutation checkout($address: ID, $slot: ID) {
  checkout(address: $address, slot: $slot) {
    id
    orderNo
    otp
    createdAt
    updatedAt
    payment {
      id
    }
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
    paymentStatus
    paymentMsg
    paymentTime
    paid
    amount {
      qty
      subtotal
      tax
      discount
      total
      shipping
    }
    baseAmount {
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
    store {
      id
      name
    }
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
      pid
      status
      posInvoiceNo
      itemOrderNo
      name
      barcode
      img
      imgCdn
      slug
      price
      basePrice
      qty
      shippingCharge
      baseShippingCharge
      tax
      baseTax
      subtotal
      baseSubtotal
      total
      baseTotal
      time
      brandName
      brandImg
      brandImgCdn
      parentBrandName
      parentBrandImg
      parentBrandImgCdn
      color
      size
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
      vendor {
        id
        businessName
      }
      id
    }
    orderItems {
      id
    }
  }
}
`,

    rootType: "Mutation",

    selection: {
        checkout: {
            type: "Order",
            keyRaw: "checkout(address: $address, slot: $slot)",
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

                updatedAt: {
                    type: "String",
                    keyRaw: "updatedAt",
                    nullable: true
                },

                payment: {
                    type: "Payment",
                    keyRaw: "payment",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        }
                    }
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
                        }
                    }
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
                        pid: {
                            type: "ID",
                            keyRaw: "pid",
                            nullable: true
                        },

                        status: {
                            type: "String",
                            keyRaw: "status",
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

                        subtotal: {
                            type: "Float",
                            keyRaw: "subtotal",
                            nullable: true
                        },

                        baseSubtotal: {
                            type: "Float",
                            keyRaw: "baseSubtotal",
                            nullable: true
                        },

                        total: {
                            type: "Float",
                            keyRaw: "total",
                            nullable: true
                        },

                        baseTotal: {
                            type: "Float",
                            keyRaw: "baseTotal",
                            nullable: true
                        },

                        time: {
                            type: "String",
                            keyRaw: "time",
                            nullable: true
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

                        brandImgCdn: {
                            type: "String",
                            keyRaw: "brandImgCdn",
                            nullable: true
                        },

                        parentBrandName: {
                            type: "String",
                            keyRaw: "parentBrandName",
                            nullable: true
                        },

                        parentBrandImg: {
                            type: "String",
                            keyRaw: "parentBrandImg",
                            nullable: true
                        },

                        parentBrandImgCdn: {
                            type: "String",
                            keyRaw: "parentBrandImgCdn",
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

                                businessName: {
                                    type: "String",
                                    keyRaw: "businessName",
                                    nullable: true
                                }
                            }
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        }
                    }
                },

                orderItems: {
                    type: "OrderItem",
                    keyRaw: "orderItems",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        }
                    }
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

"HoudiniHash=e3578fb446b607ef03f8ea95bfa95c463212d5bb283397b7ef25cc2f3068a3aa";