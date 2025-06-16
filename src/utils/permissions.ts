import { execFile } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";

const execFileAsync = promisify(execFile);

/**
 * Check if the application has the necessary permissions to run
 * @returns Promise<boolean> - true if permissions are granted, false otherwise
 */
export async function checkPermissions(): Promise<boolean> {
  const platform = os.platform();
  
  switch (platform) {
    case "darwin":
      return checkMacOSPermissions();
    case "linux":
      return checkLinuxPermissions();
    case "win32":
      return checkWindowsPermissions();
    default:
      return false;
  }
}

/**
 * Check macOS accessibility permissions
 */
async function checkMacOSPermissions(): Promise<boolean> {
  try {
    // Use AppleScript to check accessibility permissions
    const script = `
      tell application "System Events"
        try
          set frontApp to name of first application process whose frontmost is true
          return true
        on error
          return false
        end try
      end tell
    `;
    
    const { stdout } = await execFileAsync("osascript", ["-e", script]);
    return stdout.trim() === "true";
  } catch (error) {
    return false;
  }
}

/**
 * Check Linux X11 permissions
 */
async function checkLinuxPermissions(): Promise<boolean> {
  try {
    // Check if we can access X11 display
    const { stdout } = await execFileAsync("xdpyinfo", ["-display", process.env.DISPLAY || ":0"]);
    return stdout.includes("screen #0");
  } catch (error) {
    return false;
  }
}

/**
 * Check Windows permissions (usually no special permissions needed)
 */
async function checkWindowsPermissions(): Promise<boolean> {
  // Windows typically doesn't require special permissions for low-level hooks
  // in user mode, but we can check if we're running as administrator
  try {
    const { stdout } = await execFileAsync("net", ["session"], { timeout: 5000 });
    return true; // If this succeeds, we have admin rights
  } catch (error) {
    // Even without admin rights, user-level hooks usually work
    return true;
  }
}

/**
 * Get platform-specific permission instructions
 */
export function getPermissionInstructions(): string {
  const platform = os.platform();
  
  switch (platform) {
    case "darwin":
      return `
macOS Accessibility Permission Required:
1. Go to System Preferences > Security & Privacy > Privacy
2. Select "Accessibility" from the left sidebar
3. Click the lock icon and enter your password
4. Add your terminal application (Terminal.app, iTerm2, VS Code, etc.)
5. Make sure the checkbox next to your terminal is checked
6. Restart your terminal and try again
`;
    case "linux":
      return `
Linux X11 Permission Required:
1. Make sure you're running in an X11 session (not Wayland)
2. Ensure your user has access to the X11 display
3. Try running: xhost +local:
4. If using SSH, make sure X11 forwarding is enabled: ssh -X
`;
    case "win32":
      return `
Windows Permission:
1. Try running your terminal as Administrator
2. Some antivirus software may block low-level hooks
3. Add keyspy to your antivirus whitelist if needed
`;
    default:
      return "Platform not supported";
  }
}
