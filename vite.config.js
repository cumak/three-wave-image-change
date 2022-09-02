// vite.config.js
import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [glsl()],
  base:'/three-wave-image-change/',
  build:{
    outDir: "docs",
  }
});