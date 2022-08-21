export type storeOne = {
    readonly "input": storeOne$input,
    readonly "result": storeOne$result | undefined
};

export type storeOne$result = {
    readonly storeOne: {
        readonly id: string,
        readonly active: boolean | null,
        readonly featured: boolean | null,
        readonly adminNotifications: {
            readonly lowStockNotification: boolean | null,
            readonly newOrderPlaced: boolean | null
        } | null,
        readonly address: string | null,
        readonly alert: string | null,
        readonly analyticsTrackingId: string | null,
        readonly banners: (string | null)[] | null,
        readonly closed: boolean | null,
        readonly isWishlist: boolean | null,
        readonly isCart: boolean | null,
        readonly closedMessage: string | null,
        readonly customerOrderNotifications: {
            readonly downloadEGoods: boolean | null,
            readonly giftCardPurchased: boolean | null,
            readonly orderConfirmation: boolean | null,
            readonly orderIsReadyForPickup: boolean | null,
            readonly orderShipped: boolean | null,
            readonly orderStatusChanged: boolean | null,
            readonly orderConfirmationSms: boolean | null
        } | null,
        readonly vendorNotifications: {
            readonly orderConfirmationSms: boolean | null
        } | null,
        readonly description: string | null,
        readonly metaDescription: string | null,
        readonly dimentionUnit: string | null,
        readonly domain: string | null,
        readonly email: string | null,
        readonly facebook: string | null,
        readonly facebookPixelId: string | null,
        readonly facebookUrl: string | null,
        readonly favicon: string | null,
        readonly faviconCdn: string | null,
        readonly firstName: string | null,
        readonly freeShippingOn: number | null,
        readonly gdpr: boolean | null,
        readonly gdprCookieConsent: string | null,
        readonly google: string | null,
        readonly googleAdsTag: string | null,
        readonly homeMeta1: string | null,
        readonly homeMeta2: string | null,
        readonly homeMeta3: string | null,
        readonly homeMeta4: string | null,
        readonly img: string | null,
        readonly imgCdn: string | null,
        readonly images: (string | null)[] | null,
        readonly imagesCdn: (string | null)[] | null,
        readonly bankAccountNo: string | null,
        readonly bankAccountHolderName: string | null,
        readonly bankIfscCode: string | null,
        readonly bankSwiftCode: string | null,
        readonly instagram: string | null,
        readonly instagramUrl: string | null,
        readonly isHideNilStock: boolean | null,
        readonly isMegamenu: boolean | null,
        readonly isOpen: boolean | null,
        readonly isSearch: boolean | null,
        readonly isHyperlocal: boolean | null,
        readonly isFnb: boolean | null,
        readonly keywords: string | null,
        readonly lastName: string | null,
        readonly lat: number | null,
        readonly legalName: string | null,
        readonly linkedin: string | null,
        readonly lng: number | null,
        readonly locality: string | null,
        readonly logo: string | null,
        readonly logoDark: string | null,
        readonly logoMobile: string | null,
        readonly logoMobileDark: string | null,
        readonly logoCdn: string | null,
        readonly logoDarkCdn: string | null,
        readonly logoMobileCdn: string | null,
        readonly logoMobileDarkCdn: string | null,
        readonly minimumOrderValue: number | null,
        readonly minOrderValue: number | null,
        readonly name: string | null,
        readonly openGraphImage: string | null,
        readonly openGraphImageCdn: string | null,
        readonly pageSize: number | null,
        readonly phone: string | null,
        readonly pinterestTag: string | null,
        readonly pinterestUrl: string | null,
        readonly qrCode: string | null,
        readonly review: {
            readonly enabled: boolean | null,
            readonly moderate: boolean | null
        } | null,
        readonly searchbarText: string | null,
        readonly shipping: {
            readonly charge: number | null,
            readonly deliveryDays: number | null,
            readonly enabled: boolean | null,
            readonly free: number | null,
            readonly method: string | null,
            readonly provider: string | null
        } | null,
        readonly shippingCharge: number | null,
        readonly shopAddress: string | null,
        readonly shopPhone: string | null,
        readonly slug: string | null,
        readonly snapChatPixel: string | null,
        readonly state: string | null,
        readonly storeId: string | null,
        readonly timeZone: string | null,
        readonly timing: string | null,
        readonly title: string | null,
        readonly twitter: string | null,
        readonly twitterUrl: string | null,
        readonly websiteEmail: string | null,
        readonly websiteLegalName: string | null,
        readonly websiteName: string | null,
        readonly weightUnit: string | null,
        readonly youtubeUrl: string | null,
        readonly webmail: string | null,
        readonly zip: string | null,
        readonly timeDisplayFormat: string | null,
        readonly priceDisplayFormat: string | null,
        readonly createdAt: string | null,
        readonly updatedAt: string | null,
        readonly sms: {
            readonly AUTO_VERIFICATION_ID: string | null
        } | null,
        readonly shippoToken: string | null,
        readonly shipRocketEmail: string | null,
        readonly shipRocketPassword: string | null,
        readonly shipRocketChannelId: string | null,
        readonly pickrrAuthToken: string | null,
        readonly user: {
            readonly firstName: string | null,
            readonly lastName: string | null,
            readonly email: string | null,
            readonly phone: string | null
        } | null,
        readonly storeCountry: {
            readonly id: string | null,
            readonly default: boolean | null,
            readonly active: boolean | null,
            readonly name: string | null,
            readonly code: string | null,
            readonly country: {
                readonly id: string,
                readonly name: string,
                readonly value: string | null,
                readonly dialCode: string | null,
                readonly code: string | null,
                readonly img: string | null,
                readonly imgCdn: string | null,
                readonly flag: string | null,
                readonly lang: string | null
            } | null
        } | null,
        readonly storeCurrency: {
            readonly id: string | null,
            readonly default: boolean | null,
            readonly active: boolean | null,
            readonly isoCode: string | null,
            readonly name: string | null,
            readonly symbol: string | null,
            readonly currency: {
                readonly id: string | null,
                readonly name: string | null,
                readonly sort: number | null,
                readonly isoCode: string | null,
                readonly isoNumericCode: number | null,
                readonly thousandsSeparator: string | null,
                readonly decimalMark: string | null,
                readonly symbolFirst: boolean | null,
                readonly active: boolean | null,
                readonly symbol: string | null,
                readonly disambiguateSymbol: string | null,
                readonly htmlEntity: string | null,
                readonly subUnit: string | null,
                readonly smallestDenomination: number | null,
                readonly subunitToUnit: number | null
            } | null
        } | null,
        readonly storeLanguage: {
            readonly id: string | null,
            readonly default: boolean | null,
            readonly active: boolean | null,
            readonly name: string | null,
            readonly code: string | null,
            readonly lang: {
                readonly id: string | null,
                readonly name: string | null,
                readonly nativeName: string | null,
                readonly code: string | null,
                readonly phpLocaleCode: string | null,
                readonly rtl: boolean | null,
                readonly sort: number | null,
                readonly active: boolean | null
            } | null
        } | null
    } | null
};

export type storeOne$afterLoad = {
    readonly "input": {
        readonly "storeOne": storeOne$input
    },
    readonly "data": {
        readonly "storeOne": storeOne$result
    }
};

export type storeOne$input = {
    id?: string | null | undefined,
    slug?: string | null | undefined,
    domain?: string | null | undefined
};