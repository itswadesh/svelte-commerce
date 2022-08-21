export default {
    name: "addToCart",
    kind: "HoudiniMutation",
    hash: "5924e4e1dcc851625a73b4779bfcde75476c64d55a43f8bc700b783246676f86",

    raw: `mutation addToCart($qty: Int!, $pid: ID!, $vid: ID, $options: [OptionIp1], $vendor: ID, $replace: Boolean) {
  addToCart(
    qty: $qty
    pid: $pid
    vid: $vid
    options: $options
    vendor: $vendor
    replace: $replace
  ) {
    items {
      pid
      vid
      barcode
      name
      type
      slug
      qty
      price
      shippingCharge
      tax
      img
      imgCdn
      brandName
      vendor
      vendorSlug
      vendorBusinessName
      deliveryDetails
      options {
        option
        values
      }
      usedOptions {
        name
        val
        dates
      }
    }
    needAddress
    qty
    subtotal
    discount {
      code
      value
      text
      amount
    }
    shipping {
      charge
    }
    tax
    total
    id
  }
}
`,

    rootType: "Mutation",

    selection: {
        addToCart: {
            type: "Cart",
            keyRaw: "addToCart(qty: $qty, pid: $pid, vid: $vid, options: $options, vendor: $vendor, replace: $replace)",
            nullable: true,

            fields: {
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

                        vid: {
                            type: "ID",
                            keyRaw: "vid",
                            nullable: true
                        },

                        barcode: {
                            type: "String",
                            keyRaw: "barcode",
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
                },

                needAddress: {
                    type: "Boolean",
                    keyRaw: "needAddress",
                    nullable: true
                },

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

                tax: {
                    type: "Float",
                    keyRaw: "tax",
                    nullable: true
                },

                total: {
                    type: "Float",
                    keyRaw: "total",
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
            qty: "Int",
            pid: "ID",
            vid: "ID",
            options: "OptionIp1",
            vendor: "ID",
            replace: "Boolean"
        },

        types: {
            OptionIp1: {
                option: "ID",
                values: "String"
            }
        }
    }
};

"HoudiniHash=3d3644624a08e75d1600394476a0638556fc021f728bbe3e916d587e2ce3a952";