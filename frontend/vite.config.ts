import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true,
    host: true, // Allow external access
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'helpdesk.hubblehox.ai',
      '.hubblehox.ai', // Allow all subdomains
    ],
    // Only use proxy in local development
    ...(mode === 'development' && process.env.NODE_ENV !== 'production' ? {
      proxy: {
        '/api': {
          target: 'http://localhost:3003',
          changeOrigin: true,
        },
      },
    } : {}),
    hmr: {
      host: 'localhost',
      port: 3001,
      protocol: 'ws',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
  },
}))