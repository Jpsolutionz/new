@echo off
color 0A
cls
echo.
echo ========================================
echo    PUSHING UPDATED WORKFLOW TO GITHUB
echo ========================================
echo.
echo You're right! There's no build from today!
echo The workflow hasn't been pushed yet!
echo.
echo Let's push it now!
echo.
echo ========================================
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo Step 1: Adding workflow file...
git add .github/workflows/build-android.yml

echo.
echo Step 2: Committing...
git commit -m "Fix: Use expo prebuild to create android folder"

echo.
echo Step 3: Pushing to GitHub...
git push origin master

echo.
echo ========================================
echo    DONE! BUILD WILL START NOW!
echo ========================================
echo.
echo Refresh the GitHub Actions page!
echo You'll see a NEW build starting!
echo.
echo https://github.com/Jpsolutionz/new/actions
echo.
echo Wait 10-15 minutes for it to complete!
echo.
echo ========================================
pause
