# Examples

This directory contains example applications demonstrating how to use the Node Global Key Listener.

## Manual Test Application

The `manual-test.ts` file provides an interactive testing application that:

- **Detects all keyboard and mouse events** in real-time
- **Shows detailed event information** in a single line including:
  - Event type icons (⌨️ keyboard, 🖱️ mouse, 🔧 modifiers, 🎛️ function keys, ⬆️ arrows)
  - State icons (⬇️ down, ⬆️ up)
  - Timestamp
  - Event count
  - Key name (standardized)
  - Active modifier keys in brackets [SHIFT+CTRL]
  - Raw key name (platform-specific)
  - Mouse position coordinates
  - Virtual key codes (hex format)
- **Demonstrates key combination capture** (CMD+SPACE, CMD+I, ALT+F)
- **Provides multiple exit methods** (ESC, CMD+Q, Ctrl+C)

### Running the Manual Test

```bash
# Run the interactive test application
npm run test:manual

# Or run directly with ts-node
npx ts-node examples/manual-test.ts
```

### Sample Output

```
=== Node Global Key Listener Manual Test ===
This test will detect all keyboard and mouse events
Press Ctrl+C to exit
Press ESC to exit
Press CMD+Q to exit (macOS)
==========================================

Starting keyboard listener...
Each event will be displayed on a single line with icons
============================================================

✅ Keyboard listener started successfully!
💡 Try pressing different keys, combinations, and mouse buttons
💡 Special combinations to test: CMD+SPACE, CMD+I, ALT+F
🔴 Exit: ESC, CMD+Q, or Ctrl+C
============================================================
⌨️⬇️ [10:30:15] #  1 A | kVK_ANSI_A | 0.0,0.0 | 0x00
⌨️⬆️ [10:30:15] #  2 A | kVK_ANSI_A | 0.0,0.0 | 0x00
🔧⬇️ [10:30:16] #  3 LEFT SHIFT | kVK_Shift | 0.0,0.0 | 0x38
⌨️⬇️ [10:30:16] #  4 B [SHIFT] | kVK_ANSI_B | 0.0,0.0 | 0x0B
⌨️⬆️ [10:30:16] #  5 B [SHIFT] | kVK_ANSI_B | 0.0,0.0 | 0x0B
🔧⬆️ [10:30:17] #  6 LEFT SHIFT | kVK_Shift | 0.0,0.0 | 0x38
🖱️⬇️ [10:30:18] #  7 MOUSE LEFT | CGMouseButton.left | 245.2,156.7 | 0x00
🖱️⬆️ [10:30:18] #  8 MOUSE LEFT | CGMouseButton.left | 245.2,156.7 | 0x00
🎛️⬇️ [10:30:19] #  9 F1 | kVK_F1 | 0.0,0.0 | 0x7A
🎯 CAPTURED: CMD+SPACE combination!
```

### Exit Methods

- **ESC key**: Press the Escape key
- **CMD+Q**: Press Command+Q (macOS)
- **Ctrl+C**: Press Ctrl+C in the terminal
- **Terminal close**: Close the terminal window

### Features Demonstrated

1. **Real-time Event Logging**: See every keyboard and mouse event as it happens
2. **Cross-platform Support**: Works on Windows, macOS, and Linux
3. **Modifier Key Tracking**: Shows which modifier keys are currently pressed
4. **Key Combination Capture**: Demonstrates how to capture and block specific key combinations
5. **Detailed Event Information**: Shows all available event data
6. **Graceful Exit Handling**: Multiple ways to cleanly exit the application

This example serves as both a testing tool and a reference implementation for building your own global key listener applications.
