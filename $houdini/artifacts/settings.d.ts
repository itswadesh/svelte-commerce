export type settings = {
    readonly "input": null,
    readonly "result": settings$result | undefined
};

export type settings$result = {
    readonly settings: {
        readonly id: string | null,
        readonly websiteName: string | null,
        readonly websiteLegalName: string | null,
        readonly liveCommerce: boolean | null,
        readonly multilingual: boolean | null,
        readonly closed: boolean | null,
        readonly closedMessage: string | null,
        readonly minimumOrderValue: number | null,
        readonly title: string | null,
        readonly alert: string | null,
        readonly keywords: string | null,
        readonly description: string | null,
        readonly tax: {
            readonly cgst: number | null,
            readonly sgst: number | null,
            readonly igst: number | null
        } | null,
        readonly demo: boolean | null,
        readonly RAZORPAY_KEY_ID: string | null,
        readonly GOOGLE_CLIENT_ID: string | null,
        readonly stripePublishableKey: string | null,
        readonly brainTreePublicKey: string | null,
        readonly enableStripe: boolean | null,
        readonly enableSubsription: boolean | null,
        readonly enableRazorpay: boolean | null,
        readonly currencyCode: string | null,
        readonly currencySymbol: string | null,
        readonly currencyDecimals: number | null,
        readonly openGraphImage: string | null,
        readonly shipping: {
            readonly deliveryDays: number | null,
            readonly charge: number | null,
            readonly free: number | null,
            readonly method: string | null,
            readonly enabled: boolean | null,
            readonly provider: string | null
        } | null,
        readonly userRoles: (string | null)[] | null,
        readonly websiteEmail: string | null,
        readonly shopPhone: string | null,
        readonly shopAddress: string | null,
        readonly country: string | null,
        readonly countryDetails: {
            readonly id: string,
            readonly name: string,
            readonly value: string | null,
            readonly dialCode: string | null,
            readonly code: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly flag: string | null,
            readonly lang: string | null,
            readonly active: boolean | null
        } | null,
        readonly currency: string | null,
        readonly currencyDetails: {
            readonly id: string | null,
            readonly isoCode: string | null,
            readonly name: string | null,
            readonly symbol: string | null
        } | null,
        readonly lang: string | null,
        readonly langDetails: {
            readonly id: string | null,
            readonly name: string | null,
            readonly nativeName: string | null,
            readonly code: string | null
        } | null,
        readonly logo: string | null,
        readonly logoMobile: string | null,
        readonly logoDark: string | null,
        readonly logoMobileDark: string | null,
        readonly favicon: string | null,
        readonly CDN_URL: string | null,
        readonly S3_URL: string | null,
        readonly LIVE_COMMERCE_URL: string | null,
        readonly searchbarText: string | null,
        readonly pageSize: number | null,
        readonly returnReasons: (string | null)[] | null,
        readonly orderStatuses: ({
            readonly status: string | null,
            readonly title: string | null,
            readonly body: string | null,
            readonly icon: string | null,
            readonly public: boolean | null,
            readonly index: number | null
        } | null)[] | null,
        readonly paymentStatuses: (string | null)[] | null,
        readonly paymentMethods: ({
            readonly active: boolean | null,
            readonly name: string,
            readonly value: string | null,
            readonly img: string | null,
            readonly color: string | null,
            readonly position: number | null,
            readonly text: string | null
        } | null)[] | null,
        readonly otpLogin: boolean | null,
        readonly sms: {
            readonly AUTO_VERIFICATION_ID: string | null,
            readonly enabled: boolean | null,
            readonly provider: string | null
        } | null,
        readonly email: {
            readonly enabled: boolean | null,
            readonly from: string | null,
            readonly cc: (string | null)[] | null,
            readonly bcc: (string | null)[] | null,
            readonly printers: (string | null)[] | null
        } | null,
        readonly storage: {
            readonly enabled: boolean | null,
            readonly provider: string | null
        } | null,
        readonly review: {
            readonly enabled: boolean | null,
            readonly moderate: boolean | null
        } | null,
        readonly product: {
            readonly moderate: boolean | null
        } | null,
        readonly customerOrderNotifications: {
            readonly orderConfirmation: boolean | null,
            readonly orderStatusChanged: boolean | null,
            readonly orderShipped: boolean | null,
            readonly orderIsReadyForPickup: boolean | null,
            readonly downloadEGoods: boolean | null,
            readonly giftCardPurchased: boolean | null
        } | null,
        readonly adminNotifications: {
            readonly newOrderPlaced: boolean | null,
            readonly lowStockNotification: boolean | null
        } | null,
        readonly ADMIN_PANEL_LINK: string | null,
        readonly DOCS_LINK: string | null,
        readonly storageProvider: string | null,
        readonly googleMapsApi: string | null,
        readonly facebook: string | null,
        readonly twitter: string | null,
        readonly google: string | null,
        readonly instagram: string | null,
        readonly linkedin: string | null,
        readonly enableTax: boolean | null,
        readonly locationExpiry: number | null,
        readonly WWW_URL: string | null,
        readonly referralBonus: number | null,
        readonly joiningBonus: number | null,
        readonly isMultiVendor: boolean | null,
        readonly isMultiStore: boolean | null,
        readonly isMegamenu: boolean | null,
        readonly isSaas: boolean | null,
        readonly isSearch: boolean | null,
        readonly foodTypes: ({
            readonly name: string | null,
            readonly val: string | null,
            readonly img: string | null
        } | null)[] | null
    } | null
};

export type settings$afterLoad = {
    readonly "data": {
        readonly "settings": settings$result
    }
};