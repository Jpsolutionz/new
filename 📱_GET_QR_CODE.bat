@echo off
cls
echo ========================================================================
echo   STARTING EXPO - GET QR CODE
echo ========================================================================
echo.
echo This will start the Expo development server and show you a QR code.
echo.
echo STEPS:
echo 1. Wait for the QR code to appear in your browser
echo 2. Open "Expo Go" app on your phone
echo 3. Scan the QR code with Expo Go
echo 4. Your app will load on your phone
echo.
echo IMPORTANT: Phone and computer must be on the same WiFi!
echo.
echo ========================================================================
echo.

cd /d "%~dp0"
npm start

pause
