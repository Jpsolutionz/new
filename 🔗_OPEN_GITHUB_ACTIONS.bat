@echo off
color 0A
cls
echo.
echo ========================================
echo    OPENING GITHUB ACTIONS PAGE
echo ========================================
echo.
echo This will open your GitHub Actions page
echo where you can see the build status!
echo.
echo ========================================
echo.
pause

start https://github.com/Jpsolutionz/new/actions

echo.
echo ========================================
echo    PAGE OPENED IN BROWSER
echo ========================================
echo.
echo Look for:
echo.
echo 🟡 Yellow circle = Build running (wait)
echo ✅ Green checkmark = Build done (download APK)
echo ❌ Red X = Build failed (tell me)
echo.
echo ========================================
echo HOW TO DOWNLOAD APK
echo ========================================
echo.
echo 1. Click on the build with green checkmark
echo 2. Scroll to bottom
echo 3. Find "Artifacts" section
echo 4. Click "perfect-ledger-v2.1.0"
echo 5. APK downloads!
echo.
echo ========================================
pause
