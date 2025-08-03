@echo off
echo Running cleanup for deployment...
node scripts/cleanup-for-deploy.js
echo.
echo If there were no errors, your project is ready for Netlify deployment!
pause
