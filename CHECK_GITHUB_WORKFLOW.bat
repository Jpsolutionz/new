@echo off
echo ========================================
echo CHECK GITHUB WORKFLOW STATUS
echo ========================================
echo.

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo Checking if .github folder exists locally...
if exist ".github\workflows\build-android.yml" (
    echo ✅ Workflow file EXISTS locally
) else (
    echo ❌ Workflow file NOT FOUND locally
    pause
    exit /b 1
)

echo.
echo Checking Git status...
git status

echo.
echo ========================================
echo SOLUTION: FORCE ADD .GITHUB FOLDER
echo ========================================
echo.
echo The .github folder might not have been pushed.
echo Let's force add it and push again.
echo.
pause

echo Adding .github folder...
git add -f .github/

echo.
echo Checking what will be committed...
git status

echo.
echo Committing...
git commit -m "Add GitHub Actions workflow"

echo.
echo Pushing to GitHub...
git push

echo.
echo ========================================
echo ✅ DONE!
echo ========================================
echo.
echo Now go to: https://github.com/Jpsolutionz/new
echo Click "Actions" tab
echo You should see the workflow running!
echo.
echo If you still see "Get started with GitHub Actions",
echo make one more small change:
echo.
echo   echo. ^>^> README.md
echo   git add .
echo   git commit -m "Trigger workflow"
echo   git push
echo.
pause
