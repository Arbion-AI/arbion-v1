import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      https: "node:https",
      http: "node:http",
      url: "node:url",
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
