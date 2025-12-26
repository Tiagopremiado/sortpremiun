
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

// Lê o package.json para pegar a versão automaticamente
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo (development/production)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': env,
      // Injeta a versão do package.json no cliente
      'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    },
    server: {
      port: 3000,
      host: true
    }
  };
});
