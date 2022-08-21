export type myOrderItems = {
    readonly "input": myOrderItems$input,
    readonly "result": myOrderItems$result | undefined
};

export type myOrderItems$result = {
    readonly myOrderItems: {
        readonly count: number | null,
        readonly pageSize: number | null,
        readonly page: number | null,
        readonly data: ({
            readonly id: string | null,
            readonly status: string | null,
            readonly isReplacement: boolean | null,
            readonly pid: string | null,
            readonly usedOptions: ({
                readonly name: string | null,
                readonly val: (string | null)[] | null,
                readonly dates: (string | null)[] | null
            } | null)[] | null,
            readonly posInvoiceNo: string | null,
            readonly itemOrderNo: string | null,
            readonly name: string | null,
            readonly slug: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly foodType: string | null,
            readonly tracking: string | null,
            readonly shippingCharge: number | null,
            readonly price: number | null,
            readonly qty: number | null,
            readonly tax: number | null,
            readonly brandName: string | null,
            readonly brandImg: string | null,
            readonly brandImgCdn: string | null,
            readonly size: string | null,
            readonly color: string | null,
            readonly trackingId: string | null,
            readonly returnTrackingId: string | null,
            readonly courierName: string | null,
            readonly returnCourierName: string | null,
            readonly orderNo: string | null,
            readonly otp: string | null,
            readonly createdAt: string | null,
            readonly paySuccess: number | null,
            readonly payment: {
                readonly id: string | null,
                readonly amountPaid: number | null,
                readonly amountDue: number | null
            } | null,
            readonly paymentMode: string | null,
            readonly paymentStatus: string | null,
            readonly paymentCurrency: string | null,
            readonly paymentReferenceId: string | null,
            readonly paymentOrderId: string | null,
            readonly paymentReceipt: string | null,
            readonly invoiceId: string | null,
            readonly paymentGateway: string | null,
            readonly codPaid: number | null,
            readonly amountPaid: number | null,
            readonly amountDue: number | null,
            readonly paymentMsg: string | null,
            readonly paymentTime: string | null,
            readonly paid: boolean | null,
            readonly userFirstName: string | null,
            readonly userLastName: string | null,
            readonly userPhone: string | null,
            readonly invoiceLink: string | null,
            readonly returnValidTill: string | null,
            readonly paymentAmount: number | null,
            readonly vendorBusinessName: string | null,
            readonly vendor: {
                readonly id: string | null,
                readonly slug: string | null,
                readonly businessName: string | null,
                readonly banner: string | null,
                readonly bannerCdn: string | null
            } | null,
            readonly user: {
                readonly firstName: string | null,
                readonly lastName: string | null,
                readonly email: string | null,
                readonly phone: string | null,
                readonly role: string | null
            } | null,
            readonly address: {
                readonly firstName: string | null,
                readonly lastName: string | null,
                readonly address: string | null,
                readonly lat: number | null,
                readonly lng: number | null
            } | null,
            readonly amount: {
                readonly qty: number | null,
                readonly subtotal: number | null,
                readonly tax: number | null,
                readonly discount: number | null,
                readonly total: number | null,
                readonly shipping: number | null
            } | null,
            readonly store: {
                readonly id: string,
                readonly name: string | null,
                readonly email: string | null
            } | null,
            readonly orderHistory: ({
                readonly id: string | null,
                readonly status: string | null,
                readonly title: string | null,
                readonly body: string | null,
                readonly icon: string | null,
                readonly public: boolean | null,
                readonly index: number | null,
                readonly time: string | null
            } | null)[] | null
        } | null)[] | null
    } | null
};

export type myOrderItems$afterLoad = {
    readonly "input": {
        readonly "myOrderItems": myOrderItems$input
    },
    readonly "data": {
        readonly "myOrderItems": myOrderItems$result
    }
};

export type myOrderItems$input = {
    page?: number | null | undefined,
    skip?: number | null | undefined,
    limit?: number | null | undefined,
    search?: string | null | undefined,
    sort?: string | null | undefined,
    status?: string | null | undefined,
    where?: string | null | undefined,
    store?: string | null | undefined
};