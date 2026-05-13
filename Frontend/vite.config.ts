import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  // Important for Vercel deployment (SPA routing)
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined, // Optional: helps with smaller chunks
      }
    }
  },

  base: './',   // Helps with asset paths on Vercel
})