import { createTool, ToolExecutionContext } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({
  decisionId: z.string().describe("The ID of the decision to enumerate collections for"),
});

const outputSchema = z.object({
  collections: z.array(z.object({
    collectionId: z.string().describe("The ID of the collection"),
    name: z.string().describe("The name of the collection"),
  }))
});

const TOOL_DESCRIPTION = `
Enumerates collections in a Decision Room.`

export const enumerateCollectionsTool = createTool({
  id: "enumerate-collections",
  description: TOOL_DESCRIPTION,
  inputSchema,
  outputSchema,
  execute: async (context: ToolExecutionContext<typeof inputSchema>) => {
    return await enumerateCollections(context.context);
  },
});

const enumerateCollections = async (input: z.infer<typeof inputSchema>) => {

    return {
        collections: [
            {
                collectionId: "1",
                name: "Collection 1",
            },
            {
                collectionId: "2",
                name: "Collection 2",
            }
        ]
    }
}; 