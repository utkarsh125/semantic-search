import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";

export async function extractTextFromPDF(
    filePath: string
): Promise<{ text: string; source: string }> {
    const buffer = await readFile(filePath);
    const parser = new PDFParse({ data: buffer });

    try {
        const result = await parser.getText();

        return {
            text: result.text,
            source: filePath,
        };
    } finally {
        await parser.destroy();
    }
}
