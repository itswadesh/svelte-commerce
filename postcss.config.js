const mode = process.env.NODE_ENV
const dev = mode === 'development'

module.exports = {
  plugins: [
    require('postcss-import')(),
    require('postcss-url')(),
    require('tailwindcss')('./tailwind.config.js'),
    require('autoprefixer')(),
    !dev &&
      require('@fullhuman/postcss-purgecss')({
        content: ['./src/**/*.svelte', './src/**/*.html'],
        defaultExtractor: (content) => {
          let matching = []

          const regulars = content.match(/[\w-/:%]+(?<!:)/g)
          const classDirectives = content.match(/(?<=class:)[\w-/:%]+(?<!:)/g)

          if (regulars) {
            matching.push(...regulars)
          }

          if (classDirectives) {
            matching.push(...classDirectives)
          }

          return matching
        },
      }),
    !dev && require('cssnano')({ preset: 'default' }),
  ],
}
