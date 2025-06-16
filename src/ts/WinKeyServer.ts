import type { IGlobalKeyServer } from "./_types/IGlobalKeyServer";
import { type ChildProcess, execFile } from "node:child_process";
import type { IGlobalKeyEvent } from "./_types/IGlobalKeyEvent";
import type { IGlobalKeyListenerRaw } from "./_types/IGlobalKeyListenerRaw";
import { WinGlobalKeyLookup } from "./_data/WinGlobalKeyLookup";
import Path from "node:path";
import type { IWindowsConfig } from "./_types/IWindowsConfig";
import { resolveUnknownKey } from "./common";
import { isSpawnEventSupported } from "./isSpawnEventSupported";
const sPath = "../../bin/WinKeyServer.exe";

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
    const serverPath = this.config.serverPath || Path.join(__dirname, sPath);
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
