import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const textsplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: [" "],
});

export async function chunkText(text: string) {
  return await textsplitter.splitText(text.trim());
}
