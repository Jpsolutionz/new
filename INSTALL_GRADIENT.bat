@echo off
echo ========================================================================
echo   INSTALLING GRADIENT LIBRARY FOR COLORFUL DASHBOARD
echo ========================================================================
echo.
echo   This will install expo-linear-gradient for the new colorful design...
echo.

REM Change to the correct directory
cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo   Current directory: %CD%
echo.
echo   Running npm install...
echo.

call npm install

echo.
echo ========================================================================
echo   Installation complete!
echo.
echo   NEXT STEPS:
echo   1. If Metro bundler is running, press Ctrl+C to stop it
echo   2. Run: npm start
echo   3. Scan QR code on your phone
echo   4. Enjoy the new colorful and professional dashboard!
echo ========================================================================
echo.
pause
