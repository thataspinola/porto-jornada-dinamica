import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@porto-stack/ui': fileURLToPath(
        new URL('./test/mocks/portoUi.tsx', import.meta.url)
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    clearMocks: true,
    pool: 'forks',
    maxWorkers: 2,
    css: { modules: { classNameStrategy: 'non-scoped' } },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/test/**', 'src/**/*.d.ts'],
      thresholds: { lines: 90, statements: 90, functions: 90, branches: 90 },
    },
    include: ['src/**/test/**/*.spec.{ts,tsx}'],
    setupFiles: ['./config/vitest/setup.ts'],
  },
})
