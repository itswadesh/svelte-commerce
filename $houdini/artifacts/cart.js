export default {
    name: "cart",
    kind: "HoudiniQuery",
    hash: "68be12c9f09b85dfabbed320c5917132ed53046fdec70e2e947dafc11def4662",

    raw: `query cart($store: ID) {
  cart(store: $store) {
    id
    storeCurrency
    currencyCode
    currencyName
    currencySymbol
    needAddress
    items {
      pid
      barcode
      tax
      name
      type
      slug
      qty
      price
      mrp
      shippingCharge
      img
      imgCdn
      tracking
      brandName
      vendor
      vendorSlug
      vendorBusinessName
      deliveryDetails
      foodType
      usedOptions {
        name
        val
        dates
      }
      options {
        option
        values
      }
      formattedItemAmount {
        mrp
        price
        tax
        shippingCharge
      }
    }
    qty
    tax
    subtotal
    total
    discount {
      code
      value
      text
      amount
    }
    shipping {
      charge
    }
    formattedAmount {
      offer_total
      tax
      subtotal
      total
    }
    unavailableItems {
      status
      msg
      pid
      barcode
      tax
      name
      type
      slug
      qty
      price
      mrp
      shippingCharge
      img
      imgCdn
      tracking
      brandName
      vendor
      vendorSlug
      vendorBusinessName
      deliveryDetails
      foodType
      usedOptions {
        name
        val
        dates
      }
      options {
        option
        values
      }
    }
  }
}
`,

    rootType: "Query",

    selection: {
        cart: {
            type: "Cart",
            keyRaw: "cart(store: $store)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id",
                    nullable: true
                },

                storeCurrency: {
                    type: "ID",
                    keyRaw: "storeCurrency",
                    nullable: true
                },

                currencyCode: {
                    type: "String",
                    keyRaw: "currencyCode",
                    nullable: true
                },

                currencyName: {
                    type: "String",
                    keyRaw: "currencyName",
                    nullable: true
                },

                currencySymbol: {
                    type: "String",
                    keyRaw: "currencySymbol",
                    nullable: true
                },

                needAddress: {
                    type: "Boolean",
                    keyRaw: "needAddress",
                    nullable: true
                },

                items: {
                    type: "CartItem",
                    keyRaw: "items",
                    nullable: true,

                    fields: {
                        pid: {
                            type: "ID",
                            keyRaw: "pid",
                            nullable: true
                        },

                        barcode: {
                            type: "String",
                            keyRaw: "barcode",
                            nullable: true
                        },

                        tax: {
                            type: "Float",
                            keyRaw: "tax",
                            nullable: true
                        },

                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        type: {
                            type: "String",
                            keyRaw: "type",
                            nullable: true
                        },

                        slug: {
                            type: "String",
                            keyRaw: "slug",
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

                        shippingCharge: {
                            type: "Float",
                            keyRaw: "shippingCharge",
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

                        brandName: {
                            type: "String",
                            keyRaw: "brandName",
                            nullable: true
                        },

                        vendor: {
                            type: "ID",
                            keyRaw: "vendor",
                            nullable: true
                        },

                        vendorSlug: {
                            type: "String",
                            keyRaw: "vendorSlug",
                            nullable: true
                        },

                        vendorBusinessName: {
                            type: "String",
                            keyRaw: "vendorBusinessName",
                            nullable: true
                        },

                        deliveryDetails: {
                            type: "String",
                            keyRaw: "deliveryDetails",
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
                        },

                        options: {
                            type: "Option1",
                            keyRaw: "options",
                            nullable: true,

                            fields: {
                                option: {
                                    type: "ID",
                                    keyRaw: "option",
                                    nullable: true
                                },

                                values: {
                                    type: "String",
                                    keyRaw: "values",
                                    nullable: true
                                }
                            }
                        },

                        formattedItemAmount: {
                            type: "CartItemAmount",
                            keyRaw: "formattedItemAmount",
                            nullable: true,

                            fields: {
                                mrp: {
                                    type: "String",
                                    keyRaw: "mrp",
                                    nullable: true
                                },

                                price: {
                                    type: "String",
                                    keyRaw: "price",
                                    nullable: true
                                },

                                tax: {
                                    type: "String",
                                    keyRaw: "tax",
                                    nullable: true
                                },

                                shippingCharge: {
                                    type: "String",
                                    keyRaw: "shippingCharge",
                                    nullable: true
                                }
                            }
                        }
                    }
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

                discount: {
                    type: "CartDiscount",
                    keyRaw: "discount",
                    nullable: true,

                    fields: {
                        code: {
                            type: "String",
                            keyRaw: "code",
                            nullable: true
                        },

                        value: {
                            type: "Float",
                            keyRaw: "value",
                            nullable: true
                        },

                        text: {
                            type: "String",
                            keyRaw: "text",
                            nullable: true
                        },

                        amount: {
                            type: "Float",
                            keyRaw: "amount",
                            nullable: true
                        }
                    }
                },

                shipping: {
                    type: "Shipping",
                    keyRaw: "shipping",
                    nullable: true,

                    fields: {
                        charge: {
                            type: "Int",
                            keyRaw: "charge",
                            nullable: true
                        }
                    }
                },

                formattedAmount: {
                    type: "CartAmount",
                    keyRaw: "formattedAmount",
                    nullable: true,

                    fields: {
                        offer_total: {
                            type: "String",
                            keyRaw: "offer_total",
                            nullable: true
                        },

                        tax: {
                            type: "String",
                            keyRaw: "tax",
                            nullable: true
                        },

                        subtotal: {
                            type: "String",
                            keyRaw: "subtotal",
                            nullable: true
                        },

                        total: {
                            type: "String",
                            keyRaw: "total",
                            nullable: true
                        }
                    }
                },

                unavailableItems: {
                    type: "CartItem",
                    keyRaw: "unavailableItems",
                    nullable: true,

                    fields: {
                        status: {
                            type: "String",
                            keyRaw: "status",
                            nullable: true
                        },

                        msg: {
                            type: "String",
                            keyRaw: "msg",
                            nullable: true
                        },

                        pid: {
                            type: "ID",
                            keyRaw: "pid",
                            nullable: true
                        },

                        barcode: {
                            type: "String",
                            keyRaw: "barcode",
                            nullable: true
                        },

                        tax: {
                            type: "Float",
                            keyRaw: "tax",
                            nullable: true
                        },

                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        type: {
                            type: "String",
                            keyRaw: "type",
                            nullable: true
                        },

                        slug: {
                            type: "String",
                            keyRaw: "slug",
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

                        shippingCharge: {
                            type: "Float",
                            keyRaw: "shippingCharge",
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

                        brandName: {
                            type: "String",
                            keyRaw: "brandName",
                            nullable: true
                        },

                        vendor: {
                            type: "ID",
                            keyRaw: "vendor",
                            nullable: true
                        },

                        vendorSlug: {
                            type: "String",
                            keyRaw: "vendorSlug",
                            nullable: true
                        },

                        vendorBusinessName: {
                            type: "String",
                            keyRaw: "vendorBusinessName",
                            nullable: true
                        },

                        deliveryDetails: {
                            type: "String",
                            keyRaw: "deliveryDetails",
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
                        },

                        options: {
                            type: "Option1",
                            keyRaw: "options",
                            nullable: true,

                            fields: {
                                option: {
                                    type: "ID",
                                    keyRaw: "option",
                                    nullable: true
                                },

                                values: {
                                    type: "String",
                                    keyRaw: "values",
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
            store: "ID"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=b23d30b5aaa2e234ba36e1a5cf9064f2ec3ea2d9c1d3e5bd54eeda74f41877c7";