import { semanticSearch } from "./search/search.js";

const queries = [
  "What is RLHF and how is it used to align LLMs?",
  "What are scaling laws for large language models?",
  "What is catastrophic forgetting?",
];

for (const query of queries) {
  console.log(`\n############ QUERY: "${query}" ############`);
  for (const mode of ["vector", "hybrid"] as const) {
    console.log(`\n--- mode: ${mode} ---`);
    const results = await semanticSearch(query, 5, mode);
    for (const r of results) {
      console.log(
        `[chunk ${r.chunkId}] score=${r.score.toFixed(4)} - ${r.content.slice(0, 80).replace(/\n/g, " ")}...`
      );
    }
  }
}