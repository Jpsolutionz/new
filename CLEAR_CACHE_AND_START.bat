@echo off
echo ========================================================================
echo   CLEARING CACHE AND RESTARTING APP
echo ========================================================================
echo.

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo   Clearing Metro bundler cache...
call npx react-native start --reset-cache

pause
