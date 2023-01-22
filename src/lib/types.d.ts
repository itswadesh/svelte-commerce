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

interface User extends Record {
	id: string
	name: string
	avatar?: string
	username: string
	bio?: string
	website?: string
	twitter?: string
	youtube?: string
	github?: string
}

interface Product extends Record {
	name: string
	tagline: string
	thumbnail?: string | undefined
	description: string
	expand: {
		'product_votes(product)': ProductVote[]
		'products_technologies(product)': Technology[]
		'products_topics(product)': Topic[]
		'reviews(product)': Review[]
	}
	images?: string[]
	user: string
	published: boolean
}

interface ProductVote extends Record {
	user: string
	product: string
	expand: {
		product: Product
	}
}

interface ReviewVote extends Record {
	user: string
	review: string
}

interface Review extends Record {
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

interface ReviewReply extends Record {
	review: string
	reply: string
	expand: {
		reply: Review
	}
}

interface Technology extends Record {
	name: string
}

interface Topic extends Record {
	name: string
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
