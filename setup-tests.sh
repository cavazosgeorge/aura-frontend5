#!/bin/bash

echo "Setting up testing environment for User Account App..."

# Check current vitest version
VITEST_VERSION=$(grep -o '"vitest": *"[^"]*"' package.json | grep -o '"[^"]*"$' | tr -d '"')
echo "Current Vitest version: $VITEST_VERSION"

# Offer options
echo ""
echo "Choose an option to set up test coverage:"
echo "1) Upgrade Vitest to latest version (recommended)"
echo "2) Install coverage package with legacy peer dependencies"
echo "3) Use C8 coverage provider (alternative)"
echo "4) Skip coverage setup for now"
echo ""
read -p "Enter option (1-4): " OPTION

case $OPTION in
  1)
    echo "Upgrading Vitest and installing coverage package..."
    npm install --save-dev vitest@latest @vitest/coverage-v8
    ;;
  2)
    echo "Installing coverage package with legacy peer dependencies..."
    npm install --save-dev @vitest/coverage-v8 --legacy-peer-deps
    ;;
  3)
    echo "Installing C8 coverage provider..."
    npm install --save-dev @vitest/coverage-c8
    
    # Update package.json script
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      pkg.scripts['test:coverage'] = 'vitest run --coverage --provider=c8';
      fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
    "
    ;;
  4)
    echo "Skipping coverage setup."
    ;;
  *)
    echo "Invalid option. Exiting."
    exit 1
    ;;
esac

# Install testing-library dependencies for component testing
echo ""
echo "Do you want to set up component testing with React Testing Library?"
read -p "This will install @testing-library/react and related packages (y/n): " SETUP_COMPONENT

if [ "$SETUP_COMPONENT" == "y" ] || [ "$SETUP_COMPONENT" == "Y" ]; then
  echo "Installing React Testing Library packages..."
  npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
  
  # Update vitest config for component testing
  echo "Updating Vitest config for component testing..."
  cat > vitest.config.js << 'EOL'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
    css: true,
    deps: {
      inline: ['@chakra-ui/react'],
    }
  }
});
EOL

  # Update setup file
  cat > src/tests/setup.js << 'EOL'
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Add testing-library matchers to vitest expectations
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver which is used by some Chakra UI components
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

window.IntersectionObserver = MockIntersectionObserver;

// Mock window.matchMedia which is used by Chakra UI for responsive design
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
EOL

else
  echo "Skipping component testing setup."
fi

echo ""
echo "Setup complete! You can now run tests with: npm test"
if [ "$OPTION" != "4" ]; then
  echo "Run coverage with: npm run test:coverage"
fi
if [ "$SETUP_COMPONENT" == "y" ] || [ "$SETUP_COMPONENT" == "Y" ]; then
  echo "Component tests are now supported!"
fi
echo ""