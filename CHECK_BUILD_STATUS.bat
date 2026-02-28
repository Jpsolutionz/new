@echo off
echo ========================================================================
echo   CHECK BUILD STATUS
echo ========================================================================
echo.

cd /d "%~dp0"

echo   Checking your recent builds...
echo.

eas build:list --limit 5

echo.
echo   To view build details in browser, run:
echo   eas build:view [BUILD_ID]
echo.

pause
