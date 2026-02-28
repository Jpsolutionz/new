@echo off
echo ========================================================================
echo CLEARING CACHE AND RESTARTING
echo ========================================================================
echo.
echo Step 1: Clearing Metro bundler cache...
cd /d "%~dp0"
npx expo start --clear
echo.
echo After it starts, press 'w' to open in web browser
echo ========================================================================
pause
