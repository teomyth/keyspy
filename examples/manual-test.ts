import { GlobalKeyboardListener } from "../src/index";

console.log("=== Node Global Key Listener Manual Test ===");
console.log("This test will detect all keyboard and mouse events");
console.log("Press Ctrl+C to exit");
console.log("Press ESC to exit");
console.log("Press CMD+Q to exit (macOS)");
console.log("==========================================\n");

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

console.log("Starting keyboard listener...");
console.log("Each event will be displayed in aligned columns");
console.log("=".repeat(78));

// Print column headers without icons for perfect alignment
const headers = [
  "Time",      // 8 chars (HH:MM:SS)
  "State",     // 5 chars (UP/DOWN)
  "#",         // 4 chars
  "Key Name",  // 12 chars
  "Mods",      // 8 chars
  "Raw Key",   // 18 chars
  "Location",  // 12 chars
  "vKey"       // 6 chars
];

const columnWidths = [8, 5, 4, 12, 8, 18, 12, 6];
let headerLine = "";
for (let i = 0; i < headers.length; i++) {
  headerLine += headers[i].padEnd(columnWidths[i]) + " ";
}
console.log(headerLine);
console.log("-".repeat(78));

listener
  .addListener((e, down) => {
    eventCount++;

    // Get state as text (no icons for perfect alignment)
    const stateText = e.state === "DOWN" ? "DOWN" : "UP";

    // Format event information in a single line
    const timestamp = new Date().toLocaleTimeString();
    const keyName = e.name || "UNKNOWN";
    const rawName = e.rawKey?._nameRaw || "N/A";
    const location = e.location
      ? `${e.location[0].toFixed(1)},${e.location[1].toFixed(1)}`
      : "0.0,0.0";
    const vKey = e.vKey !== undefined ? `0x${e.vKey.toString(16).toUpperCase().padStart(2, '0')}` : "N/A";

    // Show currently pressed modifier keys
    const modifiers: string[] = [];
    if (down["LEFT SHIFT"] || down["RIGHT SHIFT"]) modifiers.push("SHIFT");
    if (down["LEFT CTRL"] || down["RIGHT CTRL"]) modifiers.push("CTRL");
    if (down["LEFT ALT"] || down["RIGHT ALT"]) modifiers.push("ALT");
    if (down["LEFT META"] || down["RIGHT META"]) modifiers.push("CMD");
    if (down["CAPS LOCK"]) modifiers.push("CAPS");
    if (down["FN"]) modifiers.push("FN");

    const modText = modifiers.length > 0 ? modifiers.join("+") : "";

    // Format output in aligned columns without icons
    const timeStr = timestamp;
    const stateStr = stateText;
    const countStr = `#${eventCount.toString()}`;
    const keyStr = keyName;
    const modStr = modText;
    const rawStr = rawName;
    const locStr = location;
    const vKeyStr = vKey;

    // Apply column widths for perfect alignment
    const columns = [
      timeStr.padEnd(8),
      stateStr.padEnd(5),
      countStr.padEnd(4),
      keyStr.padEnd(12),
      modStr.padEnd(8),
      rawStr.padEnd(18),
      locStr.padEnd(12),
      vKeyStr.padEnd(6)
    ];

    console.log(columns.join(" "));

    // Exit conditions
    if (e.state === "DOWN" && e.name === "ESCAPE") {
      console.log("\n🔴 ESC pressed - Exiting...");
      cleanup();
    }

    if (e.state === "DOWN" && e.name === "Q" && (down["LEFT META"] || down["RIGHT META"])) {
      console.log("\n🔴 CMD+Q pressed - Exiting...");
      cleanup();
    }

    // Test key combination capture examples
    if (e.state === "DOWN" && e.name === "SPACE" && (down["LEFT META"] || down["RIGHT META"])) {
      console.log("🎯 CAPTURED: CMD+SPACE combination!");
      return true; // Prevent event propagation
    }

    if (e.state === "DOWN" && e.name === "I" && (down["LEFT META"] || down["RIGHT META"])) {
      console.log("🎯 CAPTURED: CMD+I combination!");
      return true; // Prevent event propagation
    }

    if (e.state === "DOWN" && e.name === "F" && (down["LEFT ALT"] || down["RIGHT ALT"])) {
      console.log("🎯 CAPTURED: ALT+F combination!");
      return true; // Prevent event propagation
    }

    // Don't block other events
    return false;
  })
  .then(() => {
    console.log("\n✅ Keyboard listener started successfully!");
    console.log("💡 Try pressing different keys, combinations, and mouse buttons");
    console.log("💡 Special combinations to test: CMD+SPACE, CMD+I, ALT+F");
    console.log("🔴 Exit: ESC, CMD+Q, or Ctrl+C");
    console.log("=".repeat(60));
  })
  .catch((e) => {
    console.error("❌ Failed to start keyboard listener:", e);
    process.exit(1);
  });

function cleanup() {
  console.log("\n" + "=".repeat(60));
  console.log("📊 SESSION SUMMARY");
  console.log(`   Total events detected: ${eventCount}`);
  console.log("   Thank you for testing!");
  console.log("=".repeat(60));
  process.exit(0);
}

// Handle process exit signals
process.on("SIGINT", () => {
  console.log("\n🔴 Ctrl+C received...");
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
