import type { Record } from 'pocketbase'
import type { z } from 'zod'
import {
	productDto,
	updateReviewDto,
	createReviewDto,
	resetPasswordDto,
	createProductDto,
	registerUserDto,
	loginUserDto,
	updateEmailDto,
	updateReplyDto,
	updateUsernameDto,
	updateProductImagesDto
} from '$lib/schemas'
import { createReplyDto } from './schemas'

interface Me {
	active?: boolean
	avatar?: string
	email?: string
	firstName?: string
	lastName?: string
	phone?: string
	role?: string
	verified?: boolean
}

interface AllProducts {
	count: number
	currentPage?: number
	pageSize?: number
	limit: number
	products: Product[]
	facets: Facet[]
}

interface Facet {}
interface EsProduct {
	_source: Product
}

interface Product {
	id?: string
	_id: string
	active?: boolean
	barcode: string
	brand?: Brand
	brandName?: string
	categoryPool: Category
	countryOfOrigin: string
	crossSells?: Product[]
	description: string
	discount: number
	ean: string
	featured?: boolean
	foodType?: string
	groupProduct?: Product[]
	hasStock?: boolean
	height: number
	hsn: string
	images?: string[]
	img?: string
	isCustomized?: boolean
	isFnb?: boolean
	layoutTemplateCdn?: string
	length?: number
	linkedProducts?: Product[]
	longDescription?: string
	mrp: number
	name: string
	new?: boolean
	options?: Option[]
	popularity?: number
	price: number
	replaceAllowed?: boolean
	replaceValidityInDays?: number
	returnAllowed?: boolean
	returnValidityInDays?: number
	shortDescription?: string
	size?: Size
	sku: string
	slug: string
	specifications?: Specification[]
	status: string
	stock: number
	tags: Tag[]
	terms?: string
	upc?: string
	varified?: boolean
	weight: number
	width: number
}

interface Brand {
	_id: string
	name: string
	slug: string
	active: boolean
}

interface Size {
	_id: string
	name: string
	active: boolean
}

interface Specification {
	_id: string
	name: string
	value: string
	active: boolean
}

interface Category {
	_id: string
	name: string
	slug: string
	link: string
	active: boolean
	new: boolean
	position: number
}

interface Option {
	_id: string
	name: string
	inputType: string
	values: OptionValue[]
}

interface OptionValue {
	_id: string
	name: string
}

interface Tag {
	name: string
	img: string
	type: string
	colorCode: string
	position: number
	active: boolean
}

interface AllOrders {
	count: number
	currentPage?: number
	pageSize?: number
	limit: number
	data: Order[]
}

interface CartItem {
	pid: ID
	vid: ID
	barcode: string
	name: string
	img: string
	imgCdn: string
	slug: string
	price: Float
	mrp: Float
	customizedImg: string
	isCustomized: boolean
	shippingCharge: Float
	orderStatus: [OrderStatusRes]
	tracking: string
	qty: Int
	time: string
	options: [Option1]
	usedOptions: [UsedOption]
	brand: Brand
	tax: Float
	brandName: string
	type: string
	formattedItemAmount: CartItemAmount
	vendor: ID
	vendorSlug: string
	vendorBusinessName: string
	foodType: string
	deliveryDetails: string
	status: string
	msg: string
}

interface CartItemAmount {
	mrp: string
	price: string
	shippingCharge: string
	tax: string
}

interface CartAmount {
	subtotal: string
	total: string
	tax: string
	offer_total: string
}

interface cartRes {
	data: [Cart]
	count: Int
	pageSize: Int
	page: Int
}

interface Cart {
	id: ID
	uid: User
	cart_id: Cart
	store: Store
	storeCurrency: ID
	qty: Int
	currencyCode: string
	currencyName: string
	currencySymbol: string
	discount: CartDiscount
	subtotal: Float
	shipping: Shipping
	tax: Float
	total: Float
	offer_total: Float
	items: [CartItem]
	unavailableItems: [CartItem]
	active: Boolean
	sid: string
	formattedAmount: CartAmount
	needAddress: Boolean
	needPrescription: Boolean
	selfTakeout: Boolean
	codAvailable: Boolean
	createdAt: string!
	updatedAt: string!
}

interface CartDiscount {
	code: string
	value: Float
	text: string
	amount: Float
}

interface Order {
	_id: string
	status: string
	paymentStatus?: string
	display_id?: 2
	cartId?: string
	cart: Cart
	customer: User
	userEmail: string
	addressId?: string
	address: Address
	billingAddress?: Address
	amount: Amount
	payment?: Payment
	items: Item[]
	needAddress?: boolean
	needPrescription?: boolean
	orderItems: Item[]
	orderNo: string
	otp?: string
	paid?: boolean
	paySuccess?: number
	payment?: Payment
	paymentCurrency?: string
	paymentMode?: string
	paymentNotes?: PaymentNote
	paymentOrderId?: string
	paymentReceipt?: string
	paymentStatus?: string
	refunds?: Refund
	selfTakeout?: boolean
	shippingSync?: boolean
	status?: string
	store?: string
	totalAmountRefunded?: number
	updatedAt: string
	user: string
	userEmail?: string
	userFirstName?: string
	userLastName?: string
	userPhone?: string
}

interface User {
	fullName: string
	phone: string
	email: string
}

interface Address {
	active: boolean
	address: string
	city: string
	country: string
	district: string
	email: string
	firstName: string
	isResidential: boolean
	lastName: string
	phone: string
	state: string
	zip: number
}

interface Amount {
	currency: string
	discount: number
	qty: number
	shipping: number
	subtotal: number
	tax: number
	total: number
}

interface Item {
	vendorAddress: VendorAddress
	amount: Amount
	baseAmount: BaseAmount
	formattedAmount: Amount
	address: Address
	billingAddress: Address
	_id: string
	itemOrderNo: string
	status: string
	orderNo: string
	cartId: string
	needAddress: boolean
	selfTakeout: boolean
	needPrescription: boolean
	name: string
	qty: number
	slug: string
	description: string
	foodType: string
	img: string
	pid: string
	isCustomized: boolean
	customizedImg: string
	unit: string
	dimensionUnit: string
	price: number
	mrp: number
	subtotal: number
	discount: number
	tax: number
	shippingCharge: number
	total: number
	paid: boolean
	paySuccess: number
	amountRefunded: number
	amountDue: number
	amountPaid: number
	codPaid: number
	totalDiscount: number
	totalAmountRefunded: number
	baseShippingCharge: number
	baseTax: number
	baseTotalDiscount: boolean
	baseCodPaid: boolean
	baseDiscount: boolean
	basePaymentAmount: boolean
	baseAmountRefunded: boolean
	baseTotalAmountRefunded: boolean
	orderHistory: OrderHistory[]
	orderStatus: OrderStatus[]
	refunds: Refund[]
	isReplacement: boolean
	reviewed: boolean
	vendor: string
	vendorBusinessName: string
	vendorPhone: string
	vendorEmail: string
	days: number
	usedOptions: Option[]
	options: Option[]
	active: true
	coupon: Coupon
	otp: string
	paymentAmount: number
	paymentCurrency: string
	paymentMode: string
	paymentStatus: string
	store: string
	type: string
	user: string
	userEmail: string
	userFirstName: string
	userLastName: string
	userPhone: string
	addressId: string
	isCloned: boolean
	afterOrder: boolean
	createdAt: string
	updatedAt: string
	formattedSubtotal: string
	formattedMrp: string
	formattedPrice: string
	formattedTotal: string
	formattedPaymentAmount: string
	orderId: string
	invoiceId: string
	payment: string
	paymentNotes: PaymentNote
	paymentOrderId: string
	paymentReceipt: string
	formattedAmountDue: string
}

interface VendorAddress {
	active: boolean
	isResidential: boolean
}

interface BaseAmount {
	tax: number
}

interface Payment {
	_id: string
	amountDue: number
	amountPaid: number
	contact: string
	createdAt: string
	currency: string
	customerName: string
	email: string
	for: string
	invoiceId: string
	orderId: string
	paid: boolean
	paymentMode: string
	receipt: string
	status: string
	store: string
	totalAmountRefunded: number
	updatedAt: string
}

interface OrderHistory {
	_id: string
	body: string
	icon: string
	index: number
	public: boolean
	status: string
	time: string
	title: string
}

interface OrderStatus {
	title: string
}

interface Refund {
	amount: number
}

interface Coupon {
	amount: number
	code: string
}

interface PaymentNote {
	phone: string
	purpose: string
}

interface ProductVote {
	user: string
	product: string
	expand: {
		product: Product
	}
}

interface ReviewVote {
	user: string
	review: string
}

interface Review {
	user: string
	product: string
	content: string
	expand: {
		user: User
		'review_replies(review)': ReviewReply[] | undefined[]
		'review_votes(review)': ReviewVote[]
		reply?: Review
	}
}

interface Error {
	status: number
	data: { message: string }
}

type ProductDto = z.infer<productDto>
type UpdateReviewDto = z.infer<updateReviewDto>
type CreateReviewDto = z.infer<createReviewDto>
type RegisterUserDto = z.infer<registerUserDto>
type LoginUserDto = z.infer<loginUserDto>
type ResetPasswordDto = z.infer<resetPasswordDto>
type UpdateEmailDto = z.infer<updateEmailDto>
type UpdateUsernameDto = z.infer<updateUsernameDto>
type CreateReplyDto = z.infer<createReplyDto>
type UpdateReplyDto = z.infer<updateReplyDto>
type UpdateProductImagesDto = z.infer<updateProductImagesDto>

interface ReviewActionData {
	data?: CreateReviewDto
	errors?: z.inferFlattenedErrors<typeof createReviewDto>['fieldErrors']
	updateData?: UpdateReviewDto
	updateErrors?: z.inferFlattenedErrors<typeof updateReviewDto>['fieldErrors']
	success?: boolean
}

interface ReplyActionData {
	data?: CreateReplyDto
	errors?: z.inferFlattenedErrors<typeof createReplyDto>['fieldErrors']
	updateData?: UpdateReplyDto
	updateErrors?: z.inferFlattenedErrors<typeof updateReplyDto>['fieldErrors']
	success?: boolean
}

interface LoginActionData {
	data?: LoginUserDto
	errors?: z.inferFlattenedErrors<typeof registerUserDto>['fieldErrors']
	notVerified?: boolean
	invalidCredentials?: boolean
}

interface ResetPasswordActionData {
	data?: ResetPasswordDto
	errors?: z.inferFlattenedErrors<typeof resetPasswordDto>['fieldErrors']
	success?: boolean
}

interface UpdateProductActionData {
	data?: CreateProductDto
	errors?: z.inferFlattenedErrors<typeof createProductDto>['fieldErrors']
	success?: boolean
}

type UpdateEmailErrors = z.inferFlattenedErrors<typeof updateEmailDto>['fieldErrors']
type UpdateUsernameErrors = z.inferFlattenedErrors<typeof updateUsernameDto>['fieldErrors']

interface UpdateAccountActionData {
	data?: UpdateEmailDto | UpdateUsernameDto
	errors?: {
		emailErrors?: UpdateEmailErrors
		usernameErrors?: UpdateUsernameErrors
	}
	success?: boolean
}

interface NavigationItem {
	title: string
	href: string
}

interface PaymentMethod {
	id: string
	for: string
	amountDue: number
	amountPaid: number
	approvalUrl: string
	totalAmountRefunded: number
	captured: boolean
	clientSecret: string
	contact: string
	currency: string
	customerName: string
	description: string
	email: string
	errorCode: string
	errorDescription: string
	fee: number
	invoiceId: string
	notes: string
	orderId: string
	paid: boolean
	paymentGateway: string
	paymentMode: string
	paymentOrderId: string
	q: string
	receipt: string
	referenceId: string
	refundStatus: string
	status: string
	store: StoreDocument['_id']
	tax: number
	token: string
	txMsg: string
	txTime: string
	subscribe: SubscribeDocument['_id']
	customerId: string
	redirectUrl: string
	signature: string
	keyId: string
}
