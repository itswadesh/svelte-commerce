export type paySuccessPageHit = {
    readonly "input": paySuccessPageHit$input,
    readonly "result": paySuccessPageHit$result
};

export type paySuccessPageHit$result = {
    readonly paySuccessPageHit: {
        readonly id: string | null,
        readonly orderNo: string | null,
        readonly otp: string | null,
        readonly createdAt: string | null,
        readonly paySuccess: number | null,
        readonly paymentMode: string | null,
        readonly paymentStatus: string | null,
        readonly paymentCurrency: string | null,
        readonly paymentReferenceId: string | null,
        readonly paymentOrderId: string | null,
        readonly paymentReceipt: string | null,
        readonly invoiceId: string | null,
        readonly paymentGateway: string | null,
        readonly codPaid: number | null,
        readonly baseCodPaid: number | null,
        readonly amountPaid: number | null,
        readonly amountDue: number | null,
        readonly paymentMsg: string | null,
        readonly paymentTime: string | null,
        readonly paid: boolean | null,
        readonly totalAmountRefunded: number | null,
        readonly baseTotalAmountRefunded: number | null,
        readonly amount: {
            readonly qty: number | null,
            readonly subtotal: number | null,
            readonly tax: number | null,
            readonly discount: number | null,
            readonly total: number | null,
            readonly shipping: number | null
        } | null,
        readonly baseAmount: {
            readonly qty: number | null,
            readonly subtotal: number | null,
            readonly tax: number | null,
            readonly discount: number | null,
            readonly total: number | null,
            readonly shipping: number | null
        } | null,
        readonly userFirstName: string | null,
        readonly userLastName: string | null,
        readonly userPhone: string | null,
        readonly userEmail: string | null,
        readonly address: {
            readonly firstName: string | null,
            readonly lastName: string | null,
            readonly town: string | null,
            readonly city: string | null,
            readonly state: string | null,
            readonly zip: string | null,
            readonly address: string | null,
            readonly lat: number | null,
            readonly lng: number | null
        } | null,
        readonly items: ({
            readonly id: string | null,
            readonly pid: string | null,
            readonly posInvoiceNo: string | null,
            readonly itemOrderNo: string | null,
            readonly name: string | null,
            readonly barcode: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly slug: string | null,
            readonly foodType: string | null,
            readonly price: number | null,
            readonly basePrice: number | null,
            readonly qty: number | null,
            readonly shippingCharge: number | null,
            readonly baseShippingCharge: number | null,
            readonly tax: number | null,
            readonly baseTax: number | null,
            readonly time: string | null,
            readonly usedOptions: ({
                readonly name: string | null,
                readonly val: (string | null)[] | null,
                readonly dates: (string | null)[] | null
            } | null)[] | null,
            readonly brandName: string | null,
            readonly brandImg: string | null,
            readonly color: string | null,
            readonly size: string | null,
            readonly status: string | null,
            readonly type: string | null,
            readonly returnReason: string | null,
            readonly amountRefunded: number | null,
            readonly baseAmountRefunded: number | null,
            readonly vendorBusinessName: string | null,
            readonly vendorAddress: {
                readonly firstName: string | null,
                readonly lastName: string | null,
                readonly town: string | null,
                readonly city: string | null,
                readonly state: string | null,
                readonly zip: string | null,
                readonly address: string | null,
                readonly lat: number | null,
                readonly lng: number | null
            } | null,
            readonly orderHistory: ({
                readonly status: string | null,
                readonly title: string | null,
                readonly body: string | null,
                readonly icon: string | null,
                readonly public: boolean | null,
                readonly index: number | null,
                readonly time: string | null
            } | null)[] | null
        })[] | null
    } | null
};

export type paySuccessPageHit$input = {
    orderId?: string | null | undefined,
    paymentReferenceId?: string | null | undefined
};