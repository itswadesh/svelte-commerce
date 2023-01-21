// vite.config.js
import { sveltekit } from "file:///D:/AAA/svelte-commerce/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { defineConfig, loadEnv } from "file:///D:/AAA/svelte-commerce/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const HTTP_ENDPOINT = env.PUBLIC_HTTP_ENDPOINT || "https://api.litekart.in";
  return {
    plugins: [sveltekit()],
    server: {
      host: true,
      port: 3e3,
      proxy: {
        "/api": HTTP_ENDPOINT
      }
    },
    define: {
      global: {}
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxBQUFcXFxcc3ZlbHRlLWNvbW1lcmNlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxBQUFcXFxcc3ZlbHRlLWNvbW1lcmNlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BQUEvc3ZlbHRlLWNvbW1lcmNlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbi8qKiBAdHlwZSB7aW1wb3J0KCd2aXRlJykuVXNlckNvbmZpZ30gKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcblx0Y29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJylcblx0Y29uc3QgSFRUUF9FTkRQT0lOVCA9IGVudi5QVUJMSUNfSFRUUF9FTkRQT0lOVCB8fCAnaHR0cHM6Ly9hcGkubGl0ZWthcnQuaW4nXG5cdHJldHVybiB7XG5cdFx0cGx1Z2luczogW3N2ZWx0ZWtpdCgpXSxcblx0XHRzZXJ2ZXI6IHtcblx0XHRcdGhvc3Q6IHRydWUsXG5cdFx0XHRwb3J0OiAzMDAwLFxuXHRcdFx0cHJveHk6IHtcblx0XHRcdFx0Jy9hcGknOiBIVFRQX0VORFBPSU5UXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRkZWZpbmU6IHtcblx0XHRcdGdsb2JhbDoge31cblx0XHR9XG5cdH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBQLFNBQVMsaUJBQWlCO0FBQ3BSLFNBQVMsY0FBYyxlQUFlO0FBRXRDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDbEQsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFFBQU0sZ0JBQWdCLElBQUksd0JBQXdCO0FBQ2xELFNBQU87QUFBQSxJQUNOLFNBQVMsQ0FBQyxVQUFVLENBQUM7QUFBQSxJQUNyQixRQUFRO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTixRQUFRO0FBQUEsTUFDVDtBQUFBLElBQ0Q7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNQLFFBQVEsQ0FBQztBQUFBLElBQ1Y7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
