import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function splitText(text: string): Promise<string[]> {

    const splitter = new RecursiveCharacterTextSplitter({

        //note for self: 
        //chunkSize is the maximum length of a text segment;
        //it dictacts how small or large each individual piece of the document is before it is processed.
        chunkSize: 512,


        //note for self:
        //chunkOverlap is the deliberate repitition of data at the boundary of adjacent chunks.
        chunkOverlap: 100,
    });

    return splitter.splitText(text);
}