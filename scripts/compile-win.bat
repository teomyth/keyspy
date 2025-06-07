@echo off
echo 🔨 Starting Windows compilation...

REM Ensure bin directory exists
if not exist bin (
    echo 📁 Creating bin directory...
    mkdir bin
)

REM Check if source file exists
if not exist "src\bin\WinKeyServer\main.cpp" (
    echo ❌ Source file not found: src\bin\WinKeyServer\main.cpp
    exit /b 1
)

REM Compile the Windows key server
echo 🔨 Compiling WinKeyServer.exe...
c++ "src\bin\WinKeyServer\main.cpp" -o "bin\WinKeyServer.exe" -static

REM Check if compilation was successful
if %ERRORLEVEL% neq 0 (
    echo ❌ Compilation failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

REM Verify the binary was created
if exist "bin\WinKeyServer.exe" (
    echo ✅ Windows compilation completed successfully!
    dir "bin\WinKeyServer.exe"
) else (
    echo ❌ Binary not found after compilation
    exit /b 1
)
