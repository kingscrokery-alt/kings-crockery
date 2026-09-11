@echo off
chcp 65001 >nul
echo ========================================================
echo   Kings Crockery - 1-Click Update Live Website
echo ========================================================
echo.
echo 1. Checking for changes...
git status -s
echo.
echo 2. Saving all changes...
git add .
git commit -m "Update website: %date% %time%"
echo.
echo 3. Sending updates to live website (via GitHub & AWS Amplify)...
git push origin main
if %ERRORLEVEL% EQU 0 (
    echo.
echo ========================================================
echo   SUCCESS!
echo   AWS Amplify has received your changes and is now
echo   automatically updating the live site.
echo.
echo   Your updates will be live at:
echo   https://kingscrockery.com
echo   within 1-2 minutes!
echo ========================================================
) else (
    echo.
echo [ERROR] Push failed. Please check your internet connection.
)
echo.
pause
