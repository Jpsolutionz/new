@echo off
echo ========================================================================
echo BUILD ANDROID APK - ONE CLICK SOLUTION
echo ========================================================================
echo.
echo This will build your Perfect Ledger app as an Android APK file.
echo.
echo What happens:
echo 1. Check if EAS CLI is installed (install if needed)
echo 2. Login to Expo account
echo 3. Start cloud build
echo 4. Give you download link when ready
echo.
echo Build takes 10-20 minutes.
echo ========================================================================
echo.

cd /d "%~dp0"

echo Step 1: Checking EAS CLI...
echo.

where eas >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo EAS CLI not found. Installing now...
    echo This may take a few minutes...
    echo.
    call npm install -g eas-cli
    echo.
    echo EAS CLI installed!
    echo.
) else (
    echo EAS CLI already installed!
    echo.
)

echo Step 2: Building APK...
echo.
echo You'll be asked to login to Expo.
echo If you don't have an account, you can create one for free.
echo.
pause

echo.
echo Starting build...
echo.
call eas build -p android --profile preview

echo.
echo ========================================================================
echo BUILD STARTED!
echo.
echo The build is running in the cloud.
echo You'll get a download link when it's ready (10-20 minutes).
echo.
echo You can close this window and check your email for the link.
echo Or visit: https://expo.dev/accounts/[your-account]/projects/perfect-ledger/builds
echo ========================================================================
echo.

pause
