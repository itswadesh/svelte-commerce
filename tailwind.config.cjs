const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					50: '#e6f0fc' /* very very light blue */,
					100: '#cee1fa' /* very light blue */,
					200: '#b5d2f8' /* light blue */,
					500: '#0a6ce8' /* blue */,
					600: '#0961d0' /* dark blue */,
					700: '#0856b9' /* more darker blue */
				},
				secondary: {
					100: '#cccccc' /* light gray */,
					500: '#1F2937' /* gray-800 */,
					600: '#000000' /* black */
				},
				accent: {
					100: '#fee2e2' /* light-red */,
					500: '#f59e0b' /* yellow-500 */,
					900: '#eb0000;' // red
				}
			},

			animation: {
				float: 'float 6s linear infinite',
				wiggle: 'wiggle 6s linear infinite',
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
				wiggle: {
					'0%': { transform: 'translateX(0px)' },
					'100%': { transform: 'translateX(-20px)' }
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
			fontFamily: {
				sans: ['Montserrat']
			}
		}
	},

	plugins: [
		require('tailwind-scrollbar'),
		require('daisyui'),
		require('@tailwindcss/forms'),
		require('tailwindcss-rtl'),
		require('@tailwindcss/typography')
	]
}

module.exports = config
