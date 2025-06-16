import type { IGlobalKeyServer } from "../../types/IGlobalKeyServer";
import { type ChildProcess, execFile } from "node:child_process";
import type { IGlobalKeyListenerRaw } from "../../types/IGlobalKeyListenerRaw";
import type { IGlobalKeyEvent } from "../../types/IGlobalKeyEvent";
import { X11GlobalKeyLookup } from "./keymap";
import Path from "node:path";
import fs from "node:fs";
import type { IX11Config } from "../../types/IX11Config";
import sudo from "@expo/sudo-prompt";
import { isSpawnEventSupported, resolveUnknownKey } from "../../utils";

// Binary loading paths - prioritize build/ then fallback to runtime/
const buildPath = "../../../build/X11KeyServer";
const runtimePath = "../../../runtime/X11KeyServer";

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

/** Use this class to listen to key events on X11 */
export class X11KeyServer implements IGlobalKeyServer {
  protected listener: IGlobalKeyListenerRaw;
  private proc: ChildProcess;
  private config: IX11Config;

  private running = false;
  private restarting = false;

  /**
   * Creates a new key server for x11
   * @param listener The callback to report key events to
   * @param config Additional optional configuration for the server
   */
  constructor(listener: IGlobalKeyListenerRaw, config: IX11Config = {}) {
    this.listener = listener;
    this.config = config;
  }

  /**
   * Start the Key server and listen for keypresses
   * @param skipPerms Whether to skip attempting to add permissions
   */
  public start(skipPerms?: boolean): Promise<void> {
    this.running = true;

    const serverPath = getServerPath(this.config.serverPath);

    this.proc = execFile(serverPath);
    if (this.config.onInfo)
      this.proc.stderr?.on("data", (data) => this.config.onInfo?.(data.toString()));
    const onError = this.config.onError;
    if (onError)
      this.proc.on("close", (code) => {
        if (!this.restarting && this.running) onError(code);
      });

    this.proc.stdout?.on("data", (data) => {
      const events = this._getEventData(data);
      for (const { event, eventId } of events) {
        const stopPropagation = !!this.listener(event);

        this.proc.stdin?.write(`${stopPropagation ? "1" : "0"},${eventId}\n`);
      }
    });

    return this.handleStartup(skipPerms ?? false);
  }

  /**
   * Deals with the startup process of the server, possibly adding perms if required and restarting
   * @param skipPerms Whether to skip attempting to add permissions
   */
  protected handleStartup(skipPerms: boolean): Promise<void> {
    return new Promise<void>((res, rej) => {
      let errored = false;
      const serverPath = getServerPath(this.config.serverPath);

      // If setup fails, try adding permissions
      this.proc.on("error", async (err) => {
        errored = true;
        if (skipPerms) {
          rej(err);
        } else {
          try {
            this.restarting = true;
            this.proc.kill();
            await this.addPerms(serverPath);

            // If the server was stopped in between, just act as if it was started successfully
            if (!this.running) {
              res();
              return;
            }

            res(this.start(true));
          } catch (e) {
            rej(e);
          } finally {
            this.restarting = false;
          }
        }
      });

      if (isSpawnEventSupported()) this.proc.on("spawn", res);
      // A timed fallback if the spawn event is not supported
      else
        setTimeout(() => {
          if (!errored) res();
        }, 200);
    });
  }

  /**
   * Makes sure that the given path is executable
   * @param path The path to add the perms to
   */
  protected addPerms(path: string): Promise<void> {
    const options = {
      name: this.config.appName || "KeySpy",
    };
    return new Promise((res, err) => {
      sudo.exec(`chmod +x "${path}"`, options, (error, _stdout, stderr) => {
        if (error) {
          err(error);
          return;
        }
        if (stderr) {
          err(stderr);
          return;
        }
        res();
      });
    });
  }

  /** Stop the Key server */
  public stop() {
    this.running = false;
    this.proc.stdout?.pause();
    this.proc.kill();
  }

  /**
   * Obtains a IGlobalKeyEvent from stdout buffer data
   * @param data Data from stdout
   * @returns The standardized key event data
   */
  protected _getEventData(data: Buffer): { event: IGlobalKeyEvent; eventId: string }[] {
    const sData: string = data.toString();
    const lines = sData.trim().split(/\n/);
    return lines.map((line) => {
      const lineData = line.replace(/\s+/, "");

      const [mouseKeyboard, downUp, sKeyCode, sLocationX, sLocationY, eventId] =
        lineData.split(",");

      const isMouse = mouseKeyboard === "MOUSE";
      const isDown = downUp === "DOWN";

      const keyCode = Number.parseInt(sKeyCode, 10);

      const locationX = Number.parseFloat(sLocationX);
      const locationY = Number.parseFloat(sLocationY);

      const key = X11GlobalKeyLookup[isMouse ? 0xffff0000 + keyCode : keyCode - 8];
      const resolvedKey = resolveUnknownKey(key, keyCode);

      return {
        event: {
          vKey: keyCode,
          rawKey: resolvedKey,
          name: resolvedKey.standardName,
          state: isDown ? "DOWN" : "UP",
          scanCode: keyCode,
          location: [locationX, locationY],
          _raw: sData,
        },
        eventId,
      };
    });
  }
}
