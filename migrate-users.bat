@echo off
echo Running Visiora user migration script...
echo.

node scripts/migrate-users-esm.js

echo.
echo Migration completed. Press any key to exit.
pause > nul
