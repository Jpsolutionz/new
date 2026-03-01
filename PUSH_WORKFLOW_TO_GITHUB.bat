@echo off
color 0A
cls
echo.
echo ========================================
echo   PUSHING WORKFLOW TO GITHUB NOW
echo ========================================
echo.
echo This will push the updated workflow file
echo so GitHub Actions can start building!
echo.
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo Adding workflow file...
git add .github/workflows/build-android.yml

echo.
echo Committing...
git commit -m "Update workflow: Use expo prebuild for android folder"

echo.
echo Pushing to GitHub...
git push origin master

echo.
echo ========================================
echo   DONE! CHECK GITHUB ACTIONS NOW!
echo ========================================
echo.
echo Go to: https://github.com/Jpsolutionz/new/actions
echo.
echo You should see a NEW build starting!
echo It will take 10-15 minutes to complete.
echo.
echo ========================================
pause
