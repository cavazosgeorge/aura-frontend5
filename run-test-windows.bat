@echo off
REM Windows batch file to run the app in a way that avoids HMR issues
REM This is a workaround for isolated environments

echo Starting the app with HMR disabled...

REM Set environment variables to disable HMR and websocket connections
set VITE_DISABLE_HMR=true

REM Run in production mode to disable development features
npm run dev:windows

REM If above fails, try this alternative
REM npx vite --force --mode production