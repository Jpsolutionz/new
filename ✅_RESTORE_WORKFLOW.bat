@echo off
color 0A
cls
echo.
echo ========================================
echo   RESTORE WORKFLOW TO GITHUB
echo ========================================
echo.
echo Don't worry! The workflow file is still
echo on your PC. We just need to push it back!
echo.
echo This will restore build-android.yml
echo to GitHub.
echo.
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo Step 1: Adding workflow file...
git add .github/workflows/build-android.yml

echo.
echo Step 2: Committing...
git commit -m "Restore workflow: build-android.yml with v4 actions"

echo.
echo Step 3: Pushing to GitHub...
git push origin master

echo.
echo ========================================
echo   WORKFLOW RESTORED!
echo ========================================
echo.
echo The workflow is back on GitHub!
echo.
echo Go to: https://github.com/Jpsolutionz/new/actions
echo.
echo A new build should start automatically!
echo.
echo Wait 10-15 minutes for it to complete.
echo.
echo ========================================
pause
