export type checkout = {
    readonly "input": checkout$input,
    readonly "result": checkout$result
};

export type checkout$result = {
    readonly checkout: {
        readonly id: string | null,
        readonly orderNo: string | null,
        readonly otp: string | null,
        readonly createdAt: string | null,
        readonly updatedAt: string | null,
        readonly payment: {
            readonly id: string | null
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
        readonly baseCodPaid: number | null,
        readonly amountPaid: number | null,
        readonly amountDue: number | null,
        readonly paymentMsg: string | null,
        readonly paymentTime: string | null,
        readonly paid: boolean | null,
        readonly amount: {
            readonly qty: number | null,
            readonly subtotal: number | null,
            readonly tax: number | null,
            readonly discount: number | null,
            readonly total: number | null,
            readonly shipping: number | null
        } | null,
        readonly baseAmount: {
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
        readonly store: {
            readonly id: string,
            readonly name: string | null
        } | null,
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
            readonly pid: string | null,
            readonly status: string | null,
            readonly posInvoiceNo: string | null,
            readonly itemOrderNo: string | null,
            readonly name: string | null,
            readonly barcode: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly slug: string | null,
            readonly price: number | null,
            readonly basePrice: number | null,
            readonly qty: number | null,
            readonly shippingCharge: number | null,
            readonly baseShippingCharge: number | null,
            readonly tax: number | null,
            readonly baseTax: number | null,
            readonly subtotal: number | null,
            readonly baseSubtotal: number | null,
            readonly total: number | null,
            readonly baseTotal: number | null,
            readonly time: string | null,
            readonly brandName: string | null,
            readonly brandImg: string | null,
            readonly brandImgCdn: string | null,
            readonly parentBrandName: string | null,
            readonly parentBrandImg: string | null,
            readonly parentBrandImgCdn: string | null,
            readonly color: string | null,
            readonly size: string | null,
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
            readonly vendor: {
                readonly id: string | null,
                readonly businessName: string | null
            } | null
        })[] | null,
        readonly orderItems: ({
            readonly id: string | null
        })[] | null
    } | null
};

export type checkout$input = {
    address?: string | null | undefined,
    slot?: string | null | undefined
};