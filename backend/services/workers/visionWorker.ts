import { VisionAgent } from "../ai/vision/visionAgent.js";
import type { ScreenshotInput, VisionResult } from "../../types/screenshot.js";

export class VisionWorker {
  constructor(private readonly visionAgent: VisionAgent) {}

  async run(input: ScreenshotInput): Promise<VisionResult> {
    return this.visionAgent.analyze(input);
  }
}
