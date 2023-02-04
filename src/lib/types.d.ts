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
	currentPage: number
	pageSize: number
	limit: number
	products: Product[]
}

interface Product {
	_id: string
	active: boolean
	barcode: string
	brand: Brand
	brandName: string
	categoryPool: Category
	countryOfOrigin: string
	crossSells: Product[]
	description: string
	discount: number
	ean: string
	featured: boolean
	foodType: string
	groupProduct: Product[]
	hasStock: boolean
	height: number
	hsn: string
	images?: string[]
	img?: string
	isCustomized: boolean
	isFnb: boolean
	layoutTemplateCdn?: string
	length: number
	linkedProducts: Product[]
	longDescription: string
	mrp: number
	name: string
	new: boolean
	options: Option[]
	popularity: number
	price: number
	replaceAllowed: boolean
	replaceValidityInDays: number
	returnAllowed: boolean
	returnValidityInDays: number
	shortDescription: string
	size: Size
	sku: string
	slug: string
	specifications: Specification[]
	status: string
	stock: number
	tags: Tag[]
	terms: string
	varified: boolean
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
	colorCode: string
	position: number
	active: boolean
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
