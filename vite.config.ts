/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/japanese-kana-learning/',
  plugins: [react(), tailwindcss()],
  server: {
    // Agent worktrees under .claude/worktrees are full app copies; edits there reload this dev server.
    // Anchored to this root so a dev server started inside a worktree still watches its own files.
    watch: { ignored: [`${path.resolve(__dirname, '.claude')}/**`] },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['src/test/setup.ts'],
  },
});
