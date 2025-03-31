import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Check if testing-library packages are installed
const hasTestingLibrary = (() => {
  try {
    const packageJsonPath = path.resolve('./package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const devDependencies = packageJson.devDependencies || {};
    const dependencies = packageJson.dependencies || {};
    
    const hasDeps = (
      devDependencies['@testing-library/react'] || 
      dependencies['@testing-library/react']
    );
    
    return hasDeps;
  } catch (e) {
    console.error('Error checking dependencies:', e.message);
    return false;
  }
})();

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: hasTestingLibrary ? 'jsdom' : 'node',
    setupFiles: ['./src/tests/setup.js'],
    css: true,
    deps: {
      optimizer: {
        web: {
          include: ['@chakra-ui/react']
        }
      }
    }
  }
});