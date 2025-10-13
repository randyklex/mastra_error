export async function POST(req: Request) {

    const runtimeContext = new RuntimeContext<ChatAgentRunTimeContext>()
    const { userId, orgId } = await authorize()
  
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()
  
    const { messages, roomId } = await req.json()
  
    runtimeContext.set('decisionId', roomId)
    runtimeContext.set('resourceId', userId)
    runtimeContext.set('threadId', `${userId}-${roomId}`)
    runtimeContext.set('userFullName', fullName)
  
    const agent = mastra.getAgent('testAgent')
    const stream = await agent.stream(messages, {
      runtimeContext,
      providerOptions: {
        openai: { reasoningEffort: 'medium'},
      },
      memory: { thread: `${userId}-${roomId}`, resource: userId },
    })
  
    return createUIMessageStreamResponse({
      stream: toAISdkFormat(stream),
    })
  }
}
