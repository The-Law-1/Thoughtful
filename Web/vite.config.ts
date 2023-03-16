import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "url";

export default ({ mode }) => {

    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return defineConfig({
    
      plugins: [vue()],
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
      },
      server: {
        port: 3000,
        proxy: {
          "^/api": {
            target: process.env.BACKEND_URL || "http://localhost:8080",
            ws: true,
            rewrite: (path) => path.replace("/api", ""),
          },
        },
      }
    })
};

// https://vitejs.dev/config/
