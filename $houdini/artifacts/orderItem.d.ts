export type orderItem = {
    readonly "input": orderItem$input,
    readonly "result": orderItem$result | undefined
};

export type orderItem$result = {
    readonly orderItem: {
        readonly id: string | null,
        readonly orderId: string | null,
        readonly status: string | null,
        readonly pid: string | null,
        readonly usedOptions: ({
            readonly name: string | null,
            readonly val: (string | null)[] | null,
            readonly dates: (string | null)[] | null
        } | null)[] | null,
        readonly posInvoiceNo: string | null,
        readonly invoiceId: string | null,
        readonly itemOrderNo: string | null,
        readonly expectedDeliveryDate: string | null,
        readonly deliveryDetails: string | null,
        readonly shippingOrderId: string | null,
        readonly shippingProvider: string | null,
        readonly shippingLabelId: string | null,
        readonly shippingRateId: string | null,
        readonly shippingTrackingNumber: string | null,
        readonly shippingTrackingStatus: string | null,
        readonly shippingTrackingUrlProvider: string | null,
        readonly shippingLabelUrl: string | null,
        readonly shippingCommercialInvoiceUrl: string | null,
        readonly name: string | null,
        readonly slug: string | null,
        readonly img: string | null,
        readonly imgCdn: string | null,
        readonly tracking: string | null,
        readonly foodType: string | null,
        readonly shippingCharge: number | null,
        readonly price: number | null,
        readonly basePrice: number | null,
        readonly qty: number | null,
        readonly tax: number | null,
        readonly baseTax: number | null,
        readonly total: number | null,
        readonly totalDiscount: number | null,
        readonly subtotal: number | null,
        readonly brandName: string | null,
        readonly brandImg: string | null,
        readonly brandImgCdn: string | null,
        readonly size: string | null,
        readonly color: string | null,
        readonly trackingId: string | null,
        readonly returnTrackingId: string | null,
        readonly courierName: string | null,
        readonly returnCourierName: string | null,
        readonly replaceValidTill: string | null,
        readonly returnValidTill: string | null,
        readonly returnPolicyExpired: boolean | null,
        readonly returnReason: string | null,
        readonly type: string | null,
        readonly amountRefunded: number | null,
        readonly baseAmountRefunded: number | null,
        readonly refunds: ({
            readonly message: string | null,
            readonly qty: number | null,
            readonly time: string | null,
            readonly amount: number | null,
            readonly refundId: string | null
        } | null)[] | null,
        readonly orderNo: string | null,
        readonly otp: string | null,
        readonly createdAt: string | null,
        readonly paySuccess: number | null,
        readonly payment: {
            readonly id: string | null
        } | null,
        readonly paymentMode: string | null,
        readonly paymentStatus: string | null,
        readonly paymentCurrency: string | null,
        readonly paymentReferenceId: string | null,
        readonly paymentOrderId: string | null,
        readonly paymentReceipt: string | null,
        readonly paymentGateway: string | null,
        readonly codPaid: number | null,
        readonly baseCodPaid: number | null,
        readonly amountPaid: number | null,
        readonly amountDue: number | null,
        readonly totalAmountRefunded: number | null,
        readonly baseTotalAmountRefunded: number | null,
        readonly paymentMsg: string | null,
        readonly paymentTime: string | null,
        readonly paid: boolean | null,
        readonly userFirstName: string | null,
        readonly userLastName: string | null,
        readonly userPhone: string | null,
        readonly userEmail: string | null,
        readonly invoiceLink: string | null,
        readonly discount: number | null,
        readonly baseDiscount: number | null,
        readonly baseTotalDiscount: number | null,
        readonly weight: number | null,
        readonly unit: string | null,
        readonly amount: {
            readonly total: number | null,
            readonly discount: number | null,
            readonly totalDiscount: number | null,
            readonly subtotal: number | null
        } | null,
        readonly baseAmount: {
            readonly total: number | null,
            readonly discount: number | null,
            readonly totalDiscount: number | null,
            readonly subtotal: number | null
        } | null,
        readonly user: {
            readonly id: string | null,
            readonly firstName: string | null
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
        readonly store: {
            readonly id: string,
            readonly name: string | null,
            readonly email: string | null
        } | null,
        readonly slot: {
            readonly name: string | null,
            readonly value: string | null,
            readonly info: string | null,
            readonly active: boolean | null
        } | null,
        readonly vendor: {
            readonly id: string | null,
            readonly slug: string | null,
            readonly businessName: string | null,
            readonly banner: string | null,
            readonly bannerCdn: string | null
        } | null,
        readonly vendorBusinessName: string | null,
        readonly vendorPhone: string | null,
        readonly vendorEmail: string | null,
        readonly vendorCommissionType: string | null,
        readonly vendorCommissionValue: number | null,
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
        readonly formattedSubtotal: string | null,
        readonly formattedShippingCharge: string | null,
        readonly formattedMrp: string | null,
        readonly formattedAmountRefunded: string | null,
        readonly formattedPrice: string | null,
        readonly formattedTax: string | null,
        readonly formattedTotal: string | null,
        readonly formattedTotalDiscount: string | null,
        readonly formattedVendorCommission: string | null,
        readonly formattedAmountDue: string | null,
        readonly formattedAmountPaid: string | null,
        readonly formattedCodPaid: string | null,
        readonly formattedDiscount: string | null,
        readonly formattedPaymentAmount: string | null,
        readonly formattedTotalAmountRefunded: string | null,
        readonly formattedAmount: {
            readonly subtotal: string | null,
            readonly tax: string | null,
            readonly discount: string | null,
            readonly shipping: string | null,
            readonly total: string | null,
            readonly totalDiscount: string | null,
            readonly exchangeRate: string | null
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
    } | null
};

export type orderItem$afterLoad = {
    readonly "input": {
        readonly "orderItem": orderItem$input
    },
    readonly "data": {
        readonly "orderItem": orderItem$result
    }
};

export type orderItem$input = {
    id: string
};