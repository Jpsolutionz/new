@echo off
echo ========================================================================
echo   BUILD ANDROID APK
echo ========================================================================
echo.
echo   This will build your app as a standalone Android APK.
echo   The build happens in the cloud and takes 10-20 minutes.
echo.
echo   Requirements:
echo   - EAS CLI installed (run INSTALL_EAS.bat if not installed)
echo   - Expo account (will prompt to login/register)
echo.

cd /d "%~dp0"

echo   Checking if EAS CLI is installed...
eas --version >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo   ✗ EAS CLI not found!
    echo.
    echo   Please run INSTALL_EAS.bat first to install EAS CLI.
    echo.
    pause
    exit /b 1
)

echo   ✓ EAS CLI found
echo.

echo   Checking login status...
eas whoami >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo   You need to login to Expo first.
    echo.
    echo   If you don't have an account, you can create one now.
    echo.
    eas login
    echo.
)

echo.
echo   Starting build...
echo   This will take 10-20 minutes.
echo.
echo   You can close this window and check status later with:
echo   CHECK_BUILD_STATUS.bat
echo.

eas build -p android --profile preview

echo.
echo ========================================================================
echo   BUILD SUBMITTED!
echo ========================================================================
echo.
echo   Your build is now in progress.
echo.
echo   When complete, you'll get a download link for the APK.
echo   Download it and install on your Android phone.
echo.
echo   To check build status, run: CHECK_BUILD_STATUS.bat
echo.

pause
