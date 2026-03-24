import type { ScreenshotInput } from "./screenshot.js";

export interface QueueJob<TPayload> {
  id: string;
  name: string;
  payload: TPayload;
  createdAt: string;
}

export type ScreenshotJob = QueueJob<ScreenshotInput>;
