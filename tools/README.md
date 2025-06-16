# keyspy Tools

This directory contains development and testing tools for keyspy.

## Available Tools

### 🖥️ monit.ts
**Command:** `npm run monit`

A real-time key monitoring tool with clean table output. Perfect for testing and debugging key detection across all platforms.

**Features:**
- Clean, professional table layout using cli-table3
- Real-time updates with screen clearing
- Color-coded output for better readability
- Configurable debug levels
- Shows last 20 events in a scrolling table

**Debug Levels:**
```bash
KEYSPY_DEBUG=0 npm run monit  # Clean table output only (default)
KEYSPY_DEBUG=1 npm run monit  # + UNKNOWN key detection
KEYSPY_DEBUG=2 npm run monit  # + All debug info (reserved for future use)
```

**Sample Output:**
```
=== keyspy Key Monitor ===
Real-time keyboard and mouse event detection
Debug level: 0 (set KEYSPY_DEBUG=0-2 to change)
Exit: ESC, Ctrl+C, or CMD+Q
==========================================

#      Time       State    Key Name                  Mods         Raw Key                        Location        vKey
#1     14:32:16   DOWN     F3                                     kVK_F3                         0.0,0.0         0x63
#2     14:32:17   DOWN     A                                      kVK_ANSI_A                     0.0,0.0         0x00
#3     14:32:18   DOWN     MOUSE LEFT                             CGMouseButton.left             245.7,156.3     0x00
#4     14:32:19   DOWN     UNKNOWN                                UNKNOWN_0xA0                   0.0,0.0         0xA0
```

Keys not in our lookup tables will show as `UNKNOWN` with their key code for identification.

## Exit Methods

All tools support multiple exit methods:
- **ESC key**
- **Ctrl+C** 
- **CMD+Q** (macOS)

## Development Notes

- Tools use the local `../src/index` import to test the current development version
- All tools include proper cleanup and terminal restoration
- Color output is optimized for both light and dark terminals
- Table formatting automatically adjusts to terminal width
