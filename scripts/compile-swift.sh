#!/usr/bin/env bash
set -xe

# Ensure bin directory exists
mkdir -p bin

# Compile for ARM64
echo "🔨 Compiling for ARM64..."
swiftc -target arm64-apple-macos10.14 src/bin/MacKeyServer/main.swift -o bin/MacKeyServer-arm64

# Compile for x86_64
echo "🔨 Compiling for x86_64..."
swiftc -target x86_64-apple-macos10.14 src/bin/MacKeyServer/main.swift -o bin/MacKeyServer-x86_64

# Create universal binary
echo "🔗 Creating universal binary..."
lipo -create bin/MacKeyServer-arm64 bin/MacKeyServer-x86_64 -output bin/MacKeyServer

# Verify the universal binary
echo "✅ Verifying universal binary..."
lipo -info bin/MacKeyServer

# Clean up intermediate files
echo "🧹 Cleaning up..."
rm bin/MacKeyServer-arm64 bin/MacKeyServer-x86_64

echo "✅ Swift compilation completed successfully!"
