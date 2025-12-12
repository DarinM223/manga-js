import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve(__dirname, 'index.ts')
      }
    }
  },
  preload: {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/preload/index.ts')
      }
    }
  },
  renderer: {
    // Uses 'src/renderer' directory by default.
    server: {
      proxy: {
        '^/preloaded/.*': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/preloaded/, ''),
        }
      }
    },
    resolve: {
      alias: {
        path: "path-browserify"
      }
    }
  }
})