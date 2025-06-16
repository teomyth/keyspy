// Jest globals are available without import
import { MacGlobalKeyLookup } from "../../src/platforms/mac/keymap";
import { WinGlobalKeyLookup } from "../../src/platforms/windows/keymap";
import { X11GlobalKeyLookup } from "../../src/platforms/linux/keymap";

describe("Key Lookup Tables", () => {
  describe("MacGlobalKeyLookup", () => {
    it("should contain basic letter keys", () => {
      expect(MacGlobalKeyLookup[0x00]).toBeDefined();
      expect(MacGlobalKeyLookup[0x00]?._nameRaw).toBe("kVK_ANSI_A");
      expect(MacGlobalKeyLookup[0x00]?.name).toBe("A");
      expect(MacGlobalKeyLookup[0x00]?.standardName).toBe("A");
    });

    it("should contain number keys", () => {
      expect(MacGlobalKeyLookup[0x1d]).toBeDefined();
      expect(MacGlobalKeyLookup[0x1d]?._nameRaw).toBe("kVK_ANSI_0");
      expect(MacGlobalKeyLookup[0x1d]?.name).toBe("0");
      expect(MacGlobalKeyLookup[0x1d]?.standardName).toBe("0");
    });

    it("should contain special keys", () => {
      expect(MacGlobalKeyLookup[0x31]).toBeDefined();
      expect(MacGlobalKeyLookup[0x31]?._nameRaw).toBe("kVK_Space");
      expect(MacGlobalKeyLookup[0x31]?.name).toBe("Space");
      expect(MacGlobalKeyLookup[0x31]?.standardName).toBe("SPACE");
    });

    it("should contain modifier keys", () => {
      expect(MacGlobalKeyLookup[0x37]).toBeDefined();
      expect(MacGlobalKeyLookup[0x37]?._nameRaw).toBe("kVK_Command");
      expect(MacGlobalKeyLookup[0x37]?.name).toBe("Command");
      expect(MacGlobalKeyLookup[0x37]?.standardName).toBe("LEFT META");
    });

    it("should contain mouse button mappings", () => {
      expect(MacGlobalKeyLookup[0xffff0000]).toBeDefined();
      expect(MacGlobalKeyLookup[0xffff0000]?._nameRaw).toBe("CGMouseButton.left");
      expect(MacGlobalKeyLookup[0xffff0000]?.name).toBe("left");
      expect(MacGlobalKeyLookup[0xffff0000]?.standardName).toBe("MOUSE LEFT");
    });

    it("should have consistent structure for all entries", () => {
      for (const entry of Object.values(MacGlobalKeyLookup)) {
        if (entry) {
          expect(entry).toHaveProperty("_nameRaw");
          expect(entry).toHaveProperty("name");
          expect(entry).toHaveProperty("standardName");
          expect(typeof entry._nameRaw).toBe("string");
          expect(typeof entry.name).toBe("string");
          expect(typeof entry.standardName).toBe("string");
        }
      }
    });

    it("should handle missing keys gracefully", () => {
      // Test that missing keys return undefined (will be handled by KeyServer)
      expect(MacGlobalKeyLookup[0x9999]).toBeUndefined();
    });
  });

  describe("WinGlobalKeyLookup", () => {
    it("should contain basic letter keys", () => {
      expect(WinGlobalKeyLookup[0x41]).toBeDefined();
      expect(WinGlobalKeyLookup[0x41]?._nameRaw).toBe("VK_A");
      expect(WinGlobalKeyLookup[0x41]?.name).toBe("A");
      expect(WinGlobalKeyLookup[0x41]?.standardName).toBe("A");
    });

    it("should contain number keys", () => {
      expect(WinGlobalKeyLookup[0x30]).toBeDefined();
      expect(WinGlobalKeyLookup[0x30]?._nameRaw).toBe("VK_0");
      expect(WinGlobalKeyLookup[0x30]?.name).toBe("0");
      expect(WinGlobalKeyLookup[0x30]?.standardName).toBe("0");
    });

    it("should have consistent structure for all entries", () => {
      for (const entry of Object.values(WinGlobalKeyLookup)) {
        if (entry) {
          expect(entry).toHaveProperty("_nameRaw");
          expect(entry).toHaveProperty("name");
          expect(entry).toHaveProperty("standardName");
          expect(typeof entry._nameRaw).toBe("string");
          expect(typeof entry.name).toBe("string");
          expect(typeof entry.standardName).toBe("string");
        }
      }
    });
  });

  describe("X11GlobalKeyLookup", () => {
    it("should contain basic keys", () => {
      expect(X11GlobalKeyLookup[1]).toBeDefined();
      expect(X11GlobalKeyLookup[1]?._nameRaw).toBe("KEY_ESC");
      expect(X11GlobalKeyLookup[1]?.name).toBe("ESCAPE");
      expect(X11GlobalKeyLookup[1]?.standardName).toBe("ESCAPE");
    });

    it("should have consistent structure for all entries", () => {
      for (const entry of Object.values(X11GlobalKeyLookup)) {
        if (entry) {
          expect(entry).toHaveProperty("_nameRaw");
          expect(entry).toHaveProperty("name");
          expect(entry).toHaveProperty("standardName");
          expect(typeof entry._nameRaw).toBe("string");
          expect(typeof entry.name).toBe("string");
          expect(typeof entry.standardName).toBe("string");
        }
      }
    });
  });
});
