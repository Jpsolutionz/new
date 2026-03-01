@echo off
color 0A
cls
echo.
echo ========================================
echo   FINAL FIX: PUSH V4 WORKFLOW
echo ========================================
echo.
echo This will push the workflow file with v4
echo to GitHub and trigger a new build.
echo.
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo Step 1: Checking current workflow file...
type .github\workflows\build-android.yml | findstr "upload-artifact"

echo.
echo Step 2: Adding workflow file...
git add .github/workflows/build-android.yml

echo.
echo Step 3: Committing with v4...
git commit -m "Fix: Ensure upload-artifact@v4 is used (not v3)"

echo.
echo Step 4: Pushing to GitHub...
git push origin master

echo.
echo ========================================
echo   DONE! V4 WORKFLOW PUSHED!
echo ========================================
echo.
echo Go to: https://github.com/Jpsolutionz/new/actions
echo.
echo A new build will start automatically!
echo This time it should use v4!
echo.
echo Wait 10-15 minutes for build to complete.
echo.
echo If it still fails with v3 error, then
echo GitHub is caching the old version.
echo.
echo ========================================
pause
