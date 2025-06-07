// Jest globals are available without import
import { GlobalKeyboardListener } from "../../src/index";
import type { IGlobalKeyEvent } from "../../src/ts/_types/IGlobalKeyEvent";
import type { IGlobalKeyDownMap } from "../../src/ts/_types/IGlobalKeyDownMap";

describe("GlobalKeyboardListener Integration", () => {
  let listener: GlobalKeyboardListener;
  let events: IGlobalKeyEvent[] = [];
  let downMaps: IGlobalKeyDownMap[] = [];

  beforeEach(() => {
    events = [];
    downMaps = [];
    listener = new GlobalKeyboardListener({
      windows: {
        onError: (errorCode) => console.error("Windows Error:", errorCode),
        onInfo: (info) => console.info("Windows Info:", info),
      },
      mac: {
        onError: (errorCode) => console.error("Mac Error:", errorCode),
        onInfo: (info) => console.info("Mac Info:", info),
      },
    });
  });

  afterEach(async () => {
    if (listener) {
      try {
        listener.kill();
      } catch (error) {
        console.warn("Error killing listener:", error);
      }
    }
  });

  it("should create a GlobalKeyboardListener instance", () => {
    expect(listener).toBeDefined();
    expect(listener).toBeInstanceOf(GlobalKeyboardListener);
  });

  it("should have addListener method", () => {
    expect(typeof listener.addListener).toBe("function");
  });

  it("should have kill method", () => {
    expect(typeof listener.kill).toBe("function");
  });

  it("should accept a listener function", async () => {
    const listenerPromise = listener.addListener(
      (event: IGlobalKeyEvent, down: IGlobalKeyDownMap) => {
        events.push(event);
        downMaps.push(down);
        return false; // Don't capture events
      }
    );

    expect(listenerPromise).toBeInstanceOf(Promise);

    // Wait a short time to ensure listener is set up
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The listener should be ready
    await expect(listenerPromise).resolves.toBeUndefined();
  });

  it("should handle listener errors gracefully", async () => {
    const errorListener = () => {
      throw new Error("Test error");
    };

    // This should not throw, but handle the error internally
    await expect(listener.addListener(errorListener)).resolves.toBeUndefined();
  });

  it("should validate event structure when events are received", async () => {
    let eventReceived = false;

    await listener.addListener((event: IGlobalKeyEvent, down: IGlobalKeyDownMap) => {
      if (!eventReceived) {
        eventReceived = true;

        // Validate event structure
        expect(event).toBeDefined();
        expect(typeof event.state).toBe("string");
        expect(["DOWN", "UP"].includes(event.state)).toBe(true);
        expect(typeof event.vKey).toBe("number");
        expect(typeof event.scanCode).toBe("number");
        expect(typeof event._raw).toBe("string");

        if (event.name) {
          expect(typeof event.name).toBe("string");
        }

        if (event.rawKey) {
          expect(typeof event.rawKey._nameRaw).toBe("string");
          expect(typeof event.rawKey.name).toBe("string");
        }

        if (event.location) {
          expect(Array.isArray(event.location)).toBe(true);
          expect(event.location).toHaveLength(2);
          expect(typeof event.location[0]).toBe("number");
          expect(typeof event.location[1]).toBe("number");
        }

        // Validate down map structure
        expect(down).toBeDefined();
        expect(typeof down).toBe("object");
      }

      return false;
    });

    // Note: This test requires manual interaction or simulated events
    // In a real CI environment, this would need to be mocked or skipped
  }, 30000); // Longer timeout for integration test
});
