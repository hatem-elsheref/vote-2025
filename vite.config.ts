import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // For GitHub Pages: if your repo is username.github.io, use '/'
  // If your repo is username.github.io/repo-name, use '/repo-name/'
  // Set via environment variable VITE_BASE_PATH or default to '/vote-2025/'
  const base = process.env.VITE_BASE_PATH || '/vote-2025/';

  return {
    base: base,
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api/election": {
          target: "https://proxy.elections.eg",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/election/, "/election"),
          secure: true,
        },
      },
    },
    preview: {
      host: "::",
      port: 8080,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
