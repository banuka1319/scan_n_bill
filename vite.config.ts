import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Prioritize the API_KEY from loadEnv, then process.env, then check for VITE_API_KEY as a fallback
  const apiKey = env.API_KEY || process.env.API_KEY || env.VITE_API_KEY || process.env.VITE_API_KEY;

  return {
    plugins: [react()],
    define: {
      // This ensures process.env.API_KEY is available in your client-side code
      // We map whatever variable we found to process.env.API_KEY to satisfy the SDK requirement
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});
