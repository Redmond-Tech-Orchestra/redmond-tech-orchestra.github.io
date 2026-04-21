import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Custom domain (CNAME) — site lives at root, so base = "/"
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: { port: 3000, strictPort: true },
});
