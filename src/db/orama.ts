import { create, type Orama } from "@orama/orama";
import {
    persistToFile,
    restoreFromFile,
} from "@orama/plugin-data-persistence/server";
import fs from "fs";
import path from "path";

const INDEX_DIR = ".orama-index";
const INDEX_PATH = path.join(INDEX_DIR, "index.json");

export const schema = {
    source: "string",
    fileType: "string",
    chunkId: "number",
    content: "string",
    embedding: "vector[1024]"//cohere embed-english-v3.0 = 1024 dims
} as const;

export type DocSchema = typeof schema;

let _db: Orama<DocSchema> | null = null;

export async function getDb(): Promise<Orama<DocSchema>> {
    if (_db) return _db;

    if(fs.existsSync(INDEX_PATH)){
        _db = await restoreFromFile("json", INDEX_PATH) as unknown as Orama<DocSchema>;
        console.log("Loaded existing index from disk.");
    }
    else {
        fs.mkdirSync(INDEX_DIR, { recursive: true });
        _db = create({ schema });
        console.log("Created new index.");
    }

    return _db;
}

export async function saveDb(): Promise<void> {
    if (!_db) return;
    await persistToFile(_db, "json", INDEX_PATH);
    console.log("Index saved to disk.")
}
