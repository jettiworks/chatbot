import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

export async function getEmbeddings(text: string) {
  const input = text.replace(/\n/g, " ");

  const { embedding } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: input,
  });
  return embedding;
}

export async function getManyEmbeddings(texts: string[]) {
  const inputs = texts.map((text) => text.replace(/\n/g, " "));

  const { embeddings } = await embedMany({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    values: inputs,
  });
  return embeddings;
}
