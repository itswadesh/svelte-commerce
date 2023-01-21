/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f8efed' /* very very light rose gold */,
					100: '#f3e3df' /* very light rose gold */,
					200: '#edd6d1' /* light rose gold */,
					500: '#d2988a' /* rose gold */,
					600: '#d8a598' /* dark rose gold */,
					700: '#B8843F' /* more darker rose gold */
				},
				secondary: {
					100: '#f8e2ff' /* light purple */,
					500: '#df80ff' /* purple */,
					600: '#da6cff' /* dark purple */
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
		require('tailwind-scrollbar'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/line-clamp')
	]
}
