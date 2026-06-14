import { CohereClient } from "cohere-ai";
import "dotenv/config";

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY!});

type InputType = "search_document" | "search_query";

export async function embedTexts(
  texts: string[],
  inputType: InputType
): Promise<number[][]> {
  const res = await cohere.embed({
    texts,
    model: "embed-english-v3.0",
    inputType,
    embeddingTypes: ["float"],
  });

  const embeddings = Array.isArray(res.embeddings)
    ? res.embeddings
    : res.embeddings.float;

  if (!embeddings) {
    throw new Error("Cohere returned no float embeddings.");
  }

  return embeddings;
}