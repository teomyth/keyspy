# KeySpy Development Guide

## 🚀 Quick Start

### Initial Setup
```bash
# 1. Clone the project
git clone https://github.com/teomyth/keyspy.git
cd keyspy

# 2. Install dependencies
npm install

# 3. Build native binaries and TypeScript code (required for first time)
npm run dev:setup
```

## 🛠️ Development Debugging Workflow

### Daily Development Commands

```bash
# 🔥 Most common: Quick test (only recompile TS, no native binary rebuild)
npm run cli

# 🔧 Full rebuild (including native binaries, for after native code changes)
npm run cli:fresh

# 🐛 Verbose modes (different levels of debug information)
npm run cli:v            # Level 1: Show UNKNOWN key detection
npm run cli:vv           # Level 2: Show all debug information
npm run cli:vvv          # Level 3: Show detailed debug info

# 👀 Watch mode (auto-recompile TypeScript files on changes)
npm run dev
```

### Development Workflow

#### Scenario 1: Modifying TypeScript Code
```bash
# Only need to recompile TS, native binaries unchanged
npm run dev:cli
```

#### Scenario 2: Modifying Native Code (Swift/C++)
```bash
# Need to rebuild native binaries
npm run dev:cli:fresh
```

#### Scenario 3: Continuous Development
```bash
# Terminal 1: Start TypeScript watch mode
npm run dev

# Terminal 2: Manually run tests (after TS compilation completes)
node dist/cli.js
```

## 🎯 CLI Tool Testing

### Basic Testing
```bash
# Test default configuration
npm run dev:cli

# Test debug mode
npm run dev:debug

# Test verbose mode
npm run dev:verbose
```

### Custom App Name Testing
```bash
# Create test script
cat > test-custom-name.js << 'EOF'
const { GlobalKeyboardListener } = require('./dist/index.js');

const listener = new GlobalKeyboardListener({
  appName: "My Custom App Name"
});

console.log('Testing custom app name...');
// On macOS/Linux, permission requests will display "My Custom App Name"
EOF

# Run test
node test-custom-name.js
```

## 🔍 Debugging Tips

### 1. Check Native Binaries
```bash
# Check if they exist
ls -la build/
ls -la runtime/

# macOS: Check architecture
file build/MacKeyServer

# Linux: Check dependencies
ldd build/X11KeyServer
```

### 2. Permission Issues Debugging
```bash
# macOS: Check permissions
chmod +x build/MacKeyServer

# Linux: Check permissions
chmod +x build/X11KeyServer
```

### 3. Environment Variable Debugging
```bash
# Set debug level
export KEYSPY_DEBUG=2
npm run dev:cli

# Skip binary download (CI environment)
export KEYSPY_SKIP_DOWNLOAD=true
npm install
```

## 📦 Build Related

### Native Binary Building
```bash
# Auto-detect platform build
npm run build:native

# Specify platform build
npm run build:native -- --platform darwin
npm run build:native -- --platform linux
npm run build:native -- --platform win32

# Verbose build output
npm run build:native -- --verbose
```

### TypeScript Building
```bash
# Single build
npm run build

# Watch mode
npm run dev
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests (no permissions required)
npm run test:unit

# Check permissions before testing
npm run check-permissions

# Integration tests (may prompt for permissions)
npm run test:integration

# Safe integration tests (check permissions first)
npm run test:integration:safe

# Skip integration tests entirely
SKIP_INTEGRATION_TESTS=true npm test

# Watch mode testing
npm run test:watch

# Coverage testing
npm run test:coverage
```

### Permission Management

KeySpy requires system permissions to capture global keyboard and mouse events:

#### Check Permissions
```bash
# Check if permissions are granted
npm run check-permissions
```

#### Skip Integration Tests
```bash
# Skip tests that require permissions
SKIP_INTEGRATION_TESTS=true npm test
SKIP_INTEGRATION_TESTS=true npm run test:integration
```

## 💡 Best Practices

### Development Efficiency Recommendations

1. **After initial setup**, most of the time you only need `npm run dev:cli`
2. **Only when modifying native code** do you need `npm run dev:cli:fresh`
3. **Use watch mode** `npm run dev` for continuous development
4. **Permission testing** will prompt for permissions on first run on macOS/Linux

### Common Issues

1. **Permission denied**: Check macOS System Preferences > Security & Privacy > Accessibility
2. **Binary not found**: Run `npm run build:native`
3. **Compilation errors**: Check if necessary build tools are installed (Xcode, build-essential, etc.)

## 🔗 Related Files

- `src/cli.ts` - CLI tool main file
- `bin/keyspy` - Global command entry point
- `scripts/build-native.js` - Native binary build script
- `native/` - Native code directory
- `build/` - Build output directory
- `dist/` - TypeScript compilation output
