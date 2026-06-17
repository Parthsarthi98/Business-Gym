import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Single-page app. The /api folder is served by Vercel as serverless functions
// in production; during local `vite dev` it is not run (free-text grading needs
// the deployed function or `vercel dev`).
export default defineConfig({
  plugins: [react()],
});
