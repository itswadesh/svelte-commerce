// vite.config.js
import { sveltekit } from "file:///D:/lk/lk/sc/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { defineConfig, loadEnv } from "file:///D:/lk/lk/sc/node_modules/vite/dist/node/index.js";
import { SvelteKitPWA } from "file:///D:/lk/lk/sc/node_modules/@vite-pwa/sveltekit/dist/index.mjs";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const HTTP_ENDPOINT = env.PUBLIC_LITEKART_API_URL || "https://api.litekart.in";
  return {
    plugins: [
      sveltekit(),
      SvelteKitPWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{ico,png,svg,webp}"]
        },
        srcDir: "./src",
        // mode: 'development',
        scope: "/",
        base: "/",
        devOptions: {
          // enabled: true,
          type: "module",
          navigateFallback: "/"
        },
        // if you have shared info in svelte config file put in a separate module and use it also here
        kit: {}
      })
      // partytownVite({
      // 	dest: join(process.cwd(), 'static', '~partytown')
      // })
    ],
    server: {
      https: false,
      host: true,
      port: 4173,
      proxy: {
        "/api": HTTP_ENDPOINT,
        "/sitemap": "https://s3.ap-south-1.amazonaws.com/litekart.in"
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxsa1xcXFxsa1xcXFxzY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcbGtcXFxcbGtcXFxcc2NcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2xrL2xrL3NjL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG4vLyBpbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcclxuLy8gaW1wb3J0IHsgcGFydHl0b3duVml0ZSB9IGZyb20gJ0BidWlsZGVyLmlvL3BhcnR5dG93bi91dGlscydcclxuaW1wb3J0IHsgU3ZlbHRlS2l0UFdBIH0gZnJvbSAnQHZpdGUtcHdhL3N2ZWx0ZWtpdCdcclxuLyoqIEB0eXBlIHtpbXBvcnQoJ3ZpdGUnKS5Vc2VyQ29uZmlnfSAqL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XHJcblx0Y29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJylcclxuXHRjb25zdCBIVFRQX0VORFBPSU5UID0gZW52LlBVQkxJQ19MSVRFS0FSVF9BUElfVVJMIHx8ICdodHRwczovL2FwaS5saXRla2FydC5pbidcclxuXHRyZXR1cm4ge1xyXG5cdFx0cGx1Z2luczogW1xyXG5cdFx0XHRzdmVsdGVraXQoKSxcclxuXHRcdFx0U3ZlbHRlS2l0UFdBKHtcclxuXHRcdFx0XHRyZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcclxuXHRcdFx0XHR3b3JrYm94OiB7XHJcblx0XHRcdFx0XHRnbG9iUGF0dGVybnM6IFsnKiovKi57aWNvLHBuZyxzdmcsd2VicH0nXVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0c3JjRGlyOiAnLi9zcmMnLFxyXG5cdFx0XHRcdC8vIG1vZGU6ICdkZXZlbG9wbWVudCcsXHJcblx0XHRcdFx0c2NvcGU6ICcvJyxcclxuXHRcdFx0XHRiYXNlOiAnLycsXHJcblx0XHRcdFx0ZGV2T3B0aW9uczoge1xyXG5cdFx0XHRcdFx0Ly8gZW5hYmxlZDogdHJ1ZSxcclxuXHRcdFx0XHRcdHR5cGU6ICdtb2R1bGUnLFxyXG5cdFx0XHRcdFx0bmF2aWdhdGVGYWxsYmFjazogJy8nXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQvLyBpZiB5b3UgaGF2ZSBzaGFyZWQgaW5mbyBpbiBzdmVsdGUgY29uZmlnIGZpbGUgcHV0IGluIGEgc2VwYXJhdGUgbW9kdWxlIGFuZCB1c2UgaXQgYWxzbyBoZXJlXHJcblx0XHRcdFx0a2l0OiB7fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQvLyBwYXJ0eXRvd25WaXRlKHtcclxuXHRcdFx0Ly8gXHRkZXN0OiBqb2luKHByb2Nlc3MuY3dkKCksICdzdGF0aWMnLCAnfnBhcnR5dG93bicpXHJcblx0XHRcdC8vIH0pXHJcblx0XHRdLFxyXG5cdFx0c2VydmVyOiB7XHJcblx0XHRcdGh0dHBzOiBmYWxzZSxcclxuXHRcdFx0aG9zdDogdHJ1ZSxcclxuXHRcdFx0cG9ydDogNDE3MyxcclxuXHRcdFx0cHJveHk6IHtcclxuXHRcdFx0XHQnL2FwaSc6IEhUVFBfRU5EUE9JTlQsXHJcblx0XHRcdFx0Jy9zaXRlbWFwJzogJ2h0dHBzOi8vczMuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2xpdGVrYXJ0LmluJ1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJOLFNBQVMsaUJBQWlCO0FBQ3JQLFNBQVMsY0FBYyxlQUFlO0FBR3RDLFNBQVMsb0JBQW9CO0FBRTdCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDbEQsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFFBQU0sZ0JBQWdCLElBQUksMkJBQTJCO0FBQ3JELFNBQU87QUFBQSxJQUNOLFNBQVM7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLGFBQWE7QUFBQSxRQUNaLGNBQWM7QUFBQSxRQUNkLFNBQVM7QUFBQSxVQUNSLGNBQWMsQ0FBQyx5QkFBeUI7QUFBQSxRQUN6QztBQUFBLFFBQ0EsUUFBUTtBQUFBO0FBQUEsUUFFUixPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUE7QUFBQSxVQUVYLE1BQU07QUFBQSxVQUNOLGtCQUFrQjtBQUFBLFFBQ25CO0FBQUE7QUFBQSxRQUVBLEtBQUssQ0FBQztBQUFBLE1BQ1AsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBLElBSUY7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNQLE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLFlBQVk7QUFBQSxNQUNiO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
