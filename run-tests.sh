#!/bin/bash

# Install required dependencies if they're not present
echo "Checking for required dependencies..."
npm list @testing-library/react @testing-library/jest-dom jsdom || npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom

# Run the tests
echo "Running tests..."
npm test -- --ui