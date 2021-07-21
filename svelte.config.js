import node from '@sveltejs/adapter-node'

const config = {
	kit: {
		adapter: {
			adapt() {
				node()
			},
		},
		vite: {
			server: {
				proxy: {
					'/api': 'https://api.litekart.in',
				},
			},
			ssr: {
				noExternal: ['svelte-hero-icons'],
			},
		},
	},
}

export default config
