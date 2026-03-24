import { ScreenshotRepository } from "../../database/schema.js";
import { XlsxExporter } from "../../exports/xlsxExporter.js";
import { FilesystemStorage } from "../../storage/filesystem.js";
import { VectorIndex } from "../ai/embeddings/vector.js";
import { OcrWorker } from "../workers/ocrWorker.js";
import { SourceWorker } from "../workers/sourceWorker.js";
import { TagWorker } from "../workers/tagWorker.js";
import { VisionWorker } from "../workers/visionWorker.js";
import type { ScreenshotAnalysis, ScreenshotInput } from "../../types/screenshot.js";

export class ScreenshotPipeline {
  constructor(
    private readonly ocrWorker: OcrWorker,
    private readonly visionWorker: VisionWorker,
    private readonly sourceWorker: SourceWorker,
    private readonly tagWorker: TagWorker,
    private readonly repository: ScreenshotRepository,
    private readonly vectorIndex: VectorIndex,
    private readonly processedStorage: FilesystemStorage,
    private readonly exporter: XlsxExporter,
  ) {}

  async process(input: ScreenshotInput): Promise<ScreenshotAnalysis> {
    const ocr = await this.ocrWorker.run(input);
    const vision = await this.visionWorker.run(input);
    const source = await this.sourceWorker.findSource(input, ocr, vision);
    const tagging = await this.tagWorker.categorize(ocr, vision);

    const analysis: ScreenshotAnalysis = {
      screenshot: input,
      ocr,
      vision,
      source,
      tagging,
      processedAt: new Date().toISOString(),
    };

    await this.repository.save(analysis);
    await this.vectorIndex.upsert(analysis);
    await this.processedStorage.saveJson(`${input.id}.json`, analysis);

    return analysis;
  }

  async exportRecords(): Promise<Buffer> {
    const records = await this.repository.list();
    return this.exporter.export(records);
  }
}
