import { env } from "./config/env.js";
import { ScreenshotRepository } from "./database/schema.js";
import { XlsxExporter } from "./exports/xlsxExporter.js";
import { FilesystemStorage } from "./storage/filesystem.js";
import { PaddleOcrClient } from "./services/ai/ocr/paddle.js";
import { VisionAgent } from "./services/ai/vision/visionAgent.js";
import { VectorIndex } from "./services/ai/embeddings/vector.js";
import { DeviceWatcher } from "./services/ingestion/local/deviceWatcher.js";
import { ScreenshotPipeline } from "./services/pipeline/screenshotPipeline.js";
import { InMemoryQueue } from "./services/queue/queue.js";
import { OcrWorker } from "./services/workers/ocrWorker.js";
import { SourceWorker } from "./services/workers/sourceWorker.js";
import { TagWorker } from "./services/workers/tagWorker.js";
import { VisionWorker } from "./services/workers/visionWorker.js";
import { createApiServer } from "./server/api.js";
import type { ScreenshotInput } from "./types/screenshot.js";

async function bootstrap(): Promise<void> {
  const screenshotStorage = new FilesystemStorage(env.screenshotStorageDir);
  const processedStorage = new FilesystemStorage(env.processedStorageDir);
  await screenshotStorage.ensure();
  await processedStorage.ensure();

  const repository = new ScreenshotRepository();
  const vectorIndex = new VectorIndex();
  const queue = new InMemoryQueue<ScreenshotInput>();
  const pipeline = new ScreenshotPipeline(
    new OcrWorker(new PaddleOcrClient()),
    new VisionWorker(new VisionAgent()),
    new SourceWorker(),
    new TagWorker(),
    repository,
    vectorIndex,
    processedStorage,
    new XlsxExporter(),
  );

  const deviceWatcher = new DeviceWatcher();
  await queue.enqueue(
    "screenshot.ingested",
    deviceWatcher.createMockInput(`${env.screenshotStorageDir}/sample.png`),
  );
  await queue.process(async (job) => {
    await pipeline.process(job.payload);
  });

  const server = createApiServer({ pipeline, repository, queue });
  server.listen(env.port, () => {
    console.log(`SS AI server listening on http://localhost:${env.port}`);
  });
}

void bootstrap();
