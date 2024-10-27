import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Important: Enable HMR and React Refresh in Docker
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    }
  },
  // Add base URL to match Nginx location
  base: '/dowellcubes/'
})
