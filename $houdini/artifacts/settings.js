export default {
    name: "settings",
    kind: "HoudiniQuery",
    hash: "442a5f312fc2bde5baaed7ab73c2cd3aee9674e4a44b3c9d3a098f14c62586ae",

    raw: `query settings {
  settings {
    id
    websiteName
    websiteLegalName
    liveCommerce
    multilingual
    closed
    closedMessage
    minimumOrderValue
    title
    alert
    keywords
    description
    tax {
      cgst
      sgst
      igst
    }
    demo
    RAZORPAY_KEY_ID
    GOOGLE_CLIENT_ID
    stripePublishableKey
    brainTreePublicKey
    enableStripe
    enableSubsription
    enableRazorpay
    currencyCode
    currencySymbol
    currencyDecimals
    openGraphImage
    shipping {
      deliveryDays
      charge
      free
      method
      enabled
      provider
    }
    userRoles
    websiteEmail
    shopPhone
    shopAddress
    country
    countryDetails {
      id
      name
      value
      dialCode
      code
      img
      imgCdn
      flag
      lang
      active
    }
    currency
    currencyDetails {
      id
      isoCode
      name
      symbol
    }
    lang
    langDetails {
      id
      name
      nativeName
      code
    }
    logo
    logoMobile
    logoDark
    logoMobileDark
    favicon
    CDN_URL
    S3_URL
    LIVE_COMMERCE_URL
    searchbarText
    pageSize
    returnReasons
    orderStatuses {
      status
      title
      body
      icon
      public
      index
    }
    paymentStatuses
    paymentMethods {
      active
      name
      value
      img
      color
      position
      text
      id
    }
    otpLogin
    sms {
      AUTO_VERIFICATION_ID
      enabled
      provider
    }
    email {
      enabled
      from
      cc
      bcc
      printers
    }
    storage {
      enabled
      provider
    }
    review {
      enabled
      moderate
    }
    product {
      moderate
    }
    customerOrderNotifications {
      orderConfirmation
      orderStatusChanged
      orderShipped
      orderIsReadyForPickup
      downloadEGoods
      giftCardPurchased
    }
    adminNotifications {
      newOrderPlaced
      lowStockNotification
    }
    ADMIN_PANEL_LINK
    DOCS_LINK
    storageProvider
    googleMapsApi
    facebook
    twitter
    google
    instagram
    linkedin
    enableTax
    locationExpiry
    WWW_URL
    referralBonus
    joiningBonus
    isMultiVendor
    isMultiStore
    isMegamenu
    isSaas
    isSearch
    foodTypes {
      name
      val
      img
    }
  }
}
`,

    rootType: "Query",

    selection: {
        settings: {
            type: "Setting",
            keyRaw: "settings",
            nullable: true,

            fields: {
                id: {
                    type: "String",
                    keyRaw: "id",
                    nullable: true
                },

                websiteName: {
                    type: "String",
                    keyRaw: "websiteName",
                    nullable: true
                },

                websiteLegalName: {
                    type: "String",
                    keyRaw: "websiteLegalName",
                    nullable: true
                },

                liveCommerce: {
                    type: "Boolean",
                    keyRaw: "liveCommerce",
                    nullable: true
                },

                multilingual: {
                    type: "Boolean",
                    keyRaw: "multilingual",
                    nullable: true
                },

                closed: {
                    type: "Boolean",
                    keyRaw: "closed",
                    nullable: true
                },

                closedMessage: {
                    type: "String",
                    keyRaw: "closedMessage",
                    nullable: true
                },

                minimumOrderValue: {
                    type: "Int",
                    keyRaw: "minimumOrderValue",
                    nullable: true
                },

                title: {
                    type: "String",
                    keyRaw: "title",
                    nullable: true
                },

                alert: {
                    type: "String",
                    keyRaw: "alert",
                    nullable: true
                },

                keywords: {
                    type: "String",
                    keyRaw: "keywords",
                    nullable: true
                },

                description: {
                    type: "String",
                    keyRaw: "description",
                    nullable: true
                },

                tax: {
                    type: "Tax",
                    keyRaw: "tax",
                    nullable: true,

                    fields: {
                        cgst: {
                            type: "Float",
                            keyRaw: "cgst",
                            nullable: true
                        },

                        sgst: {
                            type: "Float",
                            keyRaw: "sgst",
                            nullable: true
                        },

                        igst: {
                            type: "Float",
                            keyRaw: "igst",
                            nullable: true
                        }
                    }
                },

                demo: {
                    type: "Boolean",
                    keyRaw: "demo",
                    nullable: true
                },

                RAZORPAY_KEY_ID: {
                    type: "String",
                    keyRaw: "RAZORPAY_KEY_ID",
                    nullable: true
                },

                GOOGLE_CLIENT_ID: {
                    type: "String",
                    keyRaw: "GOOGLE_CLIENT_ID",
                    nullable: true
                },

                stripePublishableKey: {
                    type: "String",
                    keyRaw: "stripePublishableKey",
                    nullable: true
                },

                brainTreePublicKey: {
                    type: "String",
                    keyRaw: "brainTreePublicKey",
                    nullable: true
                },

                enableStripe: {
                    type: "Boolean",
                    keyRaw: "enableStripe",
                    nullable: true
                },

                enableSubsription: {
                    type: "Boolean",
                    keyRaw: "enableSubsription",
                    nullable: true
                },

                enableRazorpay: {
                    type: "Boolean",
                    keyRaw: "enableRazorpay",
                    nullable: true
                },

                currencyCode: {
                    type: "String",
                    keyRaw: "currencyCode",
                    nullable: true
                },

                currencySymbol: {
                    type: "String",
                    keyRaw: "currencySymbol",
                    nullable: true
                },

                currencyDecimals: {
                    type: "Int",
                    keyRaw: "currencyDecimals",
                    nullable: true
                },

                openGraphImage: {
                    type: "String",
                    keyRaw: "openGraphImage",
                    nullable: true
                },

                shipping: {
                    type: "Shipping",
                    keyRaw: "shipping",
                    nullable: true,

                    fields: {
                        deliveryDays: {
                            type: "Int",
                            keyRaw: "deliveryDays",
                            nullable: true
                        },

                        charge: {
                            type: "Int",
                            keyRaw: "charge",
                            nullable: true
                        },

                        free: {
                            type: "Int",
                            keyRaw: "free",
                            nullable: true
                        },

                        method: {
                            type: "String",
                            keyRaw: "method",
                            nullable: true
                        },

                        enabled: {
                            type: "Boolean",
                            keyRaw: "enabled",
                            nullable: true
                        },

                        provider: {
                            type: "String",
                            keyRaw: "provider",
                            nullable: true
                        }
                    }
                },

                userRoles: {
                    type: "String",
                    keyRaw: "userRoles",
                    nullable: true
                },

                websiteEmail: {
                    type: "String",
                    keyRaw: "websiteEmail",
                    nullable: true
                },

                shopPhone: {
                    type: "String",
                    keyRaw: "shopPhone",
                    nullable: true
                },

                shopAddress: {
                    type: "String",
                    keyRaw: "shopAddress",
                    nullable: true
                },

                country: {
                    type: "ID",
                    keyRaw: "country",
                    nullable: true
                },

                countryDetails: {
                    type: "Country",
                    keyRaw: "countryDetails",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id"
                        },

                        name: {
                            type: "String",
                            keyRaw: "name"
                        },

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        },

                        dialCode: {
                            type: "String",
                            keyRaw: "dialCode",
                            nullable: true
                        },

                        code: {
                            type: "String",
                            keyRaw: "code",
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

                        flag: {
                            type: "String",
                            keyRaw: "flag",
                            nullable: true
                        },

                        lang: {
                            type: "String",
                            keyRaw: "lang",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        }
                    }
                },

                currency: {
                    type: "ID",
                    keyRaw: "currency",
                    nullable: true
                },

                currencyDetails: {
                    type: "Currency",
                    keyRaw: "currencyDetails",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        },

                        isoCode: {
                            type: "String",
                            keyRaw: "isoCode",
                            nullable: true
                        },

                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        symbol: {
                            type: "String",
                            keyRaw: "symbol",
                            nullable: true
                        }
                    }
                },

                lang: {
                    type: "ID",
                    keyRaw: "lang",
                    nullable: true
                },

                langDetails: {
                    type: "Language",
                    keyRaw: "langDetails",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        },

                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        nativeName: {
                            type: "String",
                            keyRaw: "nativeName",
                            nullable: true
                        },

                        code: {
                            type: "String",
                            keyRaw: "code",
                            nullable: true
                        }
                    }
                },

                logo: {
                    type: "String",
                    keyRaw: "logo",
                    nullable: true
                },

                logoMobile: {
                    type: "String",
                    keyRaw: "logoMobile",
                    nullable: true
                },

                logoDark: {
                    type: "String",
                    keyRaw: "logoDark",
                    nullable: true
                },

                logoMobileDark: {
                    type: "String",
                    keyRaw: "logoMobileDark",
                    nullable: true
                },

                favicon: {
                    type: "String",
                    keyRaw: "favicon",
                    nullable: true
                },

                CDN_URL: {
                    type: "String",
                    keyRaw: "CDN_URL",
                    nullable: true
                },

                S3_URL: {
                    type: "String",
                    keyRaw: "S3_URL",
                    nullable: true
                },

                LIVE_COMMERCE_URL: {
                    type: "String",
                    keyRaw: "LIVE_COMMERCE_URL",
                    nullable: true
                },

                searchbarText: {
                    type: "String",
                    keyRaw: "searchbarText",
                    nullable: true
                },

                pageSize: {
                    type: "Int",
                    keyRaw: "pageSize",
                    nullable: true
                },

                returnReasons: {
                    type: "String",
                    keyRaw: "returnReasons",
                    nullable: true
                },

                orderStatuses: {
                    type: "OrderStatus",
                    keyRaw: "orderStatuses",
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
                        }
                    }
                },

                paymentStatuses: {
                    type: "String",
                    keyRaw: "paymentStatuses",
                    nullable: true
                },

                paymentMethods: {
                    type: "PaymentMethod",
                    keyRaw: "paymentMethods",
                    nullable: true,

                    fields: {
                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        },

                        name: {
                            type: "String",
                            keyRaw: "name"
                        },

                        value: {
                            type: "String",
                            keyRaw: "value",
                            nullable: true
                        },

                        img: {
                            type: "String",
                            keyRaw: "img",
                            nullable: true
                        },

                        color: {
                            type: "String",
                            keyRaw: "color",
                            nullable: true
                        },

                        position: {
                            type: "Int",
                            keyRaw: "position",
                            nullable: true
                        },

                        text: {
                            type: "String",
                            keyRaw: "text",
                            nullable: true
                        },

                        id: {
                            type: "String",
                            keyRaw: "id"
                        }
                    }
                },

                otpLogin: {
                    type: "Boolean",
                    keyRaw: "otpLogin",
                    nullable: true
                },

                sms: {
                    type: "Sms",
                    keyRaw: "sms",
                    nullable: true,

                    fields: {
                        AUTO_VERIFICATION_ID: {
                            type: "String",
                            keyRaw: "AUTO_VERIFICATION_ID",
                            nullable: true
                        },

                        enabled: {
                            type: "Boolean",
                            keyRaw: "enabled",
                            nullable: true
                        },

                        provider: {
                            type: "String",
                            keyRaw: "provider",
                            nullable: true
                        }
                    }
                },

                email: {
                    type: "Email",
                    keyRaw: "email",
                    nullable: true,

                    fields: {
                        enabled: {
                            type: "Boolean",
                            keyRaw: "enabled",
                            nullable: true
                        },

                        from: {
                            type: "String",
                            keyRaw: "from",
                            nullable: true
                        },

                        cc: {
                            type: "String",
                            keyRaw: "cc",
                            nullable: true
                        },

                        bcc: {
                            type: "String",
                            keyRaw: "bcc",
                            nullable: true
                        },

                        printers: {
                            type: "String",
                            keyRaw: "printers",
                            nullable: true
                        }
                    }
                },

                storage: {
                    type: "Storage",
                    keyRaw: "storage",
                    nullable: true,

                    fields: {
                        enabled: {
                            type: "Boolean",
                            keyRaw: "enabled",
                            nullable: true
                        },

                        provider: {
                            type: "String",
                            keyRaw: "provider",
                            nullable: true
                        }
                    }
                },

                review: {
                    type: "ReviewSetting",
                    keyRaw: "review",
                    nullable: true,

                    fields: {
                        enabled: {
                            type: "Boolean",
                            keyRaw: "enabled",
                            nullable: true
                        },

                        moderate: {
                            type: "Boolean",
                            keyRaw: "moderate",
                            nullable: true
                        }
                    }
                },

                product: {
                    type: "ProductSetting",
                    keyRaw: "product",
                    nullable: true,

                    fields: {
                        moderate: {
                            type: "Boolean",
                            keyRaw: "moderate",
                            nullable: true
                        }
                    }
                },

                customerOrderNotifications: {
                    type: "UserNotification",
                    keyRaw: "customerOrderNotifications",
                    nullable: true,

                    fields: {
                        orderConfirmation: {
                            type: "Boolean",
                            keyRaw: "orderConfirmation",
                            nullable: true
                        },

                        orderStatusChanged: {
                            type: "Boolean",
                            keyRaw: "orderStatusChanged",
                            nullable: true
                        },

                        orderShipped: {
                            type: "Boolean",
                            keyRaw: "orderShipped",
                            nullable: true
                        },

                        orderIsReadyForPickup: {
                            type: "Boolean",
                            keyRaw: "orderIsReadyForPickup",
                            nullable: true
                        },

                        downloadEGoods: {
                            type: "Boolean",
                            keyRaw: "downloadEGoods",
                            nullable: true
                        },

                        giftCardPurchased: {
                            type: "Boolean",
                            keyRaw: "giftCardPurchased",
                            nullable: true
                        }
                    }
                },

                adminNotifications: {
                    type: "AdminNotification",
                    keyRaw: "adminNotifications",
                    nullable: true,

                    fields: {
                        newOrderPlaced: {
                            type: "Boolean",
                            keyRaw: "newOrderPlaced",
                            nullable: true
                        },

                        lowStockNotification: {
                            type: "Boolean",
                            keyRaw: "lowStockNotification",
                            nullable: true
                        }
                    }
                },

                ADMIN_PANEL_LINK: {
                    type: "String",
                    keyRaw: "ADMIN_PANEL_LINK",
                    nullable: true
                },

                DOCS_LINK: {
                    type: "String",
                    keyRaw: "DOCS_LINK",
                    nullable: true
                },

                storageProvider: {
                    type: "String",
                    keyRaw: "storageProvider",
                    nullable: true
                },

                googleMapsApi: {
                    type: "String",
                    keyRaw: "googleMapsApi",
                    nullable: true
                },

                facebook: {
                    type: "String",
                    keyRaw: "facebook",
                    nullable: true
                },

                twitter: {
                    type: "String",
                    keyRaw: "twitter",
                    nullable: true
                },

                google: {
                    type: "String",
                    keyRaw: "google",
                    nullable: true
                },

                instagram: {
                    type: "String",
                    keyRaw: "instagram",
                    nullable: true
                },

                linkedin: {
                    type: "String",
                    keyRaw: "linkedin",
                    nullable: true
                },

                enableTax: {
                    type: "Boolean",
                    keyRaw: "enableTax",
                    nullable: true
                },

                locationExpiry: {
                    type: "Float",
                    keyRaw: "locationExpiry",
                    nullable: true
                },

                WWW_URL: {
                    type: "String",
                    keyRaw: "WWW_URL",
                    nullable: true
                },

                referralBonus: {
                    type: "Float",
                    keyRaw: "referralBonus",
                    nullable: true
                },

                joiningBonus: {
                    type: "Float",
                    keyRaw: "joiningBonus",
                    nullable: true
                },

                isMultiVendor: {
                    type: "Boolean",
                    keyRaw: "isMultiVendor",
                    nullable: true
                },

                isMultiStore: {
                    type: "Boolean",
                    keyRaw: "isMultiStore",
                    nullable: true
                },

                isMegamenu: {
                    type: "Boolean",
                    keyRaw: "isMegamenu",
                    nullable: true
                },

                isSaas: {
                    type: "Boolean",
                    keyRaw: "isSaas",
                    nullable: true
                },

                isSearch: {
                    type: "Boolean",
                    keyRaw: "isSearch",
                    nullable: true
                },

                foodTypes: {
                    type: "NameValImg",
                    keyRaw: "foodTypes",
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

                        img: {
                            type: "String",
                            keyRaw: "img",
                            nullable: true
                        }
                    }
                }
            }
        }
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=51c10ac22b09a423d4ef07f0bd88b27800cc08a54626306ec0f7f91a998c20ea";