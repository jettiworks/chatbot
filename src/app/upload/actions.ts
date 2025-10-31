"use server";

const { PDFParse } = require("pdf-parse");
import { db } from "@/lib/db-config";
import { documents } from "@/lib/db-schema";
import { getEmbeddings, getManyEmbeddings } from "@/lib/embeddings";
import { chunkText } from "@/lib/chunkings";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;
    if (!file) {
      return { success: false, error: "No PDF file provided." };
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();

    if (!data.text || data.text.trim().length === 0) {
      return { success: false, error: "No text found in PDF." };
    }

    const chunks = await chunkText(data.text);
    const embeddings = await getManyEmbeddings(chunks);

    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
    }));

    await db.insert(documents).values(records);

    return { success: true, message: "File uploaded and processed successfully." };
    // Continue with the rest of your processing...
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Failed to upload file." };
  }
}
