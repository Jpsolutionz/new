@echo off
echo ========================================
echo BUILD DESKTOP APP FOR WINDOWS
echo ========================================
echo.

echo Step 1: Building web version...
call npx expo export:web

echo.
echo Step 2: Installing Electron...
call npm install electron electron-builder --save-dev

echo.
echo Step 3: Building Windows executable...
call npm run build-windows

echo.
echo ========================================
echo DESKTOP APP BUILT!
echo ========================================
echo.
echo Your Windows app is in: dist\
echo Look for: Perfect Ledger Setup.exe
echo.
echo Users can install this .exe file on any Windows PC!
echo.
pause
