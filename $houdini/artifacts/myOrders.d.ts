export type myOrders = {
    readonly "input": myOrders$input,
    readonly "result": myOrders$result | undefined
};

export type myOrders$result = {
    readonly myOrders: {
        readonly count: number | null,
        readonly pageSize: number | null,
        readonly page: number | null,
        readonly data: ({
            readonly id: string | null,
            readonly paySuccess: number | null,
            readonly orderNo: string | null,
            readonly otp: string | null,
            readonly createdAt: string | null,
            readonly updatedAt: string | null,
            readonly codPaid: number | null,
            readonly payment: {
                readonly id: string | null,
                readonly amountPaid: number | null
            } | null,
            readonly paymentMode: string | null,
            readonly paymentStatus: string | null,
            readonly paymentCurrency: string | null,
            readonly paymentReferenceId: string | null,
            readonly paymentOrderId: string | null,
            readonly paymentReceipt: string | null,
            readonly invoiceId: string | null,
            readonly paymentGateway: string | null,
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
            readonly store: {
                readonly id: string,
                readonly name: string | null,
                readonly email: string | null
            } | null,
            readonly items: ({
                readonly id: string | null,
                readonly pid: string | null,
                readonly status: string | null,
                readonly posInvoiceNo: string | null,
                readonly itemOrderNo: string | null,
                readonly name: string | null,
                readonly barcode: string | null,
                readonly img: string | null,
                readonly imgCdn: string | null,
                readonly foodType: string | null,
                readonly slug: string | null,
                readonly price: number | null,
                readonly qty: number | null,
                readonly shippingCharge: number | null,
                readonly subtotal: number | null,
                readonly total: number | null,
                readonly tax: number | null,
                readonly time: string | null,
                readonly brandName: string | null,
                readonly brandImg: string | null,
                readonly brandImgCdn: string | null,
                readonly vendorBusinessName: string | null,
                readonly vendor: {
                    readonly id: string | null,
                    readonly slug: string | null,
                    readonly businessName: string | null,
                    readonly banner: string | null,
                    readonly bannerCdn: string | null
                } | null,
                readonly orderStatus: ({
                    readonly id: string,
                    readonly event: string | null,
                    readonly tracking_id: string | null,
                    readonly courier_name: string | null
                } | null)[] | null
            })[] | null,
            readonly orderItems: ({
                readonly id: string | null,
                readonly status: string | null,
                readonly pid: string | null,
                readonly posInvoiceNo: string | null,
                readonly itemOrderNo: string | null,
                readonly name: string | null,
                readonly slug: string | null,
                readonly img: string | null,
                readonly imgCdn: string | null,
                readonly qty: number | null,
                readonly price: number | null,
                readonly mrp: number | null,
                readonly color: string | null,
                readonly size: string | null,
                readonly tracking: string | null,
                readonly shippingCharge: number | null,
                readonly tax: number | null,
                readonly subtotal: number | null,
                readonly total: number | null,
                readonly brandName: string | null,
                readonly brandImg: string | null,
                readonly brandImgCdn: string | null,
                readonly foodType: string | null,
                readonly usedOptions: ({
                    readonly name: string | null,
                    readonly val: (string | null)[] | null,
                    readonly dates: (string | null)[] | null
                } | null)[] | null
            })[] | null
        } | null)[] | null
    } | null
};

export type myOrders$afterLoad = {
    readonly "input": {
        readonly "myOrders": myOrders$input
    },
    readonly "data": {
        readonly "myOrders": myOrders$result
    }
};

export type myOrders$input = {
    page?: number | null | undefined,
    skip?: number | null | undefined,
    limit?: number | null | undefined,
    search?: string | null | undefined,
    sort?: string | null | undefined,
    status?: string | null | undefined,
    where?: string | null | undefined,
    store?: string | null | undefined
};