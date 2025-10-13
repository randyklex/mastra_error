import { openai } from '@ai-sdk/openai'
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { getDecisionInfoTool } from '../../tools/get-decision-info-tool'
import { enumerateCollectionsTool } from '../../tools/enumerate-collections-tool'
import { PostgresStore, PgVector } from '@mastra/pg'
import { MastraStorage, MastraVector } from '@mastra/core'
import { RuntimeContext } from '@mastra/core/runtime-context'
import { ChatAgentRunTimeContext } from '../runtime-context'

const MODEL: string = "o3"

const COMPOSE_DECISION_GLOBAL_CONTEXT = async (decisionId: string): Promise<string> => {
 
    return `
    ** USER IS WORKING IN A DECISION ROOM **
    <decision_id>${decisionId}</decision_id>
    `
  }

// POSTGRES
const postgresStore: MastraStorage = new PostgresStore({
  connectionString: process.env.POSTGRES_MASTRA_URL!,
  schemaName: 'public',
})

const postgresVectorStore: MastraVector = new PgVector({
  connectionString: process.env.POSTGRES_MASTRA_URL!,
  schemaName: 'public',
})

export const testAgent: Agent = new Agent({
  name: 'Agent Name',
  instructions: async ({ runtimeContext }: { runtimeContext: RuntimeContext<ChatAgentRunTimeContext> }) => {
    return `
    ${await COMPOSE_DECISION_GLOBAL_CONTEXT(runtimeContext.get('decisionId'))}
    `
  },
  model: openai(MODEL),
  tools: {
    [ChatAgentTool.ReadDecisionInfo]: getDecisionInfoTool,
    [ChatAgentTool.ListingCollections]: enumerateCollectionsTool,
  },
  workflows: { },
  memory: new Memory({
    storage: postgresStore,
    vector: postgresVectorStore,
    embedder: openai.embedding('text-embedding-3-small'),
    options: {
      lastMessages: 10,
      semanticRecall: {
        topK: 5,
        messageRange: {
          before: 2,
          after: 4,
        },
      },
    },
  }),
})
