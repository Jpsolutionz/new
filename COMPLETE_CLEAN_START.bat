@echo off
echo ========================================================================
echo COMPLETE CLEAN RESTART
echo ========================================================================
echo.
echo This will:
echo 1. Delete Metro bundler cache
echo 2. Delete Expo cache
echo 3. Start fresh
echo.
echo ========================================================================
echo.

cd /d "%~dp0"

echo Step 1: Deleting .expo cache folder...
if exist ".expo" (
    rmdir /s /q ".expo"
    echo Done!
) else (
    echo No .expo folder found
)

echo.
echo Step 2: Deleting node_modules/.cache...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo Done!
) else (
    echo No cache found
)

echo.
echo Step 3: Starting Expo with --clear flag...
echo.
npx expo start --clear

pause
