@echo off
echo Updating imports in the codebase...
echo.

set FILES_TO_UPDATE=^
src\components\auth\UserProfileButton.jsx^
src\components\auth\AuthModal.jsx^
src\components\ui\CreditsDisplay.jsx^
src\components\tabs\ModernGenerateTab.jsx^
src\components\tabs\ModernMasonryHistoryTab.jsx^
src\components\auth\LoginForm.jsx^
src\components\auth\RegisterForm.jsx^
src\components\projects\SaveProjectModal.jsx^
src\components\gallery\ImageModal.jsx^
src\hooks\useUserImages.js^
src\pages\GalleryPage.jsx

for %%F in (%FILES_TO_UPDATE%) do (
    echo Processing %%F...
    powershell -Command "(Get-Content -Path '%%F') -replace 'import \{ useAuthContext \} from \''\.\.\/\.\.\/contexts\/AuthContext'\'';', 'import { useAuthContext } from ''../../contexts/AuthContextV2'';' | Set-Content -Path '%%F'"
    powershell -Command "(Get-Content -Path '%%F') -replace 'import \{ useAuthContext \} from \''\.\.\/contexts\/AuthContext'\'';', 'import { useAuthContext } from ''../contexts/AuthContextV2'';' | Set-Content -Path '%%F'"
    
    REM Also update API service imports
    powershell -Command "(Get-Content -Path '%%F') -replace 'import \{(.*?)\} from \''\.\.\/\.\.\/api\/imageService'\'';', 'import {$1} from ''../../api/imageServiceV2'';' | Set-Content -Path '%%F'"
    powershell -Command "(Get-Content -Path '%%F') -replace 'import \{(.*?)\} from \''\.\.\/api\/imageService'\'';', 'import {$1} from ''../api/imageServiceV2'';' | Set-Content -Path '%%F'"
    
    powershell -Command "(Get-Content -Path '%%F') -replace 'import \{(.*?)\} from \''\.\.\/\.\.\/api\/creditsService'\'';', 'import {$1} from ''../../api/creditsServiceV2'';' | Set-Content -Path '%%F'"
    powershell -Command "(Get-Content -Path '%%F') -replace 'import \{(.*?)\} from \''\.\.\/api\/creditsService'\'';', 'import {$1} from ''../api/creditsServiceV2'';' | Set-Content -Path '%%F'"
    
    powershell -Command "(Get-Content -Path '%%F') -replace 'import \{(.*?)\} from \''\.\.\/\.\.\/api\/userService'\'';', 'import {$1} from ''../../api/userServiceV2'';' | Set-Content -Path '%%F'"
    powershell -Command "(Get-Content -Path '%%F') -replace 'import \{(.*?)\} from \''\.\.\/api\/userService'\'';', 'import {$1} from ''../api/userServiceV2'';' | Set-Content -Path '%%F'"
)

echo.
echo Import updates completed. 
echo.
echo Press any key to exit.
pause > nul
