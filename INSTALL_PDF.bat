@echo off
echo ========================================================================
echo   INSTALLING PDF LIBRARIES
echo ========================================================================
echo.
echo   Installing expo-print and expo-sharing...
echo.

cd /d "%~dp0"

call npm install

echo.
echo ========================================================================
echo   Installation complete!
echo   Now restart the app with: npm start
echo ========================================================================
echo.
pause
