@echo off
echo ========================================
echo ADDING WEB SUPPORT TO YOUR APP
echo ========================================
echo.
echo Installing web dependencies...
call npm install react-dom react-native-web

echo.
echo ========================================
echo WEB SUPPORT ADDED!
echo ========================================
echo.
echo To run on web browser:
echo   npm run web
echo.
echo Your app will open in browser at:
echo   http://localhost:8081
echo.
pause
