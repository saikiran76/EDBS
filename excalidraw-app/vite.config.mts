import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, process.cwd(), '');
  const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || '';
  
  return {
    root: __dirname,
    base: "./",
    define: {
      'process.env': {
        VITE_APP_GIT_SHA: JSON.stringify(gitSha),
        VITE_APP_ENABLE_TRACKING: JSON.stringify(true),
      },
      'import.meta.env.VITE_APP_GIT_SHA': JSON.stringify(gitSha)
    },
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
          'es6-promise-pool',
          'fuzzy',
          'tunnel-rat',
          'fractional-indexing',
          '@excalidraw/mermaid-to-excalidraw',
          '@radix-ui/react-popover',
          '@radix-ui/react-tabs'
        ]
      }
    },
    plugins: [
      react(),
      svgrPlugin(),
      ViteEjsPlugin(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true
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
