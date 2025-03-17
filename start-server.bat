REM filepath: c:\Users\bibas\2025-03-16\Sample website\start-server.bat
@echo off
echo =====================================================
echo Nepal Infrastructure Projects Website Server Launcher
echo =====================================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Node.js found. Starting Node.js server...
    echo.
    echo This will start a web server to serve the website locally.
    echo Once started, you can access the site at http://localhost:3000
    echo.
    echo Press Ctrl+C to stop the server when done.
    echo.
    node server.js
    goto end
)

REM Check for Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Python found. Starting Python server...
    echo.
    python server.py
    goto end
)

REM Check for Python as py (Windows Python Launcher)
where py >nul 2>nul
if %errorlevel% equ 0 (
    echo Python found (py launcher). Starting Python server...
    echo.
    py server.py
    goto end
)

REM If we get here, neither Node.js nor Python is available
echo ERROR: No server software found.
echo.
echo This website requires either:
echo  - Node.js (preferred): https://nodejs.org/
echo  - Python: https://www.python.org/
echo.
echo Please install one of these and try again.
echo.
echo Alternatively, you can use Visual Studio Code with the Live Server extension.
echo.
echo For immediate testing, open index.html directly in your browser,
echo but note that some features requiring data loading may not work.

:end
pause