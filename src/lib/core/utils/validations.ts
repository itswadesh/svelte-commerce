import { differenceInDays, formatDistanceToNowStrict } from 'date-fns'
import type { ZodError, z } from 'zod'

export const serializeNonPOJOs = <T>(obj: T): T => {
	return structuredClone(obj)
}

export const getImageURL = (collection: string, recordId: string, fileName: string | undefined, size = '0x0') => {
	return `api/files/${collection}/${recordId}/${fileName}?thumb=${size}`
}

export const validateData = async <T extends z.ZodTypeAny>(
	formData: FormData,
	schema: T,
	zfd = false
): Promise<{
	formData: z.infer<T>
	errors: z.inferFlattenedErrors<typeof schema> | null
}> => {
	const body = Object.fromEntries(formData)

	if (zfd) {
		try {
			const data = schema.parse(formData)
			return {
				formData: data,
				errors: null
			}
		} catch (err) {
			const errors = (err as ZodError).flatten()
			return {
				formData,
				errors
			}
		}
	} else {
		try {
			const data = schema.parse(body)
			return {
				formData: data,
				errors: null
			}
		} catch (err) {
			const errors = (err as ZodError).flatten()
			return {
				formData: body,
				errors
			}
		}
	}
}

export const validateFormData = async <T extends z.ZodTypeAny>(
	formData: FormData,
	schema: T
): Promise<{
	formData: z.infer<T>
	errors: z.inferFlattenedErrors<typeof schema> | null
}> => {
	const body = formData

	try {
		const formData = schema.parse(body)
		return {
			formData,
			errors: null
		}
	} catch (err) {
		const errors = (err as ZodError).flatten()
		return {
			formData: body,
			errors
		}
	}
}

interface SafeParseImages {
	success: boolean
	error?: ZodError
	data?: {
		images: Blob[]
	}
}

export const generateRelativeDate = (date: Date) => {
	const options = {
		month: 'short',
		day: 'numeric'
	}

	if (differenceInDays(new Date(), date) >= 1) {
		return date.toLocaleString('en-US', options as Intl.DateTimeFormatOptions)
	}

	return formatDistanceToNowStrict(date, { addSuffix: true })
}

interface CreateDelete {
	toDelete: string[]
	toCreate: string[]
}
