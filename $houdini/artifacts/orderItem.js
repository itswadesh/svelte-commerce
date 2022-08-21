export default {
    name: "orderItem",
    kind: "HoudiniQuery",
    hash: "1ca40a301ef5ff53cfdfe1b3913cec492545dc656593ae66dad7d11bb08438ae",

    raw: `query orderItem($id: ID!) {
  orderItem(id: $id) {
    id
    orderId
    status
    pid
    usedOptions {
      name
      val
      dates
    }
    posInvoiceNo
    invoiceId
    itemOrderNo
    expectedDeliveryDate
    deliveryDetails
    shippingOrderId
    shippingProvider
    shippingLabelId
    shippingRateId
    shippingTrackingNumber
    shippingTrackingStatus
    shippingTrackingUrlProvider
    shippingLabelUrl
    shippingCommercialInvoiceUrl
    name
    slug
    img
    imgCdn
    tracking
    foodType
    shippingCharge
    price
    basePrice
    qty
    tax
    baseTax
    total
    totalDiscount
    subtotal
    brandName
    brandImg
    brandImgCdn
    size
    color
    trackingId
    returnTrackingId
    courierName
    returnCourierName
    replaceValidTill
    returnValidTill
    returnPolicyExpired
    returnReason
    type
    amountRefunded
    baseAmountRefunded
    refunds {
      message
      qty
      time
      amount
      refundId
    }
    orderNo
    otp
    createdAt
    paySuccess
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
    totalAmountRefunded
    baseTotalAmountRefunded
    paymentMsg
    paymentTime
    paid
    userFirstName
    userLastName
    userPhone
    userEmail
    invoiceLink
    discount
    baseDiscount
    totalDiscount
    baseTotalDiscount
    weight
    unit
    amount {
      total
      discount
      totalDiscount
      subtotal
    }
    baseAmount {
      total
      discount
      totalDiscount
      subtotal
    }
    user {
      id
      firstName
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
    store {
      id
      name
      email
    }
    slot {
      name
      value
      info
      active
      id
    }
    vendor {
      id
      slug
      businessName
      banner
      bannerCdn
    }
    vendorBusinessName
    vendorPhone
    vendorEmail
    vendorCommissionType
    vendorCommissionValue
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
    formattedSubtotal
    formattedShippingCharge
    formattedMrp
    formattedAmountRefunded
    formattedPrice
    formattedTax
    formattedTotal
    formattedTotalDiscount
    formattedVendorCommission
    formattedAmountDue
    formattedAmountPaid
    formattedCodPaid
    formattedDiscount
    formattedPaymentAmount
    formattedTotalAmountRefunded
    formattedAmount {
      subtotal
      tax
      discount
      shipping
      total
      totalDiscount
      exchangeRate
    }
    orderHistory {
      id
      status
      title
      body
      icon
      public
      index
      time
    }
  }
}
`,

    rootType: "Query",

    selection: {
        orderItem: {
            type: "OrderItem",
            keyRaw: "orderItem(id: $id)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                },

                orderId: {
                    type: "ID",
                    keyRaw: "orderId",
                    nullable: true
                },

                status: {
                    type: "String",
                    keyRaw: "status",
                    nullable: true
                },

                pid: {
                    type: "ID",
                    keyRaw: "pid",
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

                posInvoiceNo: {
                    type: "String",
                    keyRaw: "posInvoiceNo",
                    nullable: true
                },

                invoiceId: {
                    type: "String",
                    keyRaw: "invoiceId",
                    nullable: true
                },

                itemOrderNo: {
                    type: "String",
                    keyRaw: "itemOrderNo",
                    nullable: true
                },

                expectedDeliveryDate: {
                    type: "String",
                    keyRaw: "expectedDeliveryDate",
                    nullable: true
                },

                deliveryDetails: {
                    type: "String",
                    keyRaw: "deliveryDetails",
                    nullable: true
                },

                shippingOrderId: {
                    type: "String",
                    keyRaw: "shippingOrderId",
                    nullable: true
                },

                shippingProvider: {
                    type: "String",
                    keyRaw: "shippingProvider",
                    nullable: true
                },

                shippingLabelId: {
                    type: "String",
                    keyRaw: "shippingLabelId",
                    nullable: true
                },

                shippingRateId: {
                    type: "String",
                    keyRaw: "shippingRateId",
                    nullable: true
                },

                shippingTrackingNumber: {
                    type: "String",
                    keyRaw: "shippingTrackingNumber",
                    nullable: true
                },

                shippingTrackingStatus: {
                    type: "String",
                    keyRaw: "shippingTrackingStatus",
                    nullable: true
                },

                shippingTrackingUrlProvider: {
                    type: "String",
                    keyRaw: "shippingTrackingUrlProvider",
                    nullable: true
                },

                shippingLabelUrl: {
                    type: "String",
                    keyRaw: "shippingLabelUrl",
                    nullable: true
                },

                shippingCommercialInvoiceUrl: {
                    type: "String",
                    keyRaw: "shippingCommercialInvoiceUrl",
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

                tracking: {
                    type: "String",
                    keyRaw: "tracking",
                    nullable: true
                },

                foodType: {
                    type: "String",
                    keyRaw: "foodType",
                    nullable: true
                },

                shippingCharge: {
                    type: "Float",
                    keyRaw: "shippingCharge",
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

                total: {
                    type: "Float",
                    keyRaw: "total",
                    nullable: true
                },

                totalDiscount: {
                    type: "Float",
                    keyRaw: "totalDiscount",
                    nullable: true
                },

                subtotal: {
                    type: "Float",
                    keyRaw: "subtotal",
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

                size: {
                    type: "String",
                    keyRaw: "size",
                    nullable: true
                },

                color: {
                    type: "String",
                    keyRaw: "color",
                    nullable: true
                },

                trackingId: {
                    type: "String",
                    keyRaw: "trackingId",
                    nullable: true
                },

                returnTrackingId: {
                    type: "String",
                    keyRaw: "returnTrackingId",
                    nullable: true
                },

                courierName: {
                    type: "String",
                    keyRaw: "courierName",
                    nullable: true
                },

                returnCourierName: {
                    type: "String",
                    keyRaw: "returnCourierName",
                    nullable: true
                },

                replaceValidTill: {
                    type: "String",
                    keyRaw: "replaceValidTill",
                    nullable: true
                },

                returnValidTill: {
                    type: "String",
                    keyRaw: "returnValidTill",
                    nullable: true
                },

                returnPolicyExpired: {
                    type: "Boolean",
                    keyRaw: "returnPolicyExpired",
                    nullable: true
                },

                returnReason: {
                    type: "String",
                    keyRaw: "returnReason",
                    nullable: true
                },

                type: {
                    type: "String",
                    keyRaw: "type",
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

                refunds: {
                    type: "Refund",
                    keyRaw: "refunds",
                    nullable: true,

                    fields: {
                        message: {
                            type: "String",
                            keyRaw: "message",
                            nullable: true
                        },

                        qty: {
                            type: "Int",
                            keyRaw: "qty",
                            nullable: true
                        },

                        time: {
                            type: "String",
                            keyRaw: "time",
                            nullable: true
                        },

                        amount: {
                            type: "Float",
                            keyRaw: "amount",
                            nullable: true
                        },

                        refundId: {
                            type: "String",
                            keyRaw: "refundId",
                            nullable: true
                        }
                    }
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

                invoiceLink: {
                    type: "String",
                    keyRaw: "invoiceLink",
                    nullable: true
                },

                discount: {
                    type: "Float",
                    keyRaw: "discount",
                    nullable: true
                },

                baseDiscount: {
                    type: "Float",
                    keyRaw: "baseDiscount",
                    nullable: true
                },

                baseTotalDiscount: {
                    type: "Float",
                    keyRaw: "baseTotalDiscount",
                    nullable: true
                },

                weight: {
                    type: "Float",
                    keyRaw: "weight",
                    nullable: true
                },

                unit: {
                    type: "String",
                    keyRaw: "unit",
                    nullable: true
                },

                amount: {
                    type: "Amount",
                    keyRaw: "amount",
                    nullable: true,

                    fields: {
                        total: {
                            type: "Float",
                            keyRaw: "total",
                            nullable: true
                        },

                        discount: {
                            type: "Float",
                            keyRaw: "discount",
                            nullable: true
                        },

                        totalDiscount: {
                            type: "Float",
                            keyRaw: "totalDiscount",
                            nullable: true
                        },

                        subtotal: {
                            type: "Float",
                            keyRaw: "subtotal",
                            nullable: true
                        }
                    }
                },

                baseAmount: {
                    type: "Amount",
                    keyRaw: "baseAmount",
                    nullable: true,

                    fields: {
                        total: {
                            type: "Float",
                            keyRaw: "total",
                            nullable: true
                        },

                        discount: {
                            type: "Float",
                            keyRaw: "discount",
                            nullable: true
                        },

                        totalDiscount: {
                            type: "Float",
                            keyRaw: "totalDiscount",
                            nullable: true
                        },

                        subtotal: {
                            type: "Float",
                            keyRaw: "subtotal",
                            nullable: true
                        }
                    }
                },

                user: {
                    type: "User",
                    keyRaw: "user",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        },

                        firstName: {
                            type: "String",
                            keyRaw: "firstName",
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
                        }
                    }
                },

                slot: {
                    type: "Slot",
                    keyRaw: "slot",
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

                        info: {
                            type: "String",
                            keyRaw: "info",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
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
                },

                vendorBusinessName: {
                    type: "String",
                    keyRaw: "vendorBusinessName",
                    nullable: true
                },

                vendorPhone: {
                    type: "String",
                    keyRaw: "vendorPhone",
                    nullable: true
                },

                vendorEmail: {
                    type: "String",
                    keyRaw: "vendorEmail",
                    nullable: true
                },

                vendorCommissionType: {
                    type: "String",
                    keyRaw: "vendorCommissionType",
                    nullable: true
                },

                vendorCommissionValue: {
                    type: "Float",
                    keyRaw: "vendorCommissionValue",
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

                formattedSubtotal: {
                    type: "String",
                    keyRaw: "formattedSubtotal",
                    nullable: true
                },

                formattedShippingCharge: {
                    type: "String",
                    keyRaw: "formattedShippingCharge",
                    nullable: true
                },

                formattedMrp: {
                    type: "String",
                    keyRaw: "formattedMrp",
                    nullable: true
                },

                formattedAmountRefunded: {
                    type: "String",
                    keyRaw: "formattedAmountRefunded",
                    nullable: true
                },

                formattedPrice: {
                    type: "String",
                    keyRaw: "formattedPrice",
                    nullable: true
                },

                formattedTax: {
                    type: "String",
                    keyRaw: "formattedTax",
                    nullable: true
                },

                formattedTotal: {
                    type: "String",
                    keyRaw: "formattedTotal",
                    nullable: true
                },

                formattedTotalDiscount: {
                    type: "String",
                    keyRaw: "formattedTotalDiscount",
                    nullable: true
                },

                formattedVendorCommission: {
                    type: "String",
                    keyRaw: "formattedVendorCommission",
                    nullable: true
                },

                formattedAmountDue: {
                    type: "String",
                    keyRaw: "formattedAmountDue",
                    nullable: true
                },

                formattedAmountPaid: {
                    type: "String",
                    keyRaw: "formattedAmountPaid",
                    nullable: true
                },

                formattedCodPaid: {
                    type: "String",
                    keyRaw: "formattedCodPaid",
                    nullable: true
                },

                formattedDiscount: {
                    type: "String",
                    keyRaw: "formattedDiscount",
                    nullable: true
                },

                formattedPaymentAmount: {
                    type: "String",
                    keyRaw: "formattedPaymentAmount",
                    nullable: true
                },

                formattedTotalAmountRefunded: {
                    type: "String",
                    keyRaw: "formattedTotalAmountRefunded",
                    nullable: true
                },

                formattedAmount: {
                    type: "OrderItemAmount",
                    keyRaw: "formattedAmount",
                    nullable: true,

                    fields: {
                        subtotal: {
                            type: "String",
                            keyRaw: "subtotal",
                            nullable: true
                        },

                        tax: {
                            type: "String",
                            keyRaw: "tax",
                            nullable: true
                        },

                        discount: {
                            type: "String",
                            keyRaw: "discount",
                            nullable: true
                        },

                        shipping: {
                            type: "String",
                            keyRaw: "shipping",
                            nullable: true
                        },

                        total: {
                            type: "String",
                            keyRaw: "total",
                            nullable: true
                        },

                        totalDiscount: {
                            type: "String",
                            keyRaw: "totalDiscount",
                            nullable: true
                        },

                        exchangeRate: {
                            type: "String",
                            keyRaw: "exchangeRate",
                            nullable: true
                        }
                    }
                },

                orderHistory: {
                    type: "OrderHistory",
                    keyRaw: "orderHistory",
                    nullable: true,

                    fields: {
                        id: {
                            type: "String",
                            keyRaw: "id",
                            nullable: true
                        },

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
                        }
                    }
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

"HoudiniHash=1d5cc79e6a7326dc214e7c7637d5b3cfa7fcf5d78eebe13957c78dca03596adb";