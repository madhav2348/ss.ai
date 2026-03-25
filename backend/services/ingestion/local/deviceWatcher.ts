import { createId } from "../../../utils/id.js";
import type { ScreenshotInput } from "../../../types/screenshot.js";

export class DeviceWatcher {
  createMockInput(filePath: string): ScreenshotInput {
    return {
      id: createId("shot"),
      sourceType: "local",
      sourceRef: "device://screenshots/mock",
      filePath,
      createdAt: new Date().toISOString(),
      metadata: {
        originalFileName: filePath.split(/[\\/]/).at(-1),
      },
    };
  }
}
