@echo off
echo ========================================================================
echo   INSTALLING PDF LIBRARIES
echo ========================================================================
echo.
echo   This will install expo-print and expo-sharing...
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
echo   4. Test the PDF download button
echo ========================================================================
echo.
pause
