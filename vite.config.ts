import { defineConfig, splitVendorChunkPlugin } from "vite";

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		splitVendorChunkPlugin(),
		react(),
		tsconfigPaths(),
		eslintPlugin(),
	],
	build: {
		sourcemap: true,
		target: 'esnext'
	},
	server: {
		proxy: {
			"/api": {
				target: "http://192.168.0.106:607/api/",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, "")
			},
		}
	}
});
