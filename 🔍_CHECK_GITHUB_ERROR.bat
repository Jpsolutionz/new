@echo off
color 0E
cls
echo.
echo ========================================
echo    CHECKING GITHUB ACTIONS ERROR
echo ========================================
echo.
echo This will open GitHub Actions page
echo so you can see the exact error!
echo.
echo ========================================
echo.
pause

start https://github.com/Jpsolutionz/new/actions

echo.
echo ========================================
echo    INSTRUCTIONS
echo ========================================
echo.
echo 1. Look for the build with RED X (❌)
echo.
echo 2. Click on it
echo.
echo 3. You'll see which step failed:
echo    - Checkout code?
echo    - Install dependencies?
echo    - Create Android folder?
echo    - Build Android Release APK?
echo    - Upload APK?
echo.
echo 4. Click on the failed step
echo.
echo 5. Read the error message (in red)
echo.
echo 6. Copy the error and tell me!
echo.
echo ========================================
echo COMMON ERRORS
echo ========================================
echo.
echo ERROR 1: "deprecated version of actions/upload-artifact"
echo → Already fixed with v4
echo.
echo ERROR 2: "npm ERR! code ERESOLVE"
echo → Dependency conflict
echo.
echo ERROR 3: "Android folder not found"
echo → Need to create it properly
echo.
echo ERROR 4: "Gradle build failed"
echo → Build configuration issue
echo.
echo ERROR 5: "expo: command not found"
echo → Need to install expo-cli
echo.
echo ========================================
echo.
echo After you see the error, tell me:
echo - Which step failed?
echo - What's the error message?
echo.
echo Then I can fix it properly!
echo.
echo ========================================
pause
