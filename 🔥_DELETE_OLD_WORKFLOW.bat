@echo off
color 0A
cls
echo.
echo ========================================
echo   FIX: DELETE OLD WORKFLOW FILE
echo ========================================
echo.
echo PROBLEM FOUND:
echo There were TWO workflow files!
echo.
echo 1. build-android.yml (GOOD - has v4)
echo 2. build-apk.yml (BAD - has v3)
echo.
echo GitHub was running the OLD one!
echo.
echo SOLUTION:
echo Delete the old build-apk.yml file
echo Keep only build-android.yml
echo.
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo Step 1: Removing old workflow file...
git rm .github/workflows/build-apk.yml

echo.
echo Step 2: Committing deletion...
git commit -m "Remove old workflow with deprecated v3 actions"

echo.
echo Step 3: Pushing to GitHub...
git push origin master

echo.
echo ========================================
echo   DONE! OLD WORKFLOW DELETED!
echo ========================================
echo.
echo Now GitHub will use ONLY build-android.yml
echo which has all v4 actions!
echo.
echo Go to: https://github.com/Jpsolutionz/new/actions
echo.
echo You should see a NEW build starting!
echo This time it will use v4 (not v3)
echo.
echo Wait 10-15 minutes for build to complete.
echo.
echo ========================================
pause
