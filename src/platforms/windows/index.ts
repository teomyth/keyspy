import type { IGlobalKeyServer } from "../../types/IGlobalKeyServer";
import { type ChildProcess, execFile } from "node:child_process";
import type { IGlobalKeyEvent } from "../../types/IGlobalKeyEvent";
import type { IGlobalKeyListenerRaw } from "../../types/IGlobalKeyListenerRaw";
import { WinGlobalKeyLookup } from "./keymap";
import Path from "node:path";
import fs from "node:fs";
import type { IWindowsConfig } from "../../types/IWindowsConfig";
import { resolveUnknownKey, isSpawnEventSupported } from "../../utils";

// Binary loading paths - prioritize build/ then fallback to runtime/
const buildPath = "../../../build/WinKeyServer.exe";
const runtimePath = "../../../runtime/WinKeyServer.exe";

/**
 * Get the server path, prioritizing build/ over runtime/
 * @param customPath Optional custom path from config
 * @param basePath Base path for relative resolution
 * @returns The resolved server path
 */
function getServerPath(customPath?: string, basePath: string = __dirname): string {
  if (customPath) return customPath;

  const buildServerPath = Path.join(basePath, buildPath);
  const runtimeServerPath = Path.join(basePath, runtimePath);

  // Check if build version exists first
  if (fs.existsSync(buildServerPath)) {
    return buildServerPath;
  }

  // Fallback to runtime version
  return runtimeServerPath;
}

/** Use this class to listen to key events on Windows OS */
export class WinKeyServer implements IGlobalKeyServer {
  protected listener: IGlobalKeyListenerRaw;
  private proc: ChildProcess;

  protected config: IWindowsConfig;

  /**
   * Creates a new key server for windows
   * @param listener The callback to report key events to
   * @param windowsConfig The optional windows configuration
   */
  public constructor(listener: IGlobalKeyListenerRaw, config: IWindowsConfig = {}) {
    this.listener = listener;
    this.config = config;
  }

  /** Start the Key server and listen for keypresses */
  public async start() {
    const serverPath = getServerPath(this.config.serverPath);
    this.proc = execFile(serverPath, { maxBuffer: Number.POSITIVE_INFINITY });
    if (this.config.onInfo)
      this.proc.stderr?.on("data", (data) => this.config.onInfo?.(data.toString()));
    if (this.config.onError) this.proc.on("close", this.config.onError);

    this.proc.stdout?.on("data", (data) => {
      const events = this._getEventData(data);
      for (const { event, eventId } of events) {
        const stopPropagation = !!this.listener(event);

        this.proc.stdin?.write(`${stopPropagation ? "1" : "0"},${eventId}\n`);
      }
    });

    return new Promise<void>((res, err) => {
      this.proc.on("error", err);

      if (isSpawnEventSupported()) this.proc.on("spawn", res);
      // A timed fallback if the spawn event is not supported
      else setTimeout(res, 200);
    });
  }

  /** Stop the Key server */
  public stop() {
    this.proc.stdout?.pause();
    this.proc.kill();
  }

  /**
   * Obtains a IGlobalKeyEvent from stdout buffer data
   * @param data Data from stdout
   * @returns The standardized key event data
   */
  protected _getEventData(data: Buffer | string): { event: IGlobalKeyEvent; eventId: string }[] {
    const sData: string = data.toString();
    const lines = sData.trim().split(/\n/);
    return lines.map((line) => {
      const lineData = line.replace(/\s+/, "");

      const [_mouseKeyboard, downUp, sKeyCode, sScanCode, sLocationX, sLocationY, eventId] =
        lineData.split(",");

      const isDown = downUp === "DOWN";

      const keyCode = Number.parseInt(sKeyCode, 10);
      const scanCode = Number.parseInt(sScanCode, 10);

      const locationX = Number.parseFloat(sLocationX);
      const locationY = Number.parseFloat(sLocationY);

      const key = WinGlobalKeyLookup[keyCode];
      const resolvedKey = resolveUnknownKey(key, keyCode);

      return {
        event: {
          vKey: keyCode,
          rawKey: resolvedKey,
          name: resolvedKey.standardName,
          state: isDown ? "DOWN" : "UP",
          scanCode: scanCode,
          location: [locationX, locationY],
          _raw: sData,
        },
        eventId,
      };
    });
  }
}
