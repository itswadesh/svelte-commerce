const tailwindcss = require("tailwindcss");

// only needed if you want to purge
const purgecss = require("@fullhuman/postcss-purgecss")({
    content: ["./src/**/*.svelte", "./src/**/*.html"],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

module.exports = {
    plugins: [
        tailwindcss("./tailwind.config.js"),

        // only needed if you want to purge
        ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
    ]
};