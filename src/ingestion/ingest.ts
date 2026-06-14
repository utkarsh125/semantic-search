import { insert, search } from "@orama/orama";
import { getDb, saveDb } from "../db/orama.js";
import { embedTexts } from "../embeddings/cohere.js";
import { extractTextFromPDF } from "./loader.js";
import { splitText } from "./splitter.js";

const EMBED_BATCH_SIZE = 96;

export async function ingestDocument(filePath: string): Promise<void> {
    const db = await getDb();

    console.log(`\nLoading: ${filePath}`);
    const { text, source, fileType } = await extractTextFromPDF(filePath);

    //checking for duplicates, searching by exact source name;

    const existing = await search(db, {
        mode: "fulltext",
        term: source,
        where: { source },
        limit: 1,
    })

    //check if source is already ingested
    if(existing.count > 0){

        console.log(`${source} already ingested. skipping...`);
        return; 
    }

    console.log(`Splitting into chunks...`);
    const chunks = await splitText(text);
    console.log(`Total chunks: ${chunks.length} chunks`);

    console.log(`Embedding chunks in batches...`);

    for(let i = 0; i<chunks.length; i+=EMBED_BATCH_SIZE){

        const batch = chunks.slice(i, i + EMBED_BATCH_SIZE);
        const embeddings = await embedTexts(batch, "search_document");

        for(let j = 0; j<batch.length; j++){
            const content = batch[j];
            const embedding = embeddings[j];

            if (content === undefined || embedding === undefined) {
                throw new Error(`Missing chunk or embedding at batch index ${j}.`);
            }

            await insert(db, {
                source,
                fileType,
                chunkId: i + j,
                content,
                embedding,
            });
        }

        const progress = Math.min(i + EMBED_BATCH_SIZE, chunks.length);
        console.log(`Embedded ${progress}/${chunks.length} chunks...`);
    }
    
    await saveDb();
    console.log(`Ingestion complete for ${source}.`);
}
