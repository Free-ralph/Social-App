import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: { manifest: true },
  base: process.env.VITE_mode === "production" ? "/static/" : "/",
  plugins: [react()],
});