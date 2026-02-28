@echo off
color 0A
echo.
echo ========================================
echo PUSH FILES TO GITHUB
echo ========================================
echo.
echo This will push all your code to GitHub.
echo.
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo Checking Git status...
git status

echo.
echo Adding all files...
git add -A

echo.
echo Committing...
git commit -m "Add all project files including workflow"

echo.
echo Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo Main branch failed, trying master...
    git push origin master
)

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Now check: https://github.com/Jpsolutionz/new
echo You should see all your files!
echo.
pause
