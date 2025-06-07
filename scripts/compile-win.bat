@echo off
REM Ensure bin directory exists
if not exist bin mkdir bin

REM Compile the Windows key server
c++ "src\bin\WinKeyServer\main.cpp" -o "bin\WinKeyServer.exe" -static

REM Check if compilation was successful
if %ERRORLEVEL% neq 0 (
    echo Compilation failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)
