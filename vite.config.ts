import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

export default defineConfig({
  // @ts-ignore
  plugins: [react()],
  test: {
    globals: true,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  server: {
    allowedHosts: ['enjoeneer.dev']
  },
  base: '/astar-visualizer'
})
