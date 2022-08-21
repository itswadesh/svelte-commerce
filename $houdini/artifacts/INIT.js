export default {
    name: "INIT",
    kind: "HoudiniQuery",
    hash: "439e6a25b51a503e55fc992b3a3e30ac6a4266dc0555a94dbeb8c61bd7eaa1e0",

    raw: `query INIT($domain: String) {
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
    LIVE_COMMERCE_URL
    stripePublishableKey
    brainTreePublicKey
    enableStripe
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
    logo
    logoMobile
    logoDark
    logoMobileDark
    favicon
    CDN_URL
    S3_URL
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
  storeOne(domain: $domain) {
    id
    active
    featured
    adminNotifications {
      lowStockNotification
      newOrderPlaced
    }
    address
    alert
    analyticsTrackingId
    banners
    closed
    isWishlist
    isCart
    closedMessage
    customerOrderNotifications {
      downloadEGoods
      giftCardPurchased
      orderConfirmation
      orderIsReadyForPickup
      orderShipped
      orderStatusChanged
      orderConfirmationSms
    }
    vendorNotifications {
      orderConfirmationSms
    }
    description
    metaDescription
    dimentionUnit
    domain
    email
    facebook
    facebookPixelId
    facebookUrl
    favicon
    faviconCdn
    firstName
    freeShippingOn
    gdpr
    gdprCookieConsent
    google
    googleAdsTag
    homeMeta1
    homeMeta2
    homeMeta3
    homeMeta4
    img
    imgCdn
    images
    imagesCdn
    bankAccountNo
    bankAccountHolderName
    bankIfscCode
    bankSwiftCode
    instagram
    instagramUrl
    isHideNilStock
    isMegamenu
    isOpen
    isSearch
    isHyperlocal
    isFnb
    isWishlist
    isCart
    keywords
    lastName
    lat
    legalName
    linkedin
    lng
    locality
    logo
    logoDark
    logoMobile
    logoMobileDark
    logoCdn
    logoDarkCdn
    logoMobileCdn
    logoMobileDarkCdn
    minimumOrderValue
    minOrderValue
    name
    openGraphImage
    openGraphImageCdn
    pageSize
    phone
    pinterestTag
    pinterestUrl
    qrCode
    review {
      enabled
      moderate
    }
    searchbarText
    shipping {
      charge
      deliveryDays
      enabled
      free
      method
      provider
    }
    shippingCharge
    shopAddress
    shopPhone
    slug
    snapChatPixel
    state
    storeId
    timeZone
    timing
    title
    twitter
    twitterUrl
    websiteEmail
    websiteLegalName
    websiteName
    weightUnit
    youtubeUrl
    webmail
    zip
    timeDisplayFormat
    priceDisplayFormat
    createdAt
    updatedAt
    sms {
      AUTO_VERIFICATION_ID
    }
    shippoToken
    shipRocketEmail
    shipRocketPassword
    shipRocketChannelId
    pickrrAuthToken
    user {
      firstName
      lastName
      email
      phone
      id
    }
    storeCountry {
      id
      default
      active
      name
      code
      country {
        id
        name
        value
        dialCode
        code
        img
        imgCdn
        flag
        lang
      }
    }
    storeCurrency {
      id
      default
      active
      isoCode
      name
      symbol
      currency {
        id
        name
        sort
        isoCode
        isoNumericCode
        thousandsSeparator
        decimalMark
        symbolFirst
        active
        symbol
        disambiguateSymbol
        htmlEntity
        subUnit
        smallestDenomination
        subunitToUnit
      }
    }
    storeLanguage {
      id
      default
      active
      name
      code
      lang {
        id
        name
        nativeName
        code
        phpLocaleCode
        rtl
        sort
        active
      }
    }
  }
  megamenu(domain: $domain) {
    id
    name
    slug
    img
    featured
    children {
      name
      slug
      img
      featured
      children {
        name
        slug
        img
        featured
        children {
          name
          slug
          img
          featured
          children {
            name
            slug
            img
            featured
            children {
              name
              slug
              img
              featured
              children {
                name
                slug
                img
                featured
                children {
                  name
                  slug
                  img
                  featured
                  children {
                    name
                    slug
                    img
                    featured
                    children {
                      name
                      slug
                      img
                      featured
                      id
                    }
                    id
                  }
                  id
                }
                id
              }
              id
            }
            id
          }
          id
        }
        id
      }
      id
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

                LIVE_COMMERCE_URL: {
                    type: "String",
                    keyRaw: "LIVE_COMMERCE_URL",
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
        },

        storeOne: {
            type: "Store",
            keyRaw: "storeOne(domain: $domain)",
            nullable: true,

            fields: {
                id: {
                    type: "ID",
                    keyRaw: "id"
                },

                active: {
                    type: "Boolean",
                    keyRaw: "active",
                    nullable: true
                },

                featured: {
                    type: "Boolean",
                    keyRaw: "featured",
                    nullable: true
                },

                adminNotifications: {
                    type: "AdminNotification",
                    keyRaw: "adminNotifications",
                    nullable: true,

                    fields: {
                        lowStockNotification: {
                            type: "Boolean",
                            keyRaw: "lowStockNotification",
                            nullable: true
                        },

                        newOrderPlaced: {
                            type: "Boolean",
                            keyRaw: "newOrderPlaced",
                            nullable: true
                        }
                    }
                },

                address: {
                    type: "String",
                    keyRaw: "address",
                    nullable: true
                },

                alert: {
                    type: "String",
                    keyRaw: "alert",
                    nullable: true
                },

                analyticsTrackingId: {
                    type: "String",
                    keyRaw: "analyticsTrackingId",
                    nullable: true
                },

                banners: {
                    type: "String",
                    keyRaw: "banners",
                    nullable: true
                },

                closed: {
                    type: "Boolean",
                    keyRaw: "closed",
                    nullable: true
                },

                isWishlist: {
                    type: "Boolean",
                    keyRaw: "isWishlist",
                    nullable: true
                },

                isCart: {
                    type: "Boolean",
                    keyRaw: "isCart",
                    nullable: true
                },

                closedMessage: {
                    type: "String",
                    keyRaw: "closedMessage",
                    nullable: true
                },

                customerOrderNotifications: {
                    type: "UserNotification",
                    keyRaw: "customerOrderNotifications",
                    nullable: true,

                    fields: {
                        downloadEGoods: {
                            type: "Boolean",
                            keyRaw: "downloadEGoods",
                            nullable: true
                        },

                        giftCardPurchased: {
                            type: "Boolean",
                            keyRaw: "giftCardPurchased",
                            nullable: true
                        },

                        orderConfirmation: {
                            type: "Boolean",
                            keyRaw: "orderConfirmation",
                            nullable: true
                        },

                        orderIsReadyForPickup: {
                            type: "Boolean",
                            keyRaw: "orderIsReadyForPickup",
                            nullable: true
                        },

                        orderShipped: {
                            type: "Boolean",
                            keyRaw: "orderShipped",
                            nullable: true
                        },

                        orderStatusChanged: {
                            type: "Boolean",
                            keyRaw: "orderStatusChanged",
                            nullable: true
                        },

                        orderConfirmationSms: {
                            type: "Boolean",
                            keyRaw: "orderConfirmationSms",
                            nullable: true
                        }
                    }
                },

                vendorNotifications: {
                    type: "VendorNotification",
                    keyRaw: "vendorNotifications",
                    nullable: true,

                    fields: {
                        orderConfirmationSms: {
                            type: "Boolean",
                            keyRaw: "orderConfirmationSms",
                            nullable: true
                        }
                    }
                },

                description: {
                    type: "String",
                    keyRaw: "description",
                    nullable: true
                },

                metaDescription: {
                    type: "String",
                    keyRaw: "metaDescription",
                    nullable: true
                },

                dimentionUnit: {
                    type: "String",
                    keyRaw: "dimentionUnit",
                    nullable: true
                },

                domain: {
                    type: "String",
                    keyRaw: "domain",
                    nullable: true
                },

                email: {
                    type: "String",
                    keyRaw: "email",
                    nullable: true
                },

                facebook: {
                    type: "String",
                    keyRaw: "facebook",
                    nullable: true
                },

                facebookPixelId: {
                    type: "String",
                    keyRaw: "facebookPixelId",
                    nullable: true
                },

                facebookUrl: {
                    type: "String",
                    keyRaw: "facebookUrl",
                    nullable: true
                },

                favicon: {
                    type: "String",
                    keyRaw: "favicon",
                    nullable: true
                },

                faviconCdn: {
                    type: "String",
                    keyRaw: "faviconCdn",
                    nullable: true
                },

                firstName: {
                    type: "String",
                    keyRaw: "firstName",
                    nullable: true
                },

                freeShippingOn: {
                    type: "Float",
                    keyRaw: "freeShippingOn",
                    nullable: true
                },

                gdpr: {
                    type: "Boolean",
                    keyRaw: "gdpr",
                    nullable: true
                },

                gdprCookieConsent: {
                    type: "String",
                    keyRaw: "gdprCookieConsent",
                    nullable: true
                },

                google: {
                    type: "String",
                    keyRaw: "google",
                    nullable: true
                },

                googleAdsTag: {
                    type: "String",
                    keyRaw: "googleAdsTag",
                    nullable: true
                },

                homeMeta1: {
                    type: "String",
                    keyRaw: "homeMeta1",
                    nullable: true
                },

                homeMeta2: {
                    type: "String",
                    keyRaw: "homeMeta2",
                    nullable: true
                },

                homeMeta3: {
                    type: "String",
                    keyRaw: "homeMeta3",
                    nullable: true
                },

                homeMeta4: {
                    type: "String",
                    keyRaw: "homeMeta4",
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

                images: {
                    type: "String",
                    keyRaw: "images",
                    nullable: true
                },

                imagesCdn: {
                    type: "String",
                    keyRaw: "imagesCdn",
                    nullable: true
                },

                bankAccountNo: {
                    type: "String",
                    keyRaw: "bankAccountNo",
                    nullable: true
                },

                bankAccountHolderName: {
                    type: "String",
                    keyRaw: "bankAccountHolderName",
                    nullable: true
                },

                bankIfscCode: {
                    type: "String",
                    keyRaw: "bankIfscCode",
                    nullable: true
                },

                bankSwiftCode: {
                    type: "String",
                    keyRaw: "bankSwiftCode",
                    nullable: true
                },

                instagram: {
                    type: "String",
                    keyRaw: "instagram",
                    nullable: true
                },

                instagramUrl: {
                    type: "String",
                    keyRaw: "instagramUrl",
                    nullable: true
                },

                isHideNilStock: {
                    type: "Boolean",
                    keyRaw: "isHideNilStock",
                    nullable: true
                },

                isMegamenu: {
                    type: "Boolean",
                    keyRaw: "isMegamenu",
                    nullable: true
                },

                isOpen: {
                    type: "Boolean",
                    keyRaw: "isOpen",
                    nullable: true
                },

                isSearch: {
                    type: "Boolean",
                    keyRaw: "isSearch",
                    nullable: true
                },

                isHyperlocal: {
                    type: "Boolean",
                    keyRaw: "isHyperlocal",
                    nullable: true
                },

                isFnb: {
                    type: "Boolean",
                    keyRaw: "isFnb",
                    nullable: true
                },

                keywords: {
                    type: "String",
                    keyRaw: "keywords",
                    nullable: true
                },

                lastName: {
                    type: "String",
                    keyRaw: "lastName",
                    nullable: true
                },

                lat: {
                    type: "Float",
                    keyRaw: "lat",
                    nullable: true
                },

                legalName: {
                    type: "String",
                    keyRaw: "legalName",
                    nullable: true
                },

                linkedin: {
                    type: "String",
                    keyRaw: "linkedin",
                    nullable: true
                },

                lng: {
                    type: "Float",
                    keyRaw: "lng",
                    nullable: true
                },

                locality: {
                    type: "String",
                    keyRaw: "locality",
                    nullable: true
                },

                logo: {
                    type: "String",
                    keyRaw: "logo",
                    nullable: true
                },

                logoDark: {
                    type: "String",
                    keyRaw: "logoDark",
                    nullable: true
                },

                logoMobile: {
                    type: "String",
                    keyRaw: "logoMobile",
                    nullable: true
                },

                logoMobileDark: {
                    type: "String",
                    keyRaw: "logoMobileDark",
                    nullable: true
                },

                logoCdn: {
                    type: "String",
                    keyRaw: "logoCdn",
                    nullable: true
                },

                logoDarkCdn: {
                    type: "String",
                    keyRaw: "logoDarkCdn",
                    nullable: true
                },

                logoMobileCdn: {
                    type: "String",
                    keyRaw: "logoMobileCdn",
                    nullable: true
                },

                logoMobileDarkCdn: {
                    type: "String",
                    keyRaw: "logoMobileDarkCdn",
                    nullable: true
                },

                minimumOrderValue: {
                    type: "Float",
                    keyRaw: "minimumOrderValue",
                    nullable: true
                },

                minOrderValue: {
                    type: "Float",
                    keyRaw: "minOrderValue",
                    nullable: true
                },

                name: {
                    type: "String",
                    keyRaw: "name",
                    nullable: true
                },

                openGraphImage: {
                    type: "String",
                    keyRaw: "openGraphImage",
                    nullable: true
                },

                openGraphImageCdn: {
                    type: "String",
                    keyRaw: "openGraphImageCdn",
                    nullable: true
                },

                pageSize: {
                    type: "Int",
                    keyRaw: "pageSize",
                    nullable: true
                },

                phone: {
                    type: "String",
                    keyRaw: "phone",
                    nullable: true
                },

                pinterestTag: {
                    type: "String",
                    keyRaw: "pinterestTag",
                    nullable: true
                },

                pinterestUrl: {
                    type: "String",
                    keyRaw: "pinterestUrl",
                    nullable: true
                },

                qrCode: {
                    type: "String",
                    keyRaw: "qrCode",
                    nullable: true
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

                searchbarText: {
                    type: "String",
                    keyRaw: "searchbarText",
                    nullable: true
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
                        },

                        deliveryDays: {
                            type: "Int",
                            keyRaw: "deliveryDays",
                            nullable: true
                        },

                        enabled: {
                            type: "Boolean",
                            keyRaw: "enabled",
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

                        provider: {
                            type: "String",
                            keyRaw: "provider",
                            nullable: true
                        }
                    }
                },

                shippingCharge: {
                    type: "Float",
                    keyRaw: "shippingCharge",
                    nullable: true
                },

                shopAddress: {
                    type: "String",
                    keyRaw: "shopAddress",
                    nullable: true
                },

                shopPhone: {
                    type: "String",
                    keyRaw: "shopPhone",
                    nullable: true
                },

                slug: {
                    type: "String",
                    keyRaw: "slug",
                    nullable: true
                },

                snapChatPixel: {
                    type: "String",
                    keyRaw: "snapChatPixel",
                    nullable: true
                },

                state: {
                    type: "String",
                    keyRaw: "state",
                    nullable: true
                },

                storeId: {
                    type: "String",
                    keyRaw: "storeId",
                    nullable: true
                },

                timeZone: {
                    type: "String",
                    keyRaw: "timeZone",
                    nullable: true
                },

                timing: {
                    type: "String",
                    keyRaw: "timing",
                    nullable: true
                },

                title: {
                    type: "String",
                    keyRaw: "title",
                    nullable: true
                },

                twitter: {
                    type: "String",
                    keyRaw: "twitter",
                    nullable: true
                },

                twitterUrl: {
                    type: "String",
                    keyRaw: "twitterUrl",
                    nullable: true
                },

                websiteEmail: {
                    type: "String",
                    keyRaw: "websiteEmail",
                    nullable: true
                },

                websiteLegalName: {
                    type: "String",
                    keyRaw: "websiteLegalName",
                    nullable: true
                },

                websiteName: {
                    type: "String",
                    keyRaw: "websiteName",
                    nullable: true
                },

                weightUnit: {
                    type: "String",
                    keyRaw: "weightUnit",
                    nullable: true
                },

                youtubeUrl: {
                    type: "String",
                    keyRaw: "youtubeUrl",
                    nullable: true
                },

                webmail: {
                    type: "String",
                    keyRaw: "webmail",
                    nullable: true
                },

                zip: {
                    type: "String",
                    keyRaw: "zip",
                    nullable: true
                },

                timeDisplayFormat: {
                    type: "String",
                    keyRaw: "timeDisplayFormat",
                    nullable: true
                },

                priceDisplayFormat: {
                    type: "String",
                    keyRaw: "priceDisplayFormat",
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

                sms: {
                    type: "Sms",
                    keyRaw: "sms",
                    nullable: true,

                    fields: {
                        AUTO_VERIFICATION_ID: {
                            type: "String",
                            keyRaw: "AUTO_VERIFICATION_ID",
                            nullable: true
                        }
                    }
                },

                shippoToken: {
                    type: "String",
                    keyRaw: "shippoToken",
                    nullable: true
                },

                shipRocketEmail: {
                    type: "String",
                    keyRaw: "shipRocketEmail",
                    nullable: true
                },

                shipRocketPassword: {
                    type: "String",
                    keyRaw: "shipRocketPassword",
                    nullable: true
                },

                shipRocketChannelId: {
                    type: "String",
                    keyRaw: "shipRocketChannelId",
                    nullable: true
                },

                pickrrAuthToken: {
                    type: "String",
                    keyRaw: "pickrrAuthToken",
                    nullable: true
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

                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        }
                    }
                },

                storeCountry: {
                    type: "StoreCountry",
                    keyRaw: "storeCountry",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        },

                        default: {
                            type: "Boolean",
                            keyRaw: "default",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        },

                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        code: {
                            type: "String",
                            keyRaw: "code",
                            nullable: true
                        },

                        country: {
                            type: "Country",
                            keyRaw: "country",
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
                                }
                            }
                        }
                    }
                },

                storeCurrency: {
                    type: "StoreCurrency",
                    keyRaw: "storeCurrency",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        },

                        default: {
                            type: "Boolean",
                            keyRaw: "default",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
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
                        },

                        currency: {
                            type: "Currency",
                            keyRaw: "currency",
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

                                sort: {
                                    type: "Int",
                                    keyRaw: "sort",
                                    nullable: true
                                },

                                isoCode: {
                                    type: "String",
                                    keyRaw: "isoCode",
                                    nullable: true
                                },

                                isoNumericCode: {
                                    type: "Int",
                                    keyRaw: "isoNumericCode",
                                    nullable: true
                                },

                                thousandsSeparator: {
                                    type: "String",
                                    keyRaw: "thousandsSeparator",
                                    nullable: true
                                },

                                decimalMark: {
                                    type: "String",
                                    keyRaw: "decimalMark",
                                    nullable: true
                                },

                                symbolFirst: {
                                    type: "Boolean",
                                    keyRaw: "symbolFirst",
                                    nullable: true
                                },

                                active: {
                                    type: "Boolean",
                                    keyRaw: "active",
                                    nullable: true
                                },

                                symbol: {
                                    type: "String",
                                    keyRaw: "symbol",
                                    nullable: true
                                },

                                disambiguateSymbol: {
                                    type: "String",
                                    keyRaw: "disambiguateSymbol",
                                    nullable: true
                                },

                                htmlEntity: {
                                    type: "String",
                                    keyRaw: "htmlEntity",
                                    nullable: true
                                },

                                subUnit: {
                                    type: "String",
                                    keyRaw: "subUnit",
                                    nullable: true
                                },

                                smallestDenomination: {
                                    type: "Float",
                                    keyRaw: "smallestDenomination",
                                    nullable: true
                                },

                                subunitToUnit: {
                                    type: "Float",
                                    keyRaw: "subunitToUnit",
                                    nullable: true
                                }
                            }
                        }
                    }
                },

                storeLanguage: {
                    type: "StoreLanguage",
                    keyRaw: "storeLanguage",
                    nullable: true,

                    fields: {
                        id: {
                            type: "ID",
                            keyRaw: "id",
                            nullable: true
                        },

                        default: {
                            type: "Boolean",
                            keyRaw: "default",
                            nullable: true
                        },

                        active: {
                            type: "Boolean",
                            keyRaw: "active",
                            nullable: true
                        },

                        name: {
                            type: "String",
                            keyRaw: "name",
                            nullable: true
                        },

                        code: {
                            type: "String",
                            keyRaw: "code",
                            nullable: true
                        },

                        lang: {
                            type: "Language",
                            keyRaw: "lang",
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
                                },

                                phpLocaleCode: {
                                    type: "String",
                                    keyRaw: "phpLocaleCode",
                                    nullable: true
                                },

                                rtl: {
                                    type: "Boolean",
                                    keyRaw: "rtl",
                                    nullable: true
                                },

                                sort: {
                                    type: "Int",
                                    keyRaw: "sort",
                                    nullable: true
                                },

                                active: {
                                    type: "Boolean",
                                    keyRaw: "active",
                                    nullable: true
                                }
                            }
                        }
                    }
                }
            }
        },

        megamenu: {
            type: "Category",
            keyRaw: "megamenu(domain: $domain)",
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

                featured: {
                    type: "Boolean",
                    keyRaw: "featured",
                    nullable: true
                },

                children: {
                    type: "Category",
                    keyRaw: "children",
                    nullable: true,

                    fields: {
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

                        featured: {
                            type: "Boolean",
                            keyRaw: "featured",
                            nullable: true
                        },

                        children: {
                            type: "Category",
                            keyRaw: "children",
                            nullable: true,

                            fields: {
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

                                featured: {
                                    type: "Boolean",
                                    keyRaw: "featured",
                                    nullable: true
                                },

                                children: {
                                    type: "Category",
                                    keyRaw: "children",
                                    nullable: true,

                                    fields: {
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

                                        featured: {
                                            type: "Boolean",
                                            keyRaw: "featured",
                                            nullable: true
                                        },

                                        children: {
                                            type: "Category",
                                            keyRaw: "children",
                                            nullable: true,

                                            fields: {
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

                                                featured: {
                                                    type: "Boolean",
                                                    keyRaw: "featured",
                                                    nullable: true
                                                },

                                                children: {
                                                    type: "Category",
                                                    keyRaw: "children",
                                                    nullable: true,

                                                    fields: {
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

                                                        featured: {
                                                            type: "Boolean",
                                                            keyRaw: "featured",
                                                            nullable: true
                                                        },

                                                        children: {
                                                            type: "Category",
                                                            keyRaw: "children",
                                                            nullable: true,

                                                            fields: {
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

                                                                featured: {
                                                                    type: "Boolean",
                                                                    keyRaw: "featured",
                                                                    nullable: true
                                                                },

                                                                children: {
                                                                    type: "Category",
                                                                    keyRaw: "children",
                                                                    nullable: true,

                                                                    fields: {
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

                                                                        featured: {
                                                                            type: "Boolean",
                                                                            keyRaw: "featured",
                                                                            nullable: true
                                                                        },

                                                                        children: {
                                                                            type: "Category",
                                                                            keyRaw: "children",
                                                                            nullable: true,

                                                                            fields: {
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

                                                                                featured: {
                                                                                    type: "Boolean",
                                                                                    keyRaw: "featured",
                                                                                    nullable: true
                                                                                },

                                                                                children: {
                                                                                    type: "Category",
                                                                                    keyRaw: "children",
                                                                                    nullable: true,

                                                                                    fields: {
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

                                                                                        featured: {
                                                                                            type: "Boolean",
                                                                                            keyRaw: "featured",
                                                                                            nullable: true
                                                                                        },

                                                                                        id: {
                                                                                            type: "ID",
                                                                                            keyRaw: "id"
                                                                                        }
                                                                                    }
                                                                                },

                                                                                id: {
                                                                                    type: "ID",
                                                                                    keyRaw: "id"
                                                                                }
                                                                            }
                                                                        },

                                                                        id: {
                                                                            type: "ID",
                                                                            keyRaw: "id"
                                                                        }
                                                                    }
                                                                },

                                                                id: {
                                                                    type: "ID",
                                                                    keyRaw: "id"
                                                                }
                                                            }
                                                        },

                                                        id: {
                                                            type: "ID",
                                                            keyRaw: "id"
                                                        }
                                                    }
                                                },

                                                id: {
                                                    type: "ID",
                                                    keyRaw: "id"
                                                }
                                            }
                                        },

                                        id: {
                                            type: "ID",
                                            keyRaw: "id"
                                        }
                                    }
                                },

                                id: {
                                    type: "ID",
                                    keyRaw: "id"
                                }
                            }
                        },

                        id: {
                            type: "ID",
                            keyRaw: "id"
                        }
                    }
                }
            }
        }
    },

    input: {
        fields: {
            domain: "String"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=8c70da5aa6d53830eb4e42b828e8d4b111a4a9c784451c09421c7342ec559814";