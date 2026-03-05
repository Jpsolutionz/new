@echo off
echo ========================================
echo   BUILD APK LOCALLY
echo ========================================
echo.

cd /d "%~dp0JustPerfectSolutionz"

echo Installing dependencies...
call npm install

echo.
echo Checking for Expo CLI...
where expo >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Expo CLI globally...
    call npm install -g expo-cli
)

echo.
echo Building APK...
echo This may take 10-15 minutes...
echo.

call npx eas build --platform android --local --non-interactive --output=./app.apk

echo.
echo ========================================
if exist app.apk (
    echo SUCCESS! APK created at:
    echo %cd%\app.apk
    echo.
    echo You can now install this on your phone
) else (
    echo.
    echo Note: If EAS failed, we'll try alternative method...
    echo Please check the error messages above
)
echo ========================================
pause
