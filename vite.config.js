import { sveltekit } from '@sveltejs/kit/vite'
import { HTTP_ENDPOINT } from './src/lib/config/env.js'
import svg from '@poppanator/sveltekit-svg'

const svgPlugin = svg({
	svgoOptions: {
		plugins: [
			{
				name: 'preset-default',
				params: {
					overrides: {
						removeViewBox: false
					}
				}
			},
			'removeDimensions'
		]
	}
})

// console.log('HTTP_ENDPOINT................', HTTP_ENDPOINT)

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), svgPlugin],
	server: {
		proxy: {
			'/graphql': HTTP_ENDPOINT,
			'/api': HTTP_ENDPOINT,
			'/images': HTTP_ENDPOINT
		}
	}
}

export default config
