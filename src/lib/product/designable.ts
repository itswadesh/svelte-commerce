/** Sold only made to the shopper's own design (GoCommerce D174): the editor, never a plain add. */
export const madeToDesign = (product: { designable?: boolean } | null | undefined): boolean => product?.designable === true
