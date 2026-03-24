# SS AI
A personal Ai for screenshot analyzing, data fetching

## Current foundation
- TypeScript backend scaffold aligned to the architecture below
- Ingestion stubs for Telegram, local device watcher, and cloud watcher
- In-memory queue for early development, plus Redis client placeholder
- Worker pipeline for OCR, vision analysis, source lookup, and tagging
- Repository, processed JSON storage, vector index stub, and CSV-style XLSX export placeholder
- Minimal HTTP API with `/health`, `/screenshots`, and `/exports/xlsx`

## Quick start
```bash
npm install
cp .env.example .env
npm run check
npm run dev
```

### Feature
- connects to cloud storage and automatically processes new screenshots.
- Automatic Screenshot Detection in phones store
- mentioned the source is often in description or comments, the agent should collect metadata.


#### Architecture
```

                +----------------------+
                |     Screenshot       |
                |      Sources         |
                +----------+-----------+
                           |
        --------------------------------------------
        |                  |                       |
+---------------+  +---------------+      +---------------+
| Telegram Bot  |  | Local Watcher |      | Cloud Storage |
| (Send images) |  | (Device SS)   |      | (Drive/S3)    |
+-------+-------+  +-------+-------+      +-------+-------+
        |                  |                      |
        +------------------+----------------------+
                           |
                    +------+------+
                    | Ingestion   |
                    |   Service   |
                    +------+------+
                           |
                           v
                     +-----------+
                     |   Queue   |
                     | (Redis)   |
                     +-----------+
                           |
                     Worker Pool
                           |
         ---------------------------------------
         |           |           |             |
   +-----------+ +-----------+ +-----------+ +-----------+
   | OCR Agent | | Vision AI | | Source    | | Tagging   |
   |           | | Analysis  | | Finder    | | Agent     |
   +-----------+ +-----------+ +-----------+ +-----------+
                           |
                           v
                    +------------+
                    | Structured |
                    | Database   |
                    +------------+
                           |
            ---------------------------------
            |               |               |
       +--------+      +---------+      +---------+
       | XLSX   |      | JSON DB |      | Vector  |
       | Export |      | Storage |      | Search  |
       +--------+      +---------+      +---------+

```

#### Workers
```
Queue (Redis)
     |
     v
+------------+     +------------+     +------------+
| Worker 1   |     | Worker 2   |     | Worker 3   |
| OCR        |     | Vision AI  |     | Source     |
+------------+     +------------+     +------------+
        \              |                /
         \             |               /
          +---------------------------+
          |   Result Aggregator       |
          +---------------------------+
                    |
                    v
               Database

```
#### Flow
```
Screenshot Added
      |
      v
Queue Job Created
      |
      v
Worker Picks Job
      |
      v
+----------------------+
| Step 1: OCR Extract  |
| Text from Screenshot |
+----------------------+
      |
      v
+----------------------+
| Step 2: Vision AI    |
| Scene understanding  |
+----------------------+
      |
      v
+----------------------+
| Step 3: Source Agent |
| Find reference link  |
+----------------------+
      |
      v
+----------------------+
| Step 4: Categorize   |
| anime/movie/meme     |
+----------------------+
      |
      v
+----------------------+
| Step 5: Store Data   |
| JSON / DB / XLSX     |
+----------------------+
```


#### Structure 
> Will improve/Change in future
```
ai-screenshot-agent
│
├── services
│   ├── ingestion
│   │   ├── telegram
│   │   │   └── bot.ts
│   │   ├── cloud
│   │   │   └── watcher.ts
│   │   └── local
│   │       └── deviceWatcher.ts
│   │
│   ├── queue
│   │   ├── queue.ts
│   │   └── redis.ts
│   │
│   ├── workers
│   │   ├── ocrWorker.ts
│   │   ├── visionWorker.ts
│   │   ├── sourceWorker.ts
│   │   └── tagWorker.ts
│   │
│   ├── ai
│   │   ├── ocr
│   │   │   └── paddle.ts
│   │   ├── vision
│   │   │   └── visionAgent.ts
│   │   └── embeddings
│   │       └── vector.ts
│
├── storage
│   ├── screenshots
│   └── processed
│
├── database
│   └── schema.ts
│
├── exports
│   └── xlsxExporter.ts
│
└── server
    └── api.ts
```
