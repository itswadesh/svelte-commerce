export default {
    name: "myOrderItems",
    kind: "HoudiniQuery",
    hash: "b30a51e01798bc645fdd62478d093ade705fa22a33981bbaefbf788056d38d64",

    raw: `query myOrderItems($page: Int, $skip: Int, $limit: Int, $search: String, $sort: String, $status: String, $where: String, $store: ID) {
  myOrderItems(
    page: $page
    skip: $skip
    limit: $limit
    search: $search
    sort: $sort
    status: $status
    where: $where
    store: $store
  ) {
    count
    pageSize
    page
    data {
      id
      status
      isReplacement
      pid
      usedOptions {
        name
        val
        dates
      }
      posInvoiceNo
      itemOrderNo
      name
      slug
      img
      imgCdn
      foodType
      tracking
      shippingCharge
      price
      qty
      tax
      brandName
      brandImg
      brandImgCdn
      size
      color
      trackingId
      returnTrackingId
      courierName
      returnCourierName
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
      amountPaid
      amountDue
      paymentMsg
      paymentTime
      paid
      userFirstName
      userLastName
      userPhone
      invoiceLink
      returnValidTill
      paymentMode
      paymentAmount
      vendorBusinessName
      vendor {
        id
        slug
        businessName
        banner
        bannerCdn
      }
      user {
        firstName
        lastName
        email
        phone
        role
        id
      }
      address {
        firstName
        lastName
        address
        lat
        lng
        id
      }
      amount {
        qty
        subtotal
        tax
        discount
        total
        shipping
      }
      payment {
        amountPaid
        amountDue
        id
      }
      store {
        id
        name
        email
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
}
`,

    rootType: "Query",

    selection: {
        myOrderItems: {
            type: "orderItemRes",
            keyRaw: "myOrderItems(page: $page, skip: $skip, limit: $limit, search: $search, sort: $sort, status: $status, where: $where, store: $store)",
            nullable: true,

            fields: {
                count: {
                    type: "Int",
                    keyRaw: "count",
                    nullable: true
                },

                pageSize: {
                    type: "Int",
                    keyRaw: "pageSize",
                    nullable: true
                },

                page: {
                    type: "Int",
                    keyRaw: "page",
                    nullable: true
                },

                data: {
                    type: "OrderItem",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        },

                        status: {
                            type: "String",
                            keyRaw: "status",
                            nullable: true
                        },

                        isReplacement: {
                            type: "Boolean",
                            keyRaw: "isReplacement",
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

                        foodType: {
                            type: "String",
                            keyRaw: "foodType",
                            nullable: true
                        },

                        tracking: {
                            type: "String",
                            keyRaw: "tracking",
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

                        invoiceLink: {
                            type: "String",
                            keyRaw: "invoiceLink",
                            nullable: true
                        },

                        returnValidTill: {
                            type: "String",
                            keyRaw: "returnValidTill",
                            nullable: true
                        },

                        paymentAmount: {
                            type: "Float",
                            keyRaw: "paymentAmount",
                            nullable: true
                        },

                        vendorBusinessName: {
                            type: "String",
                            keyRaw: "vendorBusinessName",
                            nullable: true
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

                        user: {
                            type: "User",
                            keyRaw: "user",
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

                                email: {
                                    type: "String",
                                    keyRaw: "email",
                                    nullable: true
                                },

                                phone: {
                                    type: "String",
                                    keyRaw: "phone",
                                    nullable: true
                                },

                                role: {
                                    type: "String",
                                    keyRaw: "role",
                                    nullable: true
                                },

                                id: {
                                    type: "ID",
                                    keyRaw: "id",
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
            }
        }
    },

    input: {
        fields: {
            page: "Int",
            skip: "Int",
            limit: "Int",
            search: "String",
            sort: "String",
            status: "String",
            where: "String",
            store: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=9f3a10c8bef5e083a7665a7b9351aa43322d6b8ac5f05461422c151ba0b2b9a0";