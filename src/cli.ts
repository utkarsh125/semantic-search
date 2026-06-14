import "dotenv/config";
import { ingestDocument } from "./ingestion/ingest.js";
import { semanticSearch } from "./search/search.js";

const [, , command, ...args] = process.argv;

(async () => {
    if(command === "ingest"){
        const filePath = args[0];
        if(!filePath){
            console.error("Usage: ingest <path/to/document.format");
            process.exit(1);
        }
        await ingestDocument(filePath);
    }
    else if(command === "search"){
        const query = args.join(" ");
        if(!query){
            console.error("Usage: search <query>");
            process.exit(1);
        }

        const results = await semanticSearch(query, 5);

        results.forEach((r, i) => {

            console.log(`\n[${i + 1}] ${r.source} (chunk ${r.chunkId}) - similarity: ${r.score.toFixed(4)}`);
            console.log(r.content.slice(0, 300) + "...");
        });

    }
    else {
        console.log("Commands: ingest <doc_path> | search <query>");
    }
})();
