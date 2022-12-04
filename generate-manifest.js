import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import {
	backgroundColor,
	icon,
	siteShortTitle,
	siteTitle,
	themeColor,
	shortcuts,
	description,
	screenshots
} from './src/lib/config/manifest.js'
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
			start_url: '/',
			background_color: backgroundColor,
			display: 'standalone',
			scope: '/',
			theme_color: themeColor,
			shortcuts,
			description,
			screenshots
		}

		fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2))
	} catch (error) {
		// console.error(error)
	}
}

// console.log('Generating manifest.json')

fs.mkdir(iconsDirectory, { recursive: true }, (err) => {
	if (err) {
		return
		// console.error(err)
	}
})

main()
