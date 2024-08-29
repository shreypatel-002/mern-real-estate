import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vercel from 'vite-plugin-vercel';

// https://vitejs.dev/config/
export default defineConfig({

  server:{
    host:"0.0.0.0",
    proxy:{
      '/api':{
        target:'http://localhost:3500',
        secure:false,
        changeOrigin: true,
      },

    },
  },

  plugins: [react(),vercel()],
});
