import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'extension',
    lib: {
      entry: resolve(__dirname, 'extension/content/content.js'),
      name: 'RakshAIContent',
      formats: ['iife'],
      fileName: () => 'content.bundle.js'
    }
  }
});
