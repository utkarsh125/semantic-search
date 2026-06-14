import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";
import type { ExtractedDocument } from "../types/document.ts";

export async function extractTextFromPDF(
  filePath: string
): Promise<ExtractedDocument> {
  const buffer = await readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();

    return {
      text: result.text,
      source: filePath,
      fileType: "pdf",
    };
  } finally {
    await parser.destroy();
  }
}