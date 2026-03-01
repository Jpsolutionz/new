@echo off
color 0A
cls
echo.
echo ========================================
echo   TRIGGER NEW BUILD ON GITHUB
echo ========================================
echo.
echo This will push a change to trigger
echo a new build on GitHub Actions
echo.
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo Step 1: Making sure workflow is added...
git add .github/workflows/build-android.yml
git add app.json

echo.
echo Step 2: Committing...
git commit -m "Trigger build: Fix upload-artifact v4" --allow-empty

echo.
echo Step 3: Pushing to GitHub...
git push origin master

echo.
echo ========================================
echo   BUILD TRIGGERED!
echo ========================================
echo.
echo Go to: https://github.com/Jpsolutionz/new/actions
echo.
echo You should see a NEW build starting now!
echo.
echo Wait 10-15 minutes for it to complete.
echo.
echo If it fails again, click on it to see
echo which step has the red X.
echo.
echo ========================================
pause
