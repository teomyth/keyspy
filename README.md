# keyspy 🕵️

> A powerful, cross-platform keyboard and mouse event listener for Node.js

keyspy is a modern, lightweight library that provides global keyboard and mouse event monitoring across Windows, macOS, and Linux. Unlike other solutions, keyspy uses pre-compiled native binaries and a multi-process architecture for maximum stability and compatibility.

## 🚀 Improvements over Original

This project is a modernized version of [node-global-key-listener](https://github.com/LaunchMenu/node-global-key-listener) with significant enhancements:

- **🚀 Zero Setup**: Pre-compiled binaries downloaded automatically, no compilation required
- **📦 Smaller Package**: Binaries downloaded on-demand (not bundled), reducing package size by ~90%
- **📱 Universal macOS**: ARM64 + x86_64 universal binaries for all Apple Silicon and Intel Macs
- **🔄 Modern Stack**: TypeScript, automated testing, and modern development tools
- **🏗️ Automated Releases**: GitHub Actions handle cross-platform compilation and publishing

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

## 🤔 Why keyspy?

Choosing the right keyboard listener for your Node.js project can be challenging. Here's how keyspy compares to other popular solutions:

| Feature | Electron globalShortcut | IOHook | **keyspy** |
|---------|------------------------|--------|------------|
| **Setup Complexity** | Simple | Complex (node-gyp) | **Simple** |
| **System Shortcuts** | ❌ Limited | ✅ Full | **✅ Full** |
| **Event Blocking** | ❌ No | ✅ Yes | **✅ Yes** |
| **Node.js Compatibility** | ❌ Electron only | ⚠️ Version dependent | **✅ All versions** |
| **Compilation Required** | ❌ No | ❌ Yes | **✅ No** |
| **Arbitrary Key Support** | ❌ Limited | ⚠️ Limited | **✅ Full** |
| **Process Architecture** | In-process | In-process | **Multi-process** |

### 🎯 **keyspy Advantages**

- **🔧 Zero Setup**: Pre-compiled binaries work out of the box
- **🌐 Universal**: Compatible with all Node.js versions (14+)
- **🔒 System-Level**: Capture any key combination, including OS shortcuts
- **🛡️ Stable**: Multi-process architecture prevents crashes
- **📝 TypeScript**: Full type definitions included
- **🎮 Flexible**: Listen to individual keys or complex combinations

### ⚠️ **Considerations**

- **Permissions**: macOS requires Accessibility permissions
- **Antivirus**: Some antivirus software may flag the native binaries
- **Performance**: Small overhead due to inter-process communication

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
npm run test:manual  # Interactive testing
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
```

### Testing

```bash
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:manual      # Manual interactive testing
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
