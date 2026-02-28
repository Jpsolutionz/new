@echo off
echo ========================================
echo DIAGNOSING GIT ISSUE
echo ========================================
echo.

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo STEP 1: Checking if Git is initialized
echo ========================================
if exist ".git" (
    echo ✓ Git is initialized
) else (
    echo ✗ Git is NOT initialized
    echo.
    echo Initializing Git now...
    git init
    echo.
)

echo.
echo STEP 2: Checking remote URL
echo ========================================
git remote -v
echo.

echo.
echo STEP 3: Checking current branch
echo ========================================
git branch
echo.

echo.
echo STEP 4: Checking Git status
echo ========================================
git status
echo.

echo.
echo STEP 5: Checking what files exist
echo ========================================
dir /b src
echo.

echo.
echo STEP 6: Checking if android folder exists
echo ========================================
if exist "android" (
    echo ✓ Android folder exists
) else (
    echo ✗ Android folder does NOT exist
    echo This might cause build to fail!
)

echo.
echo ========================================
echo DIAGNOSIS COMPLETE
echo ========================================
echo.
echo Copy the output above and tell me what you see!
echo.
pause
