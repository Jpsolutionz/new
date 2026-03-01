@echo off
color 0B
cls
echo.
echo ========================================
echo    BUILD APK WITH EAS (EASIEST WAY)
echo ========================================
echo.
echo GitHub Actions failing? Use EAS instead!
echo.
echo This will:
echo 1. Install EAS CLI
echo 2. Help you login
echo 3. Build APK in Expo cloud
echo 4. Give you download link
echo.
echo ========================================
echo.
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo ========================================
echo STEP 1: Installing EAS CLI
echo ========================================
echo.
echo This takes 1-2 minutes...
echo.

npm install -g eas-cli

echo.
echo ========================================
echo STEP 2: Login to Expo
echo ========================================
echo.
echo If you don't have an Expo account,
echo create one at: https://expo.dev
echo.
echo Enter your email and password:
echo.

eas login

echo.
echo ========================================
echo STEP 3: Building APK
echo ========================================
echo.
echo This will upload your code to Expo
echo and build APK in the cloud.
echo.
echo Takes 10-15 minutes.
echo.
echo Press any key to start build...
pause >nul

eas build --platform android --profile preview

echo.
echo ========================================
echo BUILD STARTED!
echo ========================================
echo.
echo You'll get a download link when done!
echo.
echo You can also check build status at:
echo https://expo.dev
echo.
echo ========================================
pause
