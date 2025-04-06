import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
        port: 5173
    },
    test: {
        include: ['./src/tests/**/*.test.tsx'],
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/tests/setup.ts',
    },
})
