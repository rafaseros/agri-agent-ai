import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Tailwind v4 plugs straight into Vite — no postcss.config, no tailwind.config.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The heavy vendors (recharts, leaflet) live in lazily-loaded view chunks
    // (Analytics / Map), not the initial bundle. Raise the ceiling so those
    // isolated, on-demand chunks aren't flagged.
    chunkSizeWarningLimit: 600,
  },
});
