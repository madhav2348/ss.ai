import { PaddleOcrClient } from "../ai/ocr/paddle.js";
import type { OcrResult, ScreenshotInput } from "../../types/screenshot.js";

export class OcrWorker {
  constructor(private readonly ocrClient: PaddleOcrClient) {}

  async run(input: ScreenshotInput): Promise<OcrResult> {
    return this.ocrClient.extract(input);
  }
}
