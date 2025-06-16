#!/usr/bin/env node

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

// Platform detection - can be overridden by command line argument
const targetPlatform = process.argv.includes("--platform")
  ? process.argv[process.argv.indexOf("--platform") + 1]
  : process.platform;
const platform = targetPlatform;
const arch = process.arch;

function log(message) {
  console.log(`[keyspy-build] ${message}`);
}

function error(message) {
  console.error(`[keyspy-build] ERROR: ${message}`);
}

function success(message) {
  console.log(`[keyspy-build] ✅ ${message}`);
}

function checkDependencies() {
  log("🔍 Checking build dependencies...");

  switch (platform) {
    case "darwin":
      try {
        execSync("which swiftc", { stdio: "ignore" });
        log("✅ Swift compiler found");
        return true;
      } catch {
        error("Swift compiler not found. Please install Xcode or Xcode Command Line Tools.");
        return false;
      }

    case "linux":
      try {
        execSync("which c++", { stdio: "ignore" });
        log("✅ C++ compiler found");

        // Check for X11 development libraries
        try {
          execSync("pkg-config --exists x11 xi", { stdio: "ignore" });
          log("✅ X11 development libraries found");
          return true;
        } catch {
          error("X11 development libraries not found. Please install libx11-dev and libxi-dev.");
          return false;
        }
      } catch {
        error("C++ compiler not found. Please install build-essential or equivalent.");
        return false;
      }

    case "win32":
      try {
        execSync("where c++", { stdio: "ignore" });
        log("✅ C++ compiler found");
        return true;
      } catch {
        error("C++ compiler not found. Please install MinGW-w64 or Visual Studio Build Tools.");
        return false;
      }

    default:
      error(`Unsupported platform: ${platform}`);
      return false;
  }
}

function buildForCurrentPlatform() {
  log(`🔨 Building for ${platform}-${arch}...`);

  // Ensure build directory exists
  const buildDir = path.join(__dirname, "..", "build");
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    log("📁 Created build directory");
  }

  // Check if --verbose flag is passed
  const verbose = process.argv.includes("--verbose") || process.argv.includes("-v");
  const stdio = verbose ? "inherit" : "pipe";

  // Set environment variable for scripts
  const env = {
    ...process.env,
    VERBOSE: verbose ? "true" : "false",
  };

  try {
    let result;
    switch (platform) {
      case "darwin":
        log("🍎 Building macOS binary...");
        if (!verbose) log("   Compiling Swift code for ARM64 and x86_64...");
        result = execSync("bash scripts/compile-swift.sh", {
          stdio,
          env,
          cwd: path.join(__dirname, ".."),
        });
        if (!verbose && result) {
          // Show only the important output
          const output = result.toString();
          const lipoInfo = output.match(/Architectures in the fat file[^\n]*/);
          if (lipoInfo) {
            log(`   ${lipoInfo[0]}`);
          }
        }
        success("macOS binary built successfully!");
        break;

      case "linux":
        log("🐧 Building Linux binary...");
        if (!verbose) log("   Compiling C++ code with X11 libraries...");
        result = execSync("bash scripts/compile-x11.sh", {
          stdio,
          env,
          cwd: path.join(__dirname, ".."),
        });
        success("Linux binary built successfully!");
        break;

      case "win32":
        log("🪟 Building Windows binary...");
        if (!verbose) log("   Compiling C++ code with MinGW...");
        result = execSync("scripts\\compile-win.bat", {
          stdio,
          env,
          cwd: path.join(__dirname, ".."),
        });
        success("Windows binary built successfully!");
        break;

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (err) {
    error(`Build failed: ${err.message}`);
    if (!verbose) {
      log("");
      log("💡 Run with --verbose to see detailed build output:");
      log("   npm run build:native -- --verbose");
    }
    process.exit(1);
  }
}

function main() {
  log(`🚀 Starting native build for ${platform}-${arch}`);

  // Check if we're in development mode
  const isDev =
    process.env.NODE_ENV !== "production" && fs.existsSync(path.join(__dirname, "..", "src"));

  if (!isDev) {
    log("⚠️  Not in development environment, skipping native build");
    return;
  }

  // Check dependencies
  if (!checkDependencies()) {
    log("");
    log("📝 Installation alternatives:");
    log("1. Install required build tools for your platform");
    log("2. Use pre-compiled binaries: npm install keyspy");
    log("3. Download from: https://github.com/teomyth/keyspy/releases");
    process.exit(1);
  }

  // Build for current platform
  buildForCurrentPlatform();

  log("");
  success("Native build completed! 🎉");
  log("You can now run tests or use the library locally.");
}

// Handle command line arguments
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
keyspy Native Builder

Usage: node scripts/build-native.js [options]

Options:
  --help, -h              Show this help message
  --platform <platform>   Target platform (darwin, linux, win32)
  --verbose, -v           Show detailed build output

This script automatically detects your platform and builds the appropriate
native binary for development purposes.

Examples:
  node scripts/build-native.js                    # Auto-detect platform
  node scripts/build-native.js --platform darwin  # Force macOS build
  node scripts/build-native.js --platform linux   # Force Linux build
  node scripts/build-native.js --platform win32   # Force Windows build

Supported platforms:
  - darwin (macOS) - requires Xcode/Swift
  - linux - requires build-essential, libx11-dev, libxi-dev
  - win32 (Windows) - requires MinGW-w64 or Visual Studio Build Tools
`);
  process.exit(0);
}

// Run the build
main();
