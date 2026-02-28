@echo off
echo ========================================================================
echo   STOPPING EXPO SERVICE
echo ========================================================================
echo.

echo   Killing all Node.js processes (including Expo)...
taskkill /F /IM node.exe 2>nul

if %ERRORLEVEL% EQU 0 (
    echo.
    echo   ✓ Expo service stopped successfully!
) else (
    echo.
    echo   No Node.js processes found (Expo may already be stopped)
)

echo.
pause
