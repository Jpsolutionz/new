@echo off
echo ========================================================================
echo STARTING REACT NATIVE APP
echo ========================================================================
echo.
echo This will start the Expo development server.
echo.
echo After it starts, you can:
echo - Press 'w' to open in web browser
echo - Press 'a' for Android emulator
echo - Scan QR code with Expo Go app on your phone
echo.
echo ========================================================================
echo.

cd /d "%~dp0"

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo.
    echo node_modules not found. Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    echo.
    echo Installation complete!
    echo.
)

echo Starting Expo...
echo.
npm start

pause
