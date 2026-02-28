@echo off
echo ========================================================================
echo   STARTING EXPO AS BACKGROUND SERVICE
echo ========================================================================
echo.
echo   Expo will run in the background and auto-restart if it crashes!
echo.

cd /d "%~dp0"

echo   Checking dependencies...
if not exist "node_modules\" (
    echo.
    echo   node_modules not found. Installing dependencies...
    echo   This may take a few minutes...
    echo.
    call npm install
    echo.
    echo   Installation complete!
    echo.
)

echo.
echo   Starting Expo service in background...
echo.

REM Start the service in a new window
start "Expo Frontend Service" python auto_restart_expo.py

echo.
echo   ✓ Expo service started in new window!
echo.
echo   The Expo server is now running and will auto-restart if it crashes.
echo   Check expo_service.log for details.
echo.
echo   Scan the QR code in the Expo window with your phone.
echo.
echo   To stop the service, close the Expo window or run: STOP_EXPO_SERVICE.bat
echo.

pause
