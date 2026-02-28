@echo off
color 0A
echo.
echo ========================================
echo FIX GIT AND PUSH TO GITHUB
echo ========================================
echo.

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo Step 1: Checking Git initialization...
if not exist ".git" (
    echo Git not initialized. Initializing now...
    git init
    git branch -M main
)

echo.
echo Step 2: Setting remote URL...
git remote remove origin 2>nul
git remote add origin https://github.com/Jpsolutionz/new.git

echo.
echo Step 3: Checking remote...
git remote -v

echo.
echo Step 4: Adding all files...
git add -A
git add -f .github/

echo.
echo Step 5: Checking what will be committed...
git status

echo.
echo Step 6: Committing...
git commit -m "Add all project files with workflow"

echo.
echo Step 7: Pushing to GitHub...
echo Trying main branch...
git push -u origin main --force

if errorlevel 1 (
    echo.
    echo Main failed, trying master...
    git push -u origin master --force
)

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Now check: https://github.com/Jpsolutionz/new
echo.
pause
