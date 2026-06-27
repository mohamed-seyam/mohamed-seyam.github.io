import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User GitHub Pages site (mohamed-seyam.github.io) is served from the domain
// root, so the base path is '/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
