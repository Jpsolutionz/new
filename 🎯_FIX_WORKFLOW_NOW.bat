@echo off
color 0C
cls
echo.
echo ========================================
echo   URGENT: RESTORE WORKFLOW
echo ========================================
echo.
echo WHAT HAPPENED:
echo The workflow files got removed from GitHub
echo.
echo GOOD NEWS:
echo They're still on your PC!
echo We just need to push them back!
echo.
echo ========================================
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo Checking current status...
git status

echo.
echo ========================================
echo   RESTORING WORKFLOW FILES
echo ========================================
echo.

echo Step 1: Adding workflow files back...
git add .github/workflows/

echo.
echo Step 2: Committing...
git commit -m "Restore workflow files to GitHub"

echo.
echo Step 3: Pushing to GitHub...
git push origin master --force

echo.
echo ========================================
echo   WORKFLOW RESTORED!
echo ========================================
echo.
echo Go to: https://github.com/Jpsolutionz/new/actions
echo.
echo You should see workflows appearing again!
echo A new build will start automatically!
echo.
echo ========================================
pause
