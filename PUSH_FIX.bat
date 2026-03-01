@echo off
cd /d "C:\Users\HP\Downloads\new\new\JustPerfectSolutionz"
git add .
git commit -m "Fix Gradle timeout with increased timeout and caching"
git push origin master
echo.
echo DONE! Check: https://github.com/Jpsolutionz/new/actions
pause
