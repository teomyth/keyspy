#!/usr/bin/env bash
set -e

# Check if verbose mode is enabled
VERBOSE=${VERBOSE:-false}
if [ "$VERBOSE" = "true" ]; then
    set -x
fi

# Ensure build directory exists
mkdir -p build

# Compile for ARM64
echo "🔨 Compiling for ARM64..."
swiftc -target arm64-apple-macos10.14 native/MacKeyServer/main.swift -o build/MacKeyServer-arm64

# Compile for x86_64
echo "🔨 Compiling for x86_64..."
swiftc -target x86_64-apple-macos10.14 native/MacKeyServer/main.swift -o build/MacKeyServer-x86_64

# Create universal binary
echo "🔗 Creating universal binary..."
lipo -create build/MacKeyServer-arm64 build/MacKeyServer-x86_64 -output build/MacKeyServer

# Verify the universal binary
echo "✅ Verifying universal binary..."
lipo -info build/MacKeyServer

# Clean up intermediate files
echo "🧹 Cleaning up..."
rm build/MacKeyServer-arm64 build/MacKeyServer-x86_64

echo "✅ Swift compilation completed successfully!"
