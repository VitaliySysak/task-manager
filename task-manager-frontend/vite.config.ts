import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inject-git-commit',
        transformIndexHtml(html) {
          const commitHash = env.VITE_GIT_HASH! || 'dev';

          return html.replace('<head>', `<head>\n    <meta name="x-git-commit" content="${commitHash}" />`);
        },
      },
    ],
    server: {
      host: true,
      port: 3000,
      allowedHosts: true,
    },
    preview: {
      host: true,
      port: 3000,
      allowedHosts: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
