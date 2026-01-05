import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VuiDappKit',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: [
        'vue',
        '@mysten/sui',
        '@mysten/wallet-standard',
        '@mysten/utils',
        '@tanstack/vue-query',
        '@vueuse/core',
        'pinia',
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
