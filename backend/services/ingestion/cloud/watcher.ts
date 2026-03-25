import { createId } from "../../../utils/id.js";
import type { ScreenshotInput } from "../../../types/screenshot.js";

export class CloudWatcher {
  createMockInput(filePath: string, sourceRef = "s3://bucket/mock"): ScreenshotInput {
    return {
      id: createId("shot"),
      sourceType: "cloud",
      sourceRef,
      filePath,
      createdAt: new Date().toISOString(),
      metadata: {
        originalFileName: filePath.split(/[\\/]/).at(-1),
      },
    };
  }
}
