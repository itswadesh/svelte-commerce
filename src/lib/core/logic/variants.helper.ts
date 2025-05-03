import type { Variant } from '$lib/core/types'

/**
 * Find a variant with a specific option value, also taking into account the previously selected options.
 * @note This works given that a single option will always have distinct values and every combination of options exists in the variants.
 * @param variants list of variants
 * @param optionId option id of the current change
 * @param value current change of option value
 */
export const findVariantWithOptionValue = (
	variants: Variant[],
	{ selectedVariant, optionId, value }: { optionId: string; value: string; selectedVariant: Variant }
) => {
	// Step 1: Take account of what previous options have been selected except the current change
	const selectedOptions = selectedVariant.options?.filter((option: Variant['options'][0]) => option.optionId !== optionId) as {
		optionId: string
		value: string
	}[]
	selectedOptions?.push({ optionId, value })

	// Step 2: Find the variant that has the selected options and the new option
	let v = variants.find((variant) => {
		if (!variant.options?.length) return false
		return variant.options.every((option) => {
			return selectedOptions?.some((selectedOption: any) => selectedOption.optionId === option.optionId && selectedOption.value === option.value)
		})
	})

	// Step 3: If exact variant not found then find the first variant that has the current passed option value pair
	if (!v) {
		v = variants.find((variant) => {
			if (!variant.options?.length) return false
			return variant.options.some((option) => option.optionId === optionId && option.value === value)
		})
	}

	return v
}

