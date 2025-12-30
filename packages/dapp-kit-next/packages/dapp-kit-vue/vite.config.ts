// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// Ship source types - nanostores symbols can't be emitted to .d.ts files

export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'DAppKitVue',
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
		},
		rollupOptions: {
			external: ['vue', '@mysten/dapp-kit-core', '@nanostores/vue', 'nanostores'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
});
