@echo off
color 0A
cls
echo.
echo ========================================
echo   PUSH CODE AND START NEW BUILD
echo ========================================
echo.
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo Adding all files...
git add .

echo.
echo Committing...
git commit -m "Trigger new build with updated workflow"

echo.
echo Pushing to GitHub...
git push origin master

echo.
echo ========================================
echo   DONE! BUILD STARTING NOW!
echo ========================================
echo.
echo Go to: https://github.com/Jpsolutionz/new/actions
echo.
echo You'll see a new build starting!
echo.
echo Wait 10-15 minutes for it to complete.
echo.
echo If it fails, click on it to see the error.
echo.
echo ========================================
pause
