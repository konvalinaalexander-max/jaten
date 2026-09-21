import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' — damit der Build auch unter einem Unterpfad laeuft (Artefakt-Vorschau).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', assetsDir: 'assets' },
})
