import { defineConfig, splitVendorChunkPlugin } from "vite";

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

	return {
		plugins: [
			splitVendorChunkPlugin(),
			react(),
			tsconfigPaths(),
			mode !== "production" && eslintPlugin(),
		],
		define: {
			__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
		},
		build: {
			sourcemap: mode !== "production",
			minify: "esbuild",
			target: "esnext",
		},
		resolve: {
			alias: {
				"@styles": "/src/shared/style",
			}
		},
		server: {
			proxy: {
				"/api": {
					target: process.env.VITE_API_PROXY_TARGET ?? "http://localhost:4041",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			}
		}
	};
});
