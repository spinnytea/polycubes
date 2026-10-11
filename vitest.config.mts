import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		clearMocks: true,
		restoreMocks: true,
		coverage: {
			provider: 'v8',
			reporter: ['html'],
			reportsDirectory: 'coverage',
			include: ['**/*.js'],
			exclude: ['__mocks__/**', '**/node_modules/**', 'coverage/**', 'precomputed/**'],
		},
		exclude: ['**/node_modules/**'],
	},
});
