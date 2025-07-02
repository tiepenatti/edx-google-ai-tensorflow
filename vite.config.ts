import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/edx-google-ai-tensorflow/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'fashion-mnist': ['src/data/fashion-mnist.ts'],
          'mnist-data': ['src/data/mnist-data.ts'],
        },
      },
    },
  },
})
