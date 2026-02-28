@echo off
echo ========================================
echo PUSH CODE TO GITHUB
echo ========================================
echo.
echo This will push your code to GitHub!
echo.
pause

echo.
echo What is your GitHub repository URL?
echo.
echo Example: https://github.com/YOUR_USERNAME/perfect-ledger.git
echo.
set /p REPO_URL="Enter your repository URL: "

echo.
echo ========================================
echo STEP 1: Updating package.json
echo ========================================
echo.
echo Backing up current package.json...
copy package.json package.json.expo.backup

echo Copying new package.json (without Expo)...
copy package.json.new package.json

echo Done!
echo.

echo ========================================
echo STEP 2: Initializing Git
echo ========================================
echo.
git init
echo Done!
echo.

echo ========================================
echo STEP 3: Adding files
echo ========================================
echo.
git add .
echo Done!
echo.

echo ========================================
echo STEP 4: Creating commit
echo ========================================
echo.
git commit -m "Initial commit - React Native with HTTPS support"
echo Done!
echo.

echo ========================================
echo STEP 5: Adding remote repository
echo ========================================
echo.
git remote add origin %REPO_URL%
echo Done!
echo.

echo ========================================
echo STEP 6: Pushing to GitHub
echo ========================================
echo.
echo This may ask for your GitHub username and password...
echo.
git branch -M main
git push -u origin main

echo.
echo ========================================
echo SUCCESS!
echo ========================================
echo.
echo Your code is now on GitHub!
echo.
echo NEXT STEPS:
echo.
echo 1. Go to your repository: %REPO_URL:~0,-4%
echo 2. Click "Actions" tab
echo 3. Wait 10-15 minutes for build
echo 4. Download APK from "Artifacts"
echo.
pause
