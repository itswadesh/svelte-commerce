// One availability rule for a product or variant record, shared by the Add to bag button and the
// product schema so the page and its structured data never disagree about whether it can be bought.

type StockSource = { manageInventory?: boolean | null; allowBackorder?: boolean | null; stock?: unknown } | null | undefined

/** Tracked stock with none left and no backorders. Untracked stock is always sellable. */
export const isOutOfStock = (source: StockSource): boolean =>
	!!source && source.manageInventory !== false && !source.allowBackorder && Number(source.stock ?? 0) <= 0

/** Sellable only as a backorder: tracked stock with none left, backorders allowed. */
export const isBackorder = (source: StockSource): boolean =>
	!!source && source.manageInventory !== false && !!source.allowBackorder && Number(source.stock ?? 0) <= 0
