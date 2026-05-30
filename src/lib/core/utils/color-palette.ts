type ColorPalette = Record<string, string>
export function modifyColorPalette(palette: ColorPalette) {
	if (typeof document === 'undefined') return
	for (const [key, value] of Object.entries(palette)) {
    const formattedHsl = value?.replaceAll(',', '').replace('hsl(', '').replace(')', '')
		document.documentElement.style.setProperty(key, formattedHsl)
	}
}
