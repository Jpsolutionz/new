@echo off
echo ========================================================================
echo   BUILD APK LOCALLY (WITHOUT CLOUD)
echo ========================================================================
echo.
echo   This builds the APK on your computer.
echo   Requires: Android Studio, Java JDK
echo.
echo   If you don't have these installed, use BUILD_APK.bat instead
echo   (cloud build - much easier!)
echo.

cd /d "%~dp0"

echo   Step 1: Checking if Android SDK is installed...
echo.

if not defined ANDROID_HOME (
    echo   ✗ ANDROID_HOME not set!
    echo.
    echo   You need to install Android Studio first.
    echo   Download from: https://developer.android.com/studio
    echo.
    echo   After installing, set ANDROID_HOME environment variable to:
    echo   C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    echo.
    pause
    exit /b 1
)

echo   ✓ ANDROID_HOME found: %ANDROID_HOME%
echo.

echo   Step 2: Checking Java...
echo.

java -version >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo   ✗ Java not found!
    echo.
    echo   Install Java JDK 17 from: https://adoptium.net/
    echo.
    pause
    exit /b 1
)

echo   ✓ Java found
echo.

echo   Step 3: Running prebuild...
echo   This creates the android/ folder with native code.
echo.

call npx expo prebuild --platform android

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo   ✗ Prebuild failed!
    echo.
    pause
    exit /b 1
)

echo.
echo   ✓ Prebuild complete
echo.

echo   Step 4: Building APK...
echo   This may take 5-10 minutes...
echo.

cd android

call gradlew assembleRelease

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo   ✗ Build failed!
    echo.
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================================================
echo   BUILD COMPLETE!
echo ========================================================================
echo.
echo   APK Location:
echo   android\app\build\outputs\apk\release\app-release.apk
echo.
echo   Transfer this file to your Android phone and install it!
echo.

pause
