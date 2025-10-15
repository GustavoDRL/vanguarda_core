import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('❌ Proxy error:', err.message)
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('→ Proxying:', req.method, req.url, '→', options.target + req.url)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('← Proxy response:', proxyRes.statusCode, req.url)
          })
        }
      }
    },
    hmr: {
      overlay: true
    },
    cors: true
  }
})
