import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  InferUITool,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { openai } from "@ai-sdk/openai";
import z from "zod";
import { searchDocuments } from "@/lib/search";
import { $ZodAny } from "zod/v4/core";

const tools = {
  searchknowledgeBase: tool({
    name: "searchKnowledgeBase",
    description: "Use this tool to search the knowledge base for relevant information.",
    inputSchema: z.object({
      query: z.string().describe("The search Query to find relevant documents."),
    }),
    execute: async ({ query }) => {
      try {
        const results = await searchDocuments(query, 3, 0.5);
        if (results.length === 0) {
          return "No relevant information found in the knowledge base .";
        }

        const formattedResults = results
          .map((r, i) => `[${i + 1}] ${r.content.trim()}`)
          .join("\n\n");

        return formattedResults;
      } catch (error) {
        console.error("Error in searchKnowledgeBase tool:", error);
        throw error;
      }
    },
  }),
};

export type chatTools = InferUITool<typeof tools>;
export type chatMessage = UIMessage<never, UIDataTypes, chatTools>;

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();
    const result = streamText({
      model: openai("gpt-4.1-mini"),
      messages: convertToModelMessages(messages),
      tools,
      system: "your are heleful assisant . use the tools to answer user questions .",
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
