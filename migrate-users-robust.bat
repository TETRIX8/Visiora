@echo off
setlocal EnableDelayedExpansion

echo ===============================================
echo   Visiora Database Migration Tool
echo ===============================================
echo.
echo This tool will migrate your database from the old structure to the new one:
echo  - Convert single credit type to free/paid credits
echo  - Migrate image storage paths to the flattened structure
echo.
echo Press any key to continue, or Ctrl+C to cancel...
pause > nul
echo.

echo Checking prerequisites...

:: Check if the service account key exists
if not exist "service-account-key.json" (
  echo ERROR: service-account-key.json file not found!
  echo Please place your Firebase service account key file in the project root directory.
  echo.
  echo Migration aborted. Press any key to exit.
  pause > nul
  exit /b 1
)

echo Service account key found.
echo.
echo Starting migration process...
echo.

:: Run the migration script
node scripts/migrate-users-esm.js

if !ERRORLEVEL! neq 0 (
  echo.
  echo ERROR: Migration script encountered an error (code !ERRORLEVEL!).
  echo.
  echo Possible solutions:
  echo  1. Make sure your service account key has admin privileges
  echo  2. Check that firebase-admin is installed (npm install firebase-admin --save-dev)
  echo  3. For any other issues, check the error message above
  echo.
  echo Migration failed. Press any key to exit.
  pause > nul
  exit /b 1
)

echo.
echo ===============================================
echo   Migration Completed Successfully!
echo ===============================================
echo.
echo Next Steps:
echo  1. Replace creditsService.js with creditsServiceV2.js
echo  2. Replace AuthContext.jsx with AuthContextV2.jsx
echo  3. Update UI components to display both free and paid credits
echo.
echo Press any key to exit.
pause > nul
exit /b 0
