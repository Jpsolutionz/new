@echo off
color 0A
cls
echo.
echo ========================================
echo   FIX: DEPRECATED ARTIFACT ERROR
echo ========================================
echo.
echo ERROR FOUND:
echo "deprecated version of actions/upload-artifact: v3"
echo.
echo SOLUTION:
echo Update to v4 and push to GitHub
echo.
pause

cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo.
echo Step 1: Adding workflow file...
git add .github/workflows/build-android.yml

echo.
echo Step 2: Committing with force...
git commit -m "Fix: Update upload-artifact to v4 (deprecated v3)"

echo.
echo Step 3: Pushing to GitHub...
git push origin master

echo.
echo ========================================
echo   DONE! NEW BUILD WILL START!
echo ========================================
echo.
echo The workflow now uses:
echo - actions/upload-artifact@v4 (FIXED!)
echo.
echo Check: https://github.com/Jpsolutionz/new/actions
echo.
echo Wait 10-15 minutes for build to complete!
echo.
pause
