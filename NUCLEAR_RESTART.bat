@echo off
echo ========================================================================
echo   NUCLEAR RESTART - Complete Cache Clear
echo ========================================================================
echo.
echo   This will:
echo   1. Kill all Metro bundler processes
echo   2. Delete .expo folder
echo   3. Delete node_modules/.cache
echo   4. Clear npm cache
echo   5. Start fresh
echo.
echo ========================================================================
echo.

echo Killing Metro bundler...
taskkill /F /IM node.exe 2>nul

echo.
echo Deleting .expo folder...
if exist ".expo" (
    rmdir /s /q ".expo"
    echo   .expo folder deleted
) else (
    echo   .expo folder not found
)

echo.
echo Deleting node_modules cache...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo   node_modules\.cache deleted
) else (
    echo   node_modules\.cache not found
)

echo.
echo Clearing npm cache...
call npm cache clean --force

echo.
echo ========================================================================
echo   Starting Metro bundler with --clear flag...
echo ========================================================================
echo.

npm start -- --clear

pause
