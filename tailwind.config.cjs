/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/tw-elements/dist/js/**/*.js'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#ecf3fb' /* very very light blue */,
					100: '#ccdef4' /* very light blue */,
					200: '#accaed' /* light blue */,
					500: '#112D4E' /* blue */,
					600: '#0a1a2e' /* dark blue */,
					700: '#03080e' /* more darker blue */
				},
				secondary: {
					100: '#cccccc' /* light gray */,
					500: '#1F2937' /* gray-800 */,
					600: '#000000' /* black */
				},
				accent: {
					100: '#ffffd8' /* light-yellow */,
					500: '#FFFF00' /* yellow-500 */,
					900: '#eb0000;' // red
				}
			},

			animation: {
				float: 'float 6s linear infinite',
				scale: 'scale 6s ease-in infinite',
				fade: 'fade 6s linear infinite',
				dropdown: 'dropdown 0.3s linear',
				slide: 'slide 0.3s ease-in-out'
			},

			keyframes: {
				float: {
					'0%': { transform: 'translateY(0px)' },
					'100%': { transform: 'translateY(-100px)' }
				},
				scale: {
					'0%': { transform: 'scale(1)' },
					'90%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(0)' }
				},
				fade: {
					'0%': { opacity: '1' },
					'70%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				dropdown: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'50%': { transform: 'translateY(-5px)', opacity: '0.3' },
					'100%': { transform: 'translateY(0px)', opacity: '1' }
				},
				slide: {
					'0%': { transform: 'translateX(10px)', opacity: '0' },
					'50%': { transform: 'translateX(5px)', opacity: '0.3' },
					'100%': { transform: 'translateX(0px)', opacity: '1' }
				}
			},
			fontFamily: {}
		}
	},
	plugins: [
		require('tw-elements/dist/plugin'),
		require('tailwind-scrollbar'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/line-clamp')
	]
}
