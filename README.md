# KeySpy 🕵️

> A powerful, cross-platform keyboard and mouse event listener for Node.js

KeySpy is a modern, lightweight library that provides global keyboard and mouse event monitoring across Windows, macOS, and Linux. Unlike other solutions, KeySpy uses pre-compiled native binaries and a multi-process architecture for maximum stability and compatibility.

## ✨ Features

- 🌍 **Cross-platform**: Works on Windows, macOS, and Linux (X11)
- 🚀 **Zero compilation**: Pre-compiled binaries downloaded automatically, no node-gyp required
- 🔒 **System-level capture**: Can intercept system shortcuts like Ctrl+Alt+Delete, Cmd+Space
- 🎯 **Event blocking**: Prevent captured events from reaching other applications
- 📦 **TypeScript ready**: Full TypeScript support with comprehensive type definitions
- 🏗️ **Modern architecture**: Multi-process design for enhanced stability
- ⚡ **High performance**: Optimized native implementations for each platform
- 📥 **Smart installation**: Automatically downloads platform-specific binaries from GitHub Releases

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
pnpm add keyspy
# or
yarn add keyspy
```

**What happens during installation:**
1. 📦 Downloads the main package (TypeScript code)
2. 🔍 Detects your platform (Windows/macOS/Linux) and architecture
3. 📥 Automatically downloads the appropriate pre-compiled binary from GitHub Releases
4. ✅ Ready to use immediately!

## 🤔 Why KeySpy?

Choosing the right keyboard listener for your Node.js project can be challenging. Here's how KeySpy compares to other popular solutions:

| Feature | Electron globalShortcut | IOHook | **KeySpy** |
|---------|------------------------|--------|------------|
| **Setup Complexity** | Simple | Complex (node-gyp) | **Simple** |
| **System Shortcuts** | ❌ Limited | ✅ Full | **✅ Full** |
| **Event Blocking** | ❌ No | ✅ Yes | **✅ Yes** |
| **Node.js Compatibility** | ❌ Electron only | ⚠️ Version dependent | **✅ All versions** |
| **Compilation Required** | ❌ No | ❌ Yes | **✅ No** |
| **Arbitrary Key Support** | ❌ Limited | ⚠️ Limited | **✅ Full** |
| **Process Architecture** | In-process | In-process | **Multi-process** |

### 🎯 **KeySpy Advantages**

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

### Quick Development Setup

```bash
# Clone and setup
git clone https://github.com/teomyth/keyspy.git
cd keyspy
pnpm install

# Development workflow
pnpm dev          # Watch mode compilation
pnpm build        # Production build
pnpm test         # Run all tests
pnpm test:manual  # Interactive testing
```

### Building Native Binaries

KeySpy includes pre-compiled binaries, but you can rebuild them if needed:

```bash
# Platform-specific builds
pnpm build:win    # Windows (requires MinGW)
pnpm build:swift  # macOS (requires Xcode)
pnpm build:x11    # Linux (requires X11 dev libraries)
```

### Code Quality

```bash
pnpm lint         # Check code quality with Biome
pnpm lint:fix     # Auto-fix issues
pnpm format       # Format code
pnpm clean        # Remove build artifacts
```

### Testing

```bash
pnpm test:unit        # Unit tests
pnpm test:integration # Integration tests
pnpm test:manual      # Manual interactive testing
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

### Binary Download Issues

If the automatic binary download fails during installation:

```bash
# Option 1: Manual download from GitHub Releases
# Visit: https://github.com/teomyth/keyspy/releases
# Download the appropriate file for your platform

# Option 2: Build from source
npm run build:swift  # macOS
npm run build:x11    # Linux
npm run build:win    # Windows

# Option 3: Skip download in CI environments
export KEYSPY_SKIP_DOWNLOAD=true
npm install keyspy
```

### Platform Support

- **macOS**: ARM64 (Apple Silicon) and x64 (Intel) - Universal binary
- **Linux**: x64 only, requires X11
- **Windows**: x64 only

### Common Issues

1. **"Binary not found"**: Run the appropriate build command for your platform
2. **Permission denied**: Make sure the binary has execute permissions (`chmod +x`)
3. **Network issues**: Check your internet connection and GitHub access

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original concept inspired by [LaunchMenu](https://github.com/LaunchMenu/LaunchMenu)
- Built with modern tooling: TypeScript, Biome, Jest, and Turbo
