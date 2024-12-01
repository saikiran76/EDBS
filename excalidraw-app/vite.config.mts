import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";
import Sitemap from "vite-plugin-sitemap";
import path from "path";

export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, `../`);
  
  return {
    root: __dirname,
    base: "./",
    resolve: {
      alias: {
        '@excalidraw/excalidraw': path.resolve(__dirname, '../packages/excalidraw/src/index.ts'),
      }
    },
    build: {
      outDir: "build",
      assetsDir: "assets",
      rollupOptions: {
        input: {
          app: path.resolve(__dirname, 'index.html')
        },
        external: [
          'pica', 
          'lodash.throttle',
          'path2d-polyfill',
        ]
      }
    },
    plugins: [
      react(),
      svgrPlugin(),
      ViteEjsPlugin(),
      createHtmlPlugin({
        inject: {
          data: {
            version: process.env.VITE_APP_GIT_SHA || 'dev'
          }
        }
      }),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: envVars.VITE_APP_ENABLE_PWA === "true",
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
        },
        manifest: {
          name: "Excalidraw",
          short_name: "Excalidraw",
          theme_color: "#000000",
          start_url: "./",
          display: "standalone",
          background_color: "#ffffff"
        }
      })
    ]
  };
});
