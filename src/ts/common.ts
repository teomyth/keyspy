import type { IGlobalKey } from "./_types/IGlobalKey";

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
  if (key && key.standardName) {
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
