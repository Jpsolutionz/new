@echo off
color 0A
echo.
echo ========================================
echo PUSHING TO GITHUB NOW
echo ========================================
echo.

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo Step 1: Adding remote URL...
git remote add origin https://github.com/Jpsolutionz/new.git

echo.
echo Step 2: Adding all files...
git add -A

echo.
echo Step 3: Committing...
git commit -m "Add all project files with GitHub Actions workflow"

echo.
echo Step 4: Pushing to GitHub...
git push -u origin master --force

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Now go to: https://github.com/Jpsolutionz/new
echo Refresh the page - you should see all your files!
echo.
echo Then click "Actions" tab to see the build start!
echo.
pause
