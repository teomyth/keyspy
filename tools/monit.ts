import { GlobalKeyboardListener } from "../src/index";
import Table from "cli-table3";

// ANSI color codes for better output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
};

// Debug level configuration
// 0 = minimal (clean table output only)
// 1 = normal (+ unknown key detection)
// 2 = verbose (+ all debug info)
const DEBUG_LEVEL = parseInt(process.env.KEYSPY_DEBUG || "0");

// Disable terminal echo to prevent key characters from appearing
process.stdin.setRawMode?.(true);
process.stdin.resume();

// Handle Ctrl+C manually since we're in raw mode
process.stdin.on("data", (key) => {
  // Ctrl+C is represented as \u0003
  if (key.toString() === "\u0003") {
    console.log(`\n${colors.red}🔴 Ctrl+C received...${colors.reset}`);
    cleanup();
  }
});

console.log(`${colors.cyan}${colors.bright}=== keyspy Key Monitor ===${colors.reset}`);
console.log("Real-time keyboard and mouse event detection");
console.log(
  `${colors.gray}Debug level: ${DEBUG_LEVEL} (set KEYSPY_DEBUG=0-2 to change)${colors.reset}`
);
console.log(`${colors.red}Exit: ESC, Ctrl+C, or CMD+Q${colors.reset}`);
console.log(`${colors.cyan}==========================================${colors.reset}\n`);

const listener = new GlobalKeyboardListener({
  windows: {
    onError: (errorCode) => console.error("ERROR:", errorCode),
    onInfo: (info) => console.info("INFO:", info),
  },
  mac: {
    onError: (errorCode) => console.error("ERROR:", errorCode),
    onInfo: (info) => console.info("INFO:", info),
  },
  x11: {
    onError: (errorCode) => console.error("ERROR:", errorCode),
    onInfo: (info) => console.info("INFO:", info),
  },
});

let eventCount = 0;
const events: Array<{
  time: string;
  state: string;
  count: number;
  keyName: string;
  modifiers: string;
  rawKey: string;
  location: string;
  vKey: string;
}> = [];

console.log(`${colors.green}Starting keyboard listener...${colors.reset}`);

function displayTable() {
  // Clear screen and move cursor to top
  process.stdout.write("\x1b[2J\x1b[H");

  // Show header
  console.log(`${colors.cyan}${colors.bright}=== keyspy Key Monitor ===${colors.reset}`);
  console.log("Real-time keyboard and mouse event detection");
  console.log(`${colors.gray}Debug level: ${DEBUG_LEVEL}${colors.reset}`);
  console.log(`${colors.red}Exit: ESC, Ctrl+C, or CMD+Q${colors.reset}`);
  console.log(`${colors.cyan}${"=".repeat(50)}${colors.reset}\n`);

  // Create table with no borders - just for column alignment
  const table = new Table({
    head: ["#", "Time", "State", "Key Name", "Mods", "Raw Key", "Loc", "vKey"],
    colWidths: [5, 10, 6, 18, 14, 22, 14, 6],
    style: {
      head: ["cyan"],
      border: [],
      compact: true,
      "padding-left": 0,
      "padding-right": 1,
    },
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: " ",
    },
  });

  if (events.length === 0) {
    // Show empty table with placeholder
    table.push(["", "", "", "Waiting for key events...", "", "", "", ""]);
  } else {
    // Add recent events (last 20)
    const recentEvents = events.slice(-20);
    recentEvents.forEach((event) => {
      const stateColor = event.state === "DOWN" ? colors.green : colors.red;
      // Abbreviate state if needed to fit in column
      const stateDisplay = event.state === "DOWN" ? "DN" : "UP";
      table.push([
        `${colors.dim}#${event.count}${colors.reset}`,
        `${colors.gray}${event.time}${colors.reset}`,
        `${stateColor}${stateDisplay}${colors.reset}`,
        event.keyName,
        `${colors.blue}${event.modifiers}${colors.reset}`,
        `${colors.gray}${event.rawKey}${colors.reset}`,
        `${colors.dim}${event.location}${colors.reset}`,
        `${colors.yellow}${event.vKey}${colors.reset}`,
      ]);
    });
  }

  console.log(table.toString());

  if (events.length > 20) {
    console.log(`${colors.dim}... showing last 20 of ${events.length} events${colors.reset}`);
  }
}

listener
  .addListener((e, down) => {
    eventCount++;

    // Format event information
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const keyName = e.name || "UNKNOWN";
    const rawName = e.rawKey?._nameRaw || "N/A";
    const location = e.location
      ? `${e.location[0].toFixed(1)},${e.location[1].toFixed(1)}`
      : "0.0,0.0";
    const vKey =
      e.vKey !== undefined ? `0x${e.vKey.toString(16).toUpperCase().padStart(2, "0")}` : "N/A";

    // Show currently pressed modifier keys using standard Unicode symbols
    const modifiers: string[] = [];
    if (down["LEFT SHIFT"] || down["RIGHT SHIFT"]) modifiers.push("⇧");
    if (down["LEFT CTRL"] || down["RIGHT CTRL"]) modifiers.push("⌃");
    if (down["LEFT ALT"] || down["RIGHT ALT"]) modifiers.push("⌥");
    if (down["LEFT META"] || down["RIGHT META"]) modifiers.push("⌘");
    if (down["CAPS LOCK"]) modifiers.push("⇪");
    if (down["FN"]) modifiers.push("Fn");

    const modText = modifiers.length > 0 ? modifiers.join("+") : "";

    // Store event data
    events.push({
      time: timestamp,
      state: e.state,
      count: eventCount,
      keyName: keyName,
      modifiers: modText,
      rawKey: rawName,
      location: location,
      vKey: vKey,
    });

    // Update display
    displayTable();

    // Only show debug info if explicitly requested
    if (DEBUG_LEVEL >= 1) {
      // Handle UNKNOWN keys - show them clearly with their key codes
      if (keyName === "UNKNOWN") {
        console.log(
          `${colors.red}❓ UNKNOWN key detected - vKey: ${vKey}, Raw: ${rawName}${colors.reset}`
        );
        console.log(
          `${colors.red}   This key is not in our lookup table but was captured successfully${colors.reset}`
        );
      }
    }

    // Exit conditions
    if (e.state === "DOWN" && e.name === "ESCAPE") {
      console.log(`\n${colors.red}🔴 ESC pressed - Exiting...${colors.reset}`);
      cleanup();
    }

    if (e.state === "DOWN" && e.name === "Q" && (down["LEFT META"] || down["RIGHT META"])) {
      console.log(`\n${colors.red}🔴 CMD+Q pressed - Exiting...${colors.reset}`);
      cleanup();
    }

    // Additional Ctrl+C detection through keyboard listener
    if (e.state === "DOWN" && e.name === "C" && (down["LEFT CTRL"] || down["RIGHT CTRL"])) {
      console.log(`\n${colors.red}🔴 Ctrl+C detected - Exiting...${colors.reset}`);
      cleanup();
    }

    // Don't block other events
    return false;
  })
  .then(() => {
    // Initial display
    displayTable();
    console.log(`${colors.green}✅ Listener started - Press keys to see events${colors.reset}\n`);
  })
  .catch((e) => {
    console.error("❌ Failed to start keyboard listener:", e);
    process.exit(1);
  });

function cleanup() {
  // Restore terminal settings
  process.stdin.setRawMode?.(false);
  process.stdin.pause();

  // Clear screen and show final summary
  process.stdout.write("\x1b[2J\x1b[H");

  console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.white}📊 SESSION SUMMARY${colors.reset}`);
  console.log(`${colors.green}   Total events detected: ${eventCount}${colors.reset}`);
  console.log(`${colors.yellow}   Thank you for testing keyspy!${colors.reset}`);
  console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
  process.exit(0);
}

// Handle process exit signals (this won't work in raw mode, but keep for safety)
process.on("SIGINT", () => {
  console.log(`\n${colors.red}🔴 Ctrl+C signal received...${colors.reset}`);
  cleanup();
});

process.on("SIGTERM", () => {
  console.log("\n🔴 Termination signal received...");
  cleanup();
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("\n❌ Exception:", error.message);
  cleanup();
});

process.on("unhandledRejection", (reason) => {
  console.error("\n❌ Rejection:", reason);
  cleanup();
});

// Handle terminal close
process.on("exit", () => {
  // Restore terminal settings on any exit
  process.stdin.setRawMode?.(false);
});
