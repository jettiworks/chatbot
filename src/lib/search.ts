import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { db } from "./db-config";
import { documents } from "./db-schema";
import { getEmbeddings } from "./embeddings";
import { id } from "date-fns/locale";

export async function searchDocuments(query: string, limit: number = 5, threshold: number = 0.5) {
  const queryEmbedding = await getEmbeddings(query);
  const similarity = sql<number>`1 - (${cosineDistance(documents.embedding, queryEmbedding)})`;
  const similaryDocument = await db
    .select({
      id: documents.id,
      content: documents.content,
      similarity: similarity,
    })
    .from(documents)
    .where(gt(similarity, threshold))
    .orderBy(desc(similarity))
    .limit(limit);

  return similaryDocument;
}
