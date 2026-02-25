import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/static": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      "/signapi": {
        target: "http://127.0.0.1:5005",
        changeOrigin: true,
        secure: false,
        rewrite: (proxyPath) => proxyPath.replace(/^\/signapi/, ""),
      },
      "/sign": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (proxyPath) => {
          const withoutPrefix = proxyPath.replace(/^\/sign\/?/, "/static/");
          return withoutPrefix.endsWith(".mp4") ? withoutPrefix : `${withoutPrefix}.mp4`;
        },
      },
    },
  },
  build: {
    outDir: "../static/frontend",
    emptyOutDir: true,
  },
});
