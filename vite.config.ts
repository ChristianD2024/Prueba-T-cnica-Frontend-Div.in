   import { defineConfig } from 'vite'
   import vue from '@vitejs/plugin-vue'
   import { resolve } from 'path'

   // Fix para ESM: __dirname
   import { fileURLToPath, URL } from 'node:url'
   const __dirname = path.dirname(fileURLToPath(import.meta.url))

   export default defineConfig({
     plugins: [vue()],
     resolve: {
       alias: {
         '@': resolve(__dirname, './src'),
         'vue': 'vue/dist/vue.esm-bundler.js'
       }
     }
   })
   