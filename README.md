# keyspy 🕵️

> A powerful, cross-platform keyboard and mouse event listener for Node.js

keyspy is a modern, lightweight library that provides global keyboard and mouse event monitoring across Windows, macOS, and Linux. Unlike other solutions, keyspy uses pre-compiled native binaries and a multi-process architecture for maximum stability and compatibility.

## 🤔 Why keyspy?

Choosing the right keyboard listener for your Node.js project can be challenging. Here's how keyspy compares to other popular solutions:

| Feature | Electron globalShortcut | IOHook | **keyspy** |
|---------|-------------------------|---------|------------|
| **Zero compilation** | ❌ Electron required | ❌ node-gyp required | ✅ Pre-compiled binaries |
| **Package size** | 🟡 Large (Electron) | 🟡 Medium | ✅ Small (on-demand download) |
| **System shortcuts** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Event blocking** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cross-platform** | ✅ Yes | ✅ Yes | ✅ Yes |
| **TypeScript** | ✅ Built-in | 🟡 Community types | ✅ Built-in |
| **Stability** | ✅ Very stable | 🟡 Can crash Node.js | ✅ Multi-process isolation |

### 🎯 **keyspy Advantages**

- **🚀 Zero Setup**: Pre-compiled binaries downloaded automatically, no compilation required
- **📦 Smaller Package**: Binaries downloaded on-demand (not bundled), reducing package size by ~90%
- **📱 Universal macOS**: ARM64 + x86_64 universal binaries for all Apple Silicon and Intel Macs
- **🔄 Modern Stack**: TypeScript, automated testing, and modern development tools
- **🏗️ Automated Releases**: GitHub Actions handle cross-platform compilation and publishing
- **🛡️ Stable Architecture**: Multi-process design prevents Node.js crashes
- **⚡ High Performance**: Optimized native implementations for each platform

> **📚 Project Origin**: keyspy is a modernized version of [node-global-key-listener](https://github.com/LaunchMenu/node-global-key-listener), rebuilt with modern tooling and enhanced features.

## ✨ Features

- 🌍 **Cross-platform**: Windows, macOS, and Linux (X11) support
- 🔒 **System-level capture**: Intercept any key combination, including OS shortcuts
- 🎯 **Event blocking**: Prevent captured events from reaching other applications
- 📦 **TypeScript ready**: Full type definitions included
- 🛡️ **Stable architecture**: Multi-process design prevents crashes
- ⚡ **High performance**: Optimized native implementations for each platform

## 🔧 Platform Support

| Platform | Status | Implementation | Tested On |
|----------|--------|---------------|-----------|
| Windows  | ✅ Full | C++ (Low-level hooks) | Windows 10/11 |
| macOS    | ✅ Full | Swift (CGEventTap) | macOS 10.14+ |
| Linux    | ✅ X11 Only | C++ (XInput2) | Ubuntu, Arch Linux |



## 🚀 Quick Start

```ts
import { GlobalKeyboardListener } from "keyspy";

const keyspy = new GlobalKeyboardListener();

// Listen to all keyboard events
keyspy.addListener((e, down) => {
    console.log(`${e.name} ${e.state} [${e.rawKey._nameRaw}]`);
});
```

## 🔍 Testing Your Setup

```bash
# Clone and test
git clone https://github.com/teomyth/keyspy.git
cd keyspy
npm install
npm run monit           # General key monitoring with clean table output
```

The test tool will show real-time key detection for all keyboard and mouse events.

**Features:**
- ✅ Clean, aligned table output (no terminal echo interference)
- ✅ Real-time event detection with optimized column widths
- ✅ Standard Unicode symbols for modifier keys (⇧⌃⌥⌘)
- ✅ Detailed key information (name, code, modifiers, location)
- ✅ Cross-platform compatibility

### Sample Output

When you run `npm run monit`, you'll see a clean, real-time table like this:

**Default output (KEYSPY_DEBUG=0 - clean table format):**
```
=== keyspy Key Monitor ===
Real-time keyboard and mouse event detection
Debug level: 0
Exit: ESC, Ctrl+C, or CMD+Q
==========================================

#     Time       State Key Name           Mods           Raw Key                Loc            vKey
#1    14:32:16   DN    F3                                kVK_F3                 0.0,0.0        0x63
#2    14:32:16   UP    F3                                kVK_F3                 0.0,0.0        0x63
#3    14:32:17   DN    A                                 kVK_ANSI_A             0.0,0.0        0x00
#4    14:32:17   UP    A                                 kVK_ANSI_A             0.0,0.0        0x00
#5    14:32:18   DN    SPACE              ⌘              kVK_Space              0.0,0.0        0x31
#6    14:32:19   DN    MOUSE LEFT                        CGMouseButton.left     245.7,156.3    0x00
#7    14:32:20   DN    C                  ⇧+⌃+⌥+⌘        kVK_ANSI_C             0.0,0.0        0x08
#8    14:32:21   DN    UNKNOWN                           UNKNOWN_0xA0           0.0,0.0        0xA0
```

**Debug output (KEYSPY_DEBUG=1 - with unknown key detection):**
```
#8    14:32:21   DN    UNKNOWN                           UNKNOWN_0xA0           0.0,0.0        0xA0
❓ UNKNOWN key detected - vKey: 0xA0, Raw: UNKNOWN_0xA0
   This key is not in our lookup table but was captured successfully
```

Some keys may appear as `UNKNOWN` if they're not in our lookup tables, but you'll still get the key code (vKey) to identify them.

## 📖 Usage Examples

### Basic Event Logging

```ts
import { GlobalKeyboardListener } from "keyspy";

const keyspy = new GlobalKeyboardListener();

keyspy.addListener((e, down) => {
    console.log(`Key: ${e.name}, State: ${e.state}, Location: ${e.location}`);
});
```

### Capturing System Shortcuts

```ts
// Capture Cmd+Space (macOS) or Win+Space (Windows)
keyspy.addListener((e, down) => {
    if (e.state === "DOWN" && e.name === "SPACE" &&
        (down["LEFT META"] || down["RIGHT META"])) {
        console.log("System shortcut captured!");
        return true; // Prevent the event from reaching other apps
    }
});

// Capture Alt+F4
keyspy.addListener((e, down) => {
    if (e.state === "DOWN" && e.name === "F4" &&
        (down["LEFT ALT"] || down["RIGHT ALT"])) {
        console.log("Alt+F4 intercepted!");
        return true;
    }
});
```

### Advanced Configuration

```ts
const keyspy = new GlobalKeyboardListener({
    windows: {
        onError: (errorCode) => console.error("Windows error:", errorCode),
        onInfo: (info) => console.info("Windows info:", info)
    },
    mac: {
        onError: (errorCode) => console.error("macOS error:", errorCode),
    },
    x11: {
        onError: (errorCode) => console.error("Linux error:", errorCode),
    }
});
```

### Cleanup and Resource Management

```ts
// Remove specific listener
const myListener = (e, down) => { /* ... */ };
keyspy.addListener(myListener);
keyspy.removeListener(myListener);

// Clean shutdown
keyspy.kill(); // Removes all listeners and stops the key server
```

## 📦 Installation

```bash
npm install keyspy
# or
yarn add keyspy
```

The package automatically detects your platform and downloads the appropriate pre-compiled binary during installation. No compilation required!



## 🛠️ Development

```bash
# Clone and setup
git clone https://github.com/teomyth/keyspy.git
cd keyspy
npm install

# Build native binary for development
npm run build:native

# Development commands
npm run dev          # TypeScript watch mode
npm run build        # Production build
npm test             # Run all tests
npm run monit        # Interactive testing with clean table output
```

### Building Native Binaries

For development, you can rebuild the native binaries:

```bash
# Auto-detect your platform
npm run build:native

# Force specific platform
npm run build:native -- --platform darwin  # macOS (requires Xcode)
npm run build:native -- --platform linux   # Linux (requires X11 dev libraries)
npm run build:native -- --platform win32   # Windows (requires MinGW)

# Show detailed build output
npm run build:native -- --verbose
```

### Code Quality

```bash
npm run lint         # Check code quality with Biome
npm run lint:fix     # Auto-fix issues
npm run format       # Format code
npm run clean        # Remove build artifacts

# Release management
npm run release:patch    # Bump patch version (1.0.0 → 1.0.1)
npm run release:minor    # Bump minor version (1.0.0 → 1.1.0)
npm run release:major    # Bump major version (1.0.0 → 2.0.0)
npm run release:dry      # Preview release without publishing
```

### Testing

```bash
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run monit            # Manual interactive testing with clean table output

# Debug levels for monit tool
KEYSPY_DEBUG=0 npm run monit  # Clean table output only (default)
KEYSPY_DEBUG=1 npm run monit  # + UNKNOWN key detection
KEYSPY_DEBUG=2 npm run monit  # + All debug info (reserved for future use)
```

## 📋 API Reference

### GlobalKeyboardListener

#### Constructor

```ts
new GlobalKeyboardListener(config?: IConfig)
```

#### Methods

- `addListener(listener: IGlobalKeyListener): Promise<void>` - Add event listener
- `removeListener(listener: IGlobalKeyListener): void` - Remove event listener
- `kill(): void` - Stop all listeners and cleanup

#### Event Object

```ts
interface IGlobalKeyEvent {
  name: string;           // Key name (e.g., "A", "SPACE", "F1")
  state: "UP" | "DOWN";   // Key state
  rawKey: IGlobalKey;     // Raw key information
  vKey: number;           // Virtual key code
  scanCode: number;       // Scan code
  location: [number, number]; // Mouse location (for mouse events)
}
```

## 🔒 Security & Permissions

### macOS
- Requires **Accessibility** permissions in System Preferences
- First run will prompt for permission automatically

### Windows
- May require administrator privileges for system-wide hooks
- Some antivirus software may flag the binary (false positive)

### Linux
- Requires X11 display server
- May need to run with appropriate user permissions

## 🔧 Troubleshooting

### Common Issues

1. **Binary download fails**: Visit [GitHub Releases](https://github.com/teomyth/keyspy/releases) to download manually, or build from source with `npm run build:native`
2. **Permission denied**: Make sure the binary has execute permissions (`chmod +x bin/*`)
3. **CI environments**: Set `KEYSPY_SKIP_DOWNLOAD=true` to skip binary download

### Platform Requirements

- **macOS**: macOS 10.14+, supports both Intel and Apple Silicon
- **Linux**: X11 display server, x64 architecture
- **Windows**: Windows 10+, x64 architecture

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
