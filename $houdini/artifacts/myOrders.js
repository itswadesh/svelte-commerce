export default {
    name: "myOrders",
    kind: "HoudiniQuery",
    hash: "74029de636903d6dee7566f04968067655473f1511a194f3e83b8d268f61903d",

    raw: `query myOrders($page: Int, $skip: Int, $limit: Int, $search: String, $sort: String, $status: String, $where: String, $store: ID) {
  myOrders(
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
      paySuccess
      orderNo
      otp
      createdAt
      updatedAt
      codPaid
      payment {
        id
        amountPaid
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
      store {
        id
        name
        email
      }
      items {
        id
        pid
        status
        posInvoiceNo
        itemOrderNo
        name
        barcode
        img
        imgCdn
        foodType
        slug
        price
        qty
        shippingCharge
        subtotal
        total
        tax
        time
        brandName
        brandImg
        brandImgCdn
        vendorBusinessName
        vendor {
          id
          slug
          businessName
          banner
          bannerCdn
        }
        orderStatus {
          id
          event
          tracking_id
          courier_name
        }
      }
      orderItems {
        id
        status
        pid
        posInvoiceNo
        itemOrderNo
        name
        slug
        img
        imgCdn
        qty
        price
        mrp
        color
        size
        tracking
        shippingCharge
        tax
        subtotal
        total
        brandName
        brandImg
        brandImgCdn
        foodType
        usedOptions {
          name
          val
          dates
        }
      }
    }
  }
}
`,

    rootType: "Query",

    selection: {
        myOrders: {
            type: "orderRes",
            keyRaw: "myOrders(page: $page, skip: $skip, limit: $limit, search: $search, sort: $sort, status: $status, where: $where, store: $store)",
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
                    type: "Order",
                    keyRaw: "data",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        },

                        paySuccess: {
                            type: "Int",
                            keyRaw: "paySuccess",
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

                        codPaid: {
                            type: "Float",
                            keyRaw: "codPaid",
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
                                },

                                amountPaid: {
                                    type: "Float",
                                    keyRaw: "amountPaid",
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

                                foodType: {
                                    type: "String",
                                    keyRaw: "foodType",
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

                                subtotal: {
                                    type: "Float",
                                    keyRaw: "subtotal",
                                    nullable: true
                                },

                                total: {
                                    type: "Float",
                                    keyRaw: "total",
                                    nullable: true
                                },

                                tax: {
                                    type: "Float",
                                    keyRaw: "tax",
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

                                orderStatus: {
                                    type: "OrderStatusRes",
                                    keyRaw: "orderStatus",
                                    nullable: true,

                                    fields: {
                                        id: {
                                            type: "ID",
                                            keyRaw: "id"
                                        },

                                        event: {
                                            type: "String",
                                            keyRaw: "event",
                                            nullable: true
                                        },

                                        tracking_id: {
                                            type: "String",
                                            keyRaw: "tracking_id",
                                            nullable: true
                                        },

                                        courier_name: {
                                            type: "String",
                                            keyRaw: "courier_name",
                                            nullable: true
                                        }
                                    }
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

                                qty: {
                                    type: "Int",
                                    keyRaw: "qty",
                                    nullable: true
                                },

                                price: {
                                    type: "Float",
                                    keyRaw: "price",
                                    nullable: true
                                },

                                mrp: {
                                    type: "Float",
                                    keyRaw: "mrp",
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

                                tax: {
                                    type: "Float",
                                    keyRaw: "tax",
                                    nullable: true
                                },

                                subtotal: {
                                    type: "Float",
                                    keyRaw: "subtotal",
                                    nullable: true
                                },

                                total: {
                                    type: "Float",
                                    keyRaw: "total",
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

                                foodType: {
                                    type: "String",
                                    keyRaw: "foodType",
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

"HoudiniHash=b8fb0405af4d4df7fbd888a5d4c116854330dca820c38eba735f2a60cdd2520c";