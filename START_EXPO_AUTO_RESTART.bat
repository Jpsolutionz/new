@echo off
echo ========================================================================
echo   AUTO-RESTART EXPO FRONTEND
echo ========================================================================
echo.
echo   Expo will start and automatically restart if it crashes!
echo   Keep this window open!
echo.
echo   After Expo starts, scan the QR code with Expo Go app
echo.
echo   Press CTRL+C to stop completely
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
echo   Starting auto-restart monitor...
echo.

python auto_restart_expo.py

pause
