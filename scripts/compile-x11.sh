#!/usr/bin/env bash
set -e

# Check if verbose mode is enabled
VERBOSE=${VERBOSE:-false}
if [ "$VERBOSE" = "true" ]; then
    set -x
fi

echo "🔨 Starting Linux X11 compilation..."

# Ensure bin directory exists
echo "📁 Creating bin directory..."
mkdir -p bin

# Check if source file exists
if [ ! -f "src/bin/X11KeyServer/main.cpp" ]; then
    echo "❌ Source file not found: src/bin/X11KeyServer/main.cpp"
    exit 1
fi

# Compile the X11 key server
echo "🔨 Compiling X11KeyServer..."
c++ src/bin/X11KeyServer/main.cpp -o bin/X11KeyServer -lX11 -lXi -static-libgcc -static-libstdc++

# Verify the binary was created
if [ -f "bin/X11KeyServer" ]; then
    echo "✅ Binary created successfully"
    ls -la bin/X11KeyServer

    # Strip the binary to reduce size
    echo "🧹 Stripping binary..."
    strip bin/X11KeyServer

    echo "✅ Linux X11 compilation completed successfully!"
else
    echo "❌ Binary not found after compilation"
    exit 1
fi
