import js from '@eslint/js';
import globals from 'globals';
import vitest from '@vitest/eslint-plugin';
import { importX } from 'eslint-plugin-import-x';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	{
		ignores: ['coverage/', 'precomputed/', 'node_modules/'],
	},
	js.configs.recommended,
	importX.flatConfigs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
			},
		},
		plugins: {
			'import-x': importX,
		},
		rules: {
			'brace-style': ['warn', 'stroustrup', { allowSingleLine: true }],
			'curly': ['error', 'multi-line'],
			'class-methods-use-this': ['off'],
			'indent': ['error', 'tab'],
			'max-len': ['warn', { code: 160 }],
			'no-param-reassign': ['off'],
			'no-return-assign': ['error', 'except-parens'],
			'no-tabs': ['error', { allowIndentationTabs: true }],
			'no-unused-vars': 'warn',
			'no-use-before-define': ['off'],
			'no-warning-comments': ['warn', { terms: ['fixme'] }],
			'object-curly-newline': ['error', { multiline: true }],
			'quotes': ['error', 'single', { avoidEscape: true }],

			'import-x/no-unresolved': 'error',
			'import-x/order': [
				'warn',
				{
					'alphabetize': {
						caseInsensitive: true,
						order: 'asc',
					},
					'groups': ['external', 'builtin', 'parent', ['sibling', 'index']],
					'newlines-between': 'never',
					'pathGroups': [
						{
							group: 'external',
							pattern: 'react',
							position: 'before',
						},
						{
							group: 'external',
							pattern: '@/**',
							position: 'after',
						},
					],
					'pathGroupsExcludedImportTypes': ['builtin'],
				},
			],
		},
	},
	{
		files: ['**/*.test.js', '**/*.spec.js'],
		plugins: { vitest },
		rules: {
			...vitest.configs.recommended.rules,
			'eol-last': ['error', 'never'],
			'vitest/no-disabled-tests': 'off', // TODO restore vitest/no-disabled-tests
			'vitest/no-standalone-expect': ['error', { additionalTestBlockFunctions: ['afterEach', 'beforeEach'] }],
		},
	},
	eslintConfigPrettier,
];
