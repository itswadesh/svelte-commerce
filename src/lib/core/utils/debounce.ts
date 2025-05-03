export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | undefined

	return function (this: any, ...args: Parameters<T>) {
		if (timeoutId) clearTimeout(timeoutId)

		timeoutId = setTimeout(() => {
			func.apply(this, args)
		}, wait)
	}
}
