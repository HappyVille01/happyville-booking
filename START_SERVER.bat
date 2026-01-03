@echo off
echo Starting HappyVille Local Server...
echo.
echo Server will start at: http://localhost:8000
echo.
echo Open your browser and go to:
echo   http://localhost:8000/index.html (Customer Booking)
echo   http://localhost:8000/admin.html (Admin Dashboard)
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
python -m http.server 8000
