/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#fbfbfb', // zinc shades
					100: '#f0f0f2',
					200: '#e6e6e9',
					500: '#18181B',
					600: '#0f0f11',
					700: '#060606'
				},
				secondary: {
					50: '#ff5a5a', // light red shades
					100: '#ffe3e3',
					200: '#ffd0d0',
					500: '#ff5a5a',
					600: '#ff4646',
					700: '#ff3333'
				},
				brand: {
					100: '#e2ffe2', // green shades
					500: '#008000',
					700: '#005900'
				},
				accent: {
					100: '#ffd8d8', // red shades
					500: '#ff0000',
					700: '#d80000'
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
			fontFamily: {
				sans: ['Montserrat', 'Karla', 'Poppins', 'Inter', 'Roboto', 'sans'] // 'sans' is a fallback font in case the custom font isn't available
			}
		}
	},
	plugins: [require('tailwind-scrollbar'), require('@tailwindcss/typography')]
}
