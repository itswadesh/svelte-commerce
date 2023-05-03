/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f0f0f2', // zinc shades
					100: '#e6e6e9',
					200: '#dcdce0',
					500: '#18181B',
					600: '#0f0f11',
					700: '#060606'
				},
				secondary: {
					100: '#e1e6f4', // slate shades
					500: '#0F172A',
					600: '#0a0f1c'
				},
				accent: {
					100: '#ffffed', // light-yellow
					500: '#ffffed', // yellow
					900: '#ff1414' // red
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
	plugins: [require('tailwind-scrollbar'), require('@tailwindcss/typography')]
}
