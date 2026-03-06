@echo off
REM dev-n8n Windows helper
cd /d "%~dp0..\n8n-docker"

echo Starting n8n stack with Docker Compose...
docker-compose up -d

echo Waiting 10 seconds for services to initialize...
timeout /t 10 >nul

echo Checking n8n health endpoint...
curl -f http://localhost:5678/healthz >nul 2>&1
if %errorlevel% equ 0 (
    echo n8n is healthy and ready.
) else (
    echo n8n failed to start correctly. Displaying logs:
    docker-compose logs n8n
)

echo.
echo To start the backend, run the following commands:
	echo    cd ..\backend && npm install && npm run dev
