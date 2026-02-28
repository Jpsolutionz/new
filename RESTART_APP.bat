@echo off
echo ========================================================================
echo RESTARTING APP (File Fixed!)
echo ========================================================================
echo.
echo The corrupted LoginScreen.js file has been fixed.
echo Starting the app now...
echo.
echo After it starts, press 'w' to open in web browser
echo ========================================================================
echo.

cd /d "%~dp0"
npm start

pause
