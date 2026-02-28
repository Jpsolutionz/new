@echo off
echo ========================================================================
echo   INSTALLING EAS CLI
echo ========================================================================
echo.
echo   This will install Expo Application Services CLI globally.
echo   You only need to do this once.
echo.

echo   Installing EAS CLI...
echo.

npm install -g eas-cli

if %ERRORLEVEL% EQU 0 (
    echo.
    echo   ✓ EAS CLI installed successfully!
    echo.
    echo   Next steps:
    echo   1. Run: BUILD_APK.bat to build your APK
    echo   2. Or manually run: eas login
    echo.
) else (
    echo.
    echo   ✗ Installation failed!
    echo   Make sure Node.js and npm are installed.
    echo.
)

pause
