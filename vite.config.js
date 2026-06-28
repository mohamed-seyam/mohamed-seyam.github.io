import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

// User GitHub Pages site (mohamed-seyam.github.io) is served from the domain
// root, so the base path is '/'. Two real pages: home and the full projects list.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: `${root}index.html`,
        projects: `${root}projects.html`,
      },
    },
  },
})
