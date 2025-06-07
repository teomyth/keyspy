#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const { execSync } = require("node:child_process");

const packageJson = require("../package.json");
const version = packageJson.version;

// Platform detection
const platform = process.platform;
const arch = process.arch;

// Binary mapping
const binaryMap = {
  darwin: {
    arm64: { file: "MacKeyServer", archive: "keyspy-darwin-arm64.tar.gz" },
    x64: { file: "MacKeyServer", archive: "keyspy-darwin-x64.tar.gz" },
  },
  linux: {
    x64: { file: "X11KeyServer", archive: "keyspy-linux-x64.tar.gz" },
  },
  win32: {
    x64: { file: "WinKeyServer.exe", archive: "keyspy-win32-x64.tar.gz" },
  },
};

function log(message) {
  console.log(`[keyspy] ${message}`);
}

function error(message) {
  console.error(`[keyspy] ERROR: ${message}`);
}

function getPlatformInfo() {
  const platformInfo = binaryMap[platform];
  if (!platformInfo) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const archInfo = platformInfo[arch];
  if (!archInfo) {
    throw new Error(`Unsupported architecture: ${arch} on ${platform}`);
  }

  return archInfo;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    log(`Downloading ${url}`);

    const file = fs.createWriteStream(dest);

    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Handle redirect
          return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Download failed with status ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve();
        });

        file.on("error", (err) => {
          fs.unlink(dest, () => {
            // Ignore unlink errors - file cleanup is best effort
          }); // Delete partial file
          reject(err);
        });
      })
      .on("error", reject);
  });
}

function extractTarGz(archivePath, extractDir) {
  try {
    // Try using tar command
    execSync(`tar -xzf "${archivePath}" -C "${extractDir}"`, { stdio: "inherit" });
    return true;
  } catch (_err) {
    log("tar command failed, trying alternative extraction...");
    return false;
  }
}

async function downloadAndExtract() {
  try {
    const { file: binaryFile, archive } = getPlatformInfo();

    // Create bin directory
    const binDir = path.join(__dirname, "..", "bin");
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }

    const binaryPath = path.join(binDir, binaryFile);

    // Check if binary already exists
    if (fs.existsSync(binaryPath)) {
      log(`Binary already exists: ${binaryPath}`);
      return;
    }

    // Download URL
    const downloadUrl = `https://github.com/teomyth/keyspy/releases/download/v${version}/${archive}`;
    const archivePath = path.join(binDir, archive);

    log(`Platform: ${platform}-${arch}`);
    log(`Binary: ${binaryFile}`);

    try {
      // Download archive
      await downloadFile(downloadUrl, archivePath);
      log(`Downloaded: ${archive}`);

      // Extract archive
      if (extractTarGz(archivePath, binDir)) {
        log(`Extracted: ${archive}`);

        // Make binary executable (Unix systems)
        if (platform !== "win32") {
          try {
            fs.chmodSync(binaryPath, 0o755);
            log(`Made executable: ${binaryFile}`);
          } catch (err) {
            log(`Warning: Could not make binary executable: ${err.message}`);
          }
        }

        // Clean up archive
        fs.unlinkSync(archivePath);
        log(`Cleaned up: ${archive}`);

        log(`✅ Successfully installed binary: ${binaryFile}`);
      } else {
        throw new Error("Failed to extract archive");
      }
    } catch (downloadErr) {
      error(`Failed to download binary: ${downloadErr.message}`);
      log("");
      log("📝 Manual installation options:");
      log("1. Download from: https://github.com/teomyth/keyspy/releases");
      log("2. Build from source:");
      log("   - macOS: npm run build:swift");
      log("   - Linux: npm run build:x11");
      log("   - Windows: npm run build:win");
      log("");
      log("⚠️  keyspy will not work without the platform-specific binary.");

      // Don't fail the installation, just warn
      process.exit(0);
    }
  } catch (err) {
    error(err.message);
    log("");
    log("📋 Supported platforms:");
    log("- macOS (ARM64, x64)");
    log("- Linux (x64)");
    log("- Windows (x64)");
    log("");
    log("If your platform should be supported, please report this issue:");
    log("https://github.com/teomyth/keyspy/issues");

    // Don't fail the installation for unsupported platforms
    process.exit(0);
  }
}

// Skip download in CI environments or if explicitly disabled
if (process.env.CI || process.env.KEYSPY_SKIP_DOWNLOAD) {
  log("Skipping binary download (CI environment or explicitly disabled)");
  process.exit(0);
}

// Run download
downloadAndExtract().catch((err) => {
  error(`Unexpected error: ${err.message}`);
  process.exit(0); // Don't fail npm install
});
