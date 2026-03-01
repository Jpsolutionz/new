@echo off
echo ========================================
echo PUSHING UPDATED WORKFLOW TO GITHUB
echo ========================================
echo.
echo This workflow will:
echo 1. Use bare React Native (NO EXPO)
echo 2. Create android folder using react-native init
echo 3. Build APK with proper package names
echo 4. Upload APK as artifact (v4 - no deprecation)
echo.
cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"

echo Adding workflow file...
git add .github/workflows/build-android.yml

echo Committing changes...
git commit -m "Fix workflow: use React Native CLI without Expo, update to artifact v4"

echo Pushing to GitHub...
git push

echo.
echo ========================================
echo DONE! Build will start automatically
echo ========================================
echo.
echo Check build status at:
echo https://github.com/Jpsolutionz/new/actions
echo.
echo Build takes 10-15 minutes
echo Download APK from Artifacts section when done
echo.
pause
