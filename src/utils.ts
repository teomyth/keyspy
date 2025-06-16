import type { IGlobalKey } from "./types/IGlobalKey";

/**
 * Checks whether the spawn event of a process is supported (requires node version 15.1+)
 * @returns Whether spawn is supported
 */
export function isSpawnEventSupported(): boolean {
  const nodeVersion = process.versions.node;
  const nums = nodeVersion.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!nums) return false;

  const major = Number(nums[1]);
  const minor = Number(nums[2]);
  const spawnEventSupported = major > 15 || (major === 15 && minor >= 1);
  return spawnEventSupported;
}

/**
 * Resolves a key from a lookup table, or creates an UNKNOWN entry if not found
 * @param key The key from the lookup table (may be undefined)
 * @param keyCode The raw key code for creating UNKNOWN entries
 * @returns A resolved key object with standardName "UNKNOWN" if not found in lookup
 */
export function resolveUnknownKey(
  key: { _nameRaw: string; name: string; standardName?: IGlobalKey } | undefined,
  keyCode: number
): { _nameRaw: string; name: string; standardName: IGlobalKey } {
  if (key?.standardName) {
    return {
      _nameRaw: key._nameRaw,
      name: key.name,
      standardName: key.standardName,
    };
  }

  return {
    _nameRaw: `UNKNOWN_0x${keyCode.toString(16).toUpperCase()}`,
    name: `UNKNOWN_0x${keyCode.toString(16).toUpperCase()}`,
    standardName: "UNKNOWN",
  };
}
