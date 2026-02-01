@echo off
echo Attempting Force Push to GitHub...
echo.
echo WARNING: This will overwrite the repository at https://github.com/YoonHyunsoo/lifetycoon.git
echo with the files currently on your computer.
echo.
git push -u origin main --force
echo.
echo If you see "Everything up-to-date" or a success message, it worked!
pause
