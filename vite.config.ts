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
			eslintPlugin(),
		],
		build: {
			sourcemap: mode !== "production",
			minify: "esbuild",
			target: "esnext"
		},
		resolve: {
			alias: {
				"@styles": "/src/shared/style",
			}
		},
		server: {
			proxy: {
				"/api": {
					target: "http://192.168.0.108:5050/api/",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, "")
				},
			}
		}
	};
});
