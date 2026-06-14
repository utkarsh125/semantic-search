export type fileType = "pdf" | "docx" | "txt" | "md";

export interface ExtractedDocument {
    text: string;
    source: string;
    fileType: fileType;
}