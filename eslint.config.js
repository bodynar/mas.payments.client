import js from "@eslint/js";
import globals from "globals";

import { globalIgnores } from "eslint/config";

import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import customRules from "./eslint-rules/index.js";

export default tseslint.config([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		plugins: {
			react: pluginReact,
			custom: customRules,
		},
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
			pluginImport.flatConfigs.react,
			pluginReact.configs.flat.all,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: {
				...globals.browser,
				React: "readonly",
				JSX: "readonly",
				NodeJS: "readonly",
				__APP_VERSION__: "readonly",
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			"react/react-in-jsx-scope": 0,
			"no-unused-vars": 0,
			"react/jsx-indent": 0,
			"react/jsx-no-literals": 0,
			"react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always", allowReferrer: false }],
			"react/no-set-state": 0,
			"react/require-optimization": 0,
			"react/jsx-newline": 0,
			"react/jsx-max-depth": [1, { "max": 7 }],
			"react/jsx-sort-props": 0,
			"react/jsx-wrap-multilines": 0,
			"react/jsx-props-no-spreading": 0,
			"react/require-default-props": 0,
			"react/prefer-read-only-props": 0,
			"react/forbid-component-props": 0,
			"react/jsx-curly-newline": 0,
			"react/jsx-props-no-multi-spaces": 0,
			"react/hook-use-state": 0,
			"react/jsx-indent-props": 0,
			"react/function-component-definition": [2, { "namedComponents": "arrow-function" }],
			"react/jsx-filename-extension": [
				"warn",
				{
					"extensions": [
						".tsx"
					]
				}
			],
			"react/prop-types": "warn",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "error",
			"eol-last": "warn",
			"semi": "error",
			"custom/jsx-props-per-line": ["error", {
				"ignoreDataAttributes": false,
				"ignoreAriaAttributes": false
			}],
			"custom/optional-props-last": "warn",
			"custom/hooks-order": "warn",
			"custom/import-order": "warn",
			"custom/no-cross-module-imports": "error",
			"custom/functional-component-definition": "error",
			"custom/no-duplicate-imports": "error",
			"custom/no-snake-case": "error",
			"custom/component-pascal-case": "error",
			"custom/props-camel-case": "error",
			"custom/eslint-disable-require-reason": "error",
		},
		settings: {
			react: {
				version: "detect"
			},
		}
	},
]);
