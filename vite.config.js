import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures all asset paths are relative for Live Server (127.0.0.1:5500)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
