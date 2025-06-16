@echo off

REM Check if verbose mode is enabled
if "%VERBOSE%"=="true" (
    echo on
) else (
    echo off
)

echo 🔨 Starting Windows compilation...

REM Ensure build directory exists
if not exist build (
    echo 📁 Creating build directory...
    mkdir build
)

REM Check if source file exists
if not exist "native\WinKeyServer\main.cpp" (
    echo ❌ Source file not found: native\WinKeyServer\main.cpp
    exit /b 1
)

REM Compile the Windows key server
echo 🔨 Compiling WinKeyServer.exe...
c++ "native\WinKeyServer\main.cpp" -o "build\WinKeyServer.exe" -static

REM Check if compilation was successful
if %ERRORLEVEL% neq 0 (
    echo ❌ Compilation failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

REM Verify the binary was created
if exist "build\WinKeyServer.exe" (
    echo ✅ Windows compilation completed successfully!
    dir "build\WinKeyServer.exe"
) else (
    echo ❌ Binary not found after compilation
    exit /b 1
)
