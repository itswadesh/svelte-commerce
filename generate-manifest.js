import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const icon = 'static/litekart-icon-512x512-black.png'
const backgroundColor = '#1b4079'
const themeColor = '#d62828'
const siteShortTitle = 'Litekart'
const siteTitle = 'Litekart'
const description = 'Litekart'

const shortcuts = [
	// {
	// 	name: 'Buy Mobile covers',
	// 	short_name: 'Mobile',
	// 	description: 'Buy Modern Mobile Covers',
	// 	url: '/mobile?source=pwa',
	// 	icons: [
	// 		{
	// 			src: '/category/mobile.png',
	// 			sizes: '192x192'
	// 		}
	// 	]
	// },
	// {
	// 	name: 'Print your mug',
	// 	short_name: 'Mug',
	// 	description: 'Print your photo on mug',
	// 	url: '/mug?source=pwa',
	// 	icons: [
	// 		{
	// 			src: '/category/mug.png',
	// 			sizes: '192x192'
	// 		}
	// 	]
	// }
]

const screenshots = [
	// {
	// 	src: '/screenshots/1.png',
	// 	type: 'image/png',
	// 	sizes: '540x720'
	// },
	// {
	// 	src: '/screenshots/2.jpg',
	// 	type: 'image/jpg',
	// 	sizes: '540x720'
	// }
]

const __dirname = path.resolve()
const iconsDirectory = path.join(__dirname, 'static/icons')
const manifestFile = path.join(__dirname, 'static/manifest.json')

const DEFAULT_SIZES = [72, 96, 120, 128, 144, 152, 180, 192, 256, 384, 512]

const iconImage = sharp(icon)

const resizeIcon = async ({ size, path }) => {
	await iconImage
		.resize(size, size, {
			kernel: sharp.kernel.nearest,
			fit: 'contain',
			position: 'center',
			background: { r: 255, g: 255, b: 255, alpha: 0.5 }
		})
		.toFile(path, (err) => {
			if (err) {
				// console.error(err)
			}
		})
}

const main = async () => {
	try {
		const { height, width } = await iconImage.metadata()
		const maxSize = Math.min(width, height)
		const sizes = DEFAULT_SIZES //.filter((element) => element <= maxSize)

		const manifest = {
			short_name: siteShortTitle,
			name: siteTitle,
			start_url: '/',
			background_color: backgroundColor,
			display: 'fullscreen',
			scope: '/',
			theme_color: themeColor,
			description,
			icons: sizes.map((size) => {
				const path = `icons/icon-${size}x${size}.png`
				resizeIcon({ size, path: `static/${path}` })
				if (size === 180) {
					return {
						src: path,
						type: 'image/png',
						sizes: `${size}x${size}`,
						purpose: 'maskable'
					}
				} else {
					return {
						src: path,
						type: 'image/png',
						sizes: `${size}x${size}`,
						purpose: 'any'
					}
				}
			}),
			shortcuts,
			screenshots
		}

		fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2))
	} catch (error) {
		// console.error(error)
	}
}

fs.mkdir(iconsDirectory, { recursive: true }, (err) => {
	if (err) {
		// return // console.error(err)
	}
})

main()
