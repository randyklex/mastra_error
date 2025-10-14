import { createTool, ToolExecutionContext, ToolStream } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({
    decisionId: z.string().describe("The id of the Decision Room")
  });

const outputSchema = z.object({
    title: z.string().describe("The title of the Decision Room"),
    description: z.string().describe("The description of the Decision Room"),
});

export const getDecisionInfoTool = createTool({
  id: "get-decision-info",
  description: `Get the information about a Decision Room.`,
  inputSchema,
  outputSchema,
  execute: async ({context}: ToolExecutionContext<typeof inputSchema>) => {
    return await getDecisionInfo(context);
  },    
});

const getDecisionInfo = async (input: z.infer<typeof inputSchema>) => {
 
    return {
        id: input.decisionId,
        title: "Decision Room Title",
        description: "Decision Room Description",
    }
}