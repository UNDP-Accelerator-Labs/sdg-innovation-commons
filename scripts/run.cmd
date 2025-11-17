@echo off
REM Start heartbeat in background, then start the main worker in foreground
SET SCRIPT_DIR=%~dp0
IF EXIST "%SCRIPT_DIR%\worker_heartbeat.js" (
  start /b node "%SCRIPT_DIR%\worker_heartbeat.js" >> "%SCRIPT_DIR%\worker_heartbeat.log" 2>&1
)
node "%SCRIPT_DIR%\process_exports.cjs" >> "%SCRIPT_DIR%\worker.log" 2>&1
