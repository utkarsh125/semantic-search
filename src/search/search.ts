import { search } from "@orama/orama";
import { getDb } from "../db/orama.js";
import { embedTexts } from "../embeddings/cohere.js";

export interface SearchResult {
    source: string;
    fileType: string;
    chunkId: number;
    content: string;
    score: number;
}

export async function semanticSearch(
    query: string,
    topK: number = 5,
    mode: "vector" | "hybrid" | "fulltext" = "hybrid"
): Promise<SearchResult[]> {

    const db = await getDb();
    const [queryEmbedding] = await embedTexts([query], "search_query");

    if (!queryEmbedding) {
        throw new Error("Failed to generate query embedding.");
    }

    const results = mode === "fulltext"
        ? await search(db, {
            mode: "fulltext",
            term: query,
            limit: topK,
        })
        : mode === "vector"
        ? await search(db, {
            mode: "vector",
            vector: {
                value: queryEmbedding,
                property: "embedding",
            },
            limit: topK,
            similarity: 0.7,
        })
        : await search(db, {
            mode: "hybrid",
            term: query,
            vector: {
                value: queryEmbedding,
                property: "embedding",
            },
            limit: topK,
            similarity: 0.7,
        });

    return results.hits.map((hit) => ({
        source: hit.document.source,
        fileType: hit.document.fileType,
        chunkId: hit.document.chunkId,
        content: hit.document.content,
        score: hit.score,
    }))
}
