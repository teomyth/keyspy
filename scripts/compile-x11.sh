#!/usr/bin/env bash
set -e

# Check if verbose mode is enabled
VERBOSE=${VERBOSE:-false}
if [ "$VERBOSE" = "true" ]; then
    set -x
fi

echo "🔨 Starting Linux X11 compilation..."

# Ensure build directory exists
echo "📁 Creating build directory..."
mkdir -p build

# Check if source file exists
if [ ! -f "native/X11KeyServer/main.cpp" ]; then
    echo "❌ Source file not found: native/X11KeyServer/main.cpp"
    exit 1
fi

# Compile the X11 key server
echo "🔨 Compiling X11KeyServer..."
c++ native/X11KeyServer/main.cpp -o build/X11KeyServer -lX11 -lXi -static-libgcc -static-libstdc++

# Verify the binary was created
if [ -f "build/X11KeyServer" ]; then
    echo "✅ Binary created successfully"
    ls -la build/X11KeyServer

    # Strip the binary to reduce size
    echo "🧹 Stripping binary..."
    strip build/X11KeyServer

    echo "✅ Linux X11 compilation completed successfully!"
else
    echo "❌ Binary not found after compilation"
    exit 1
fi
