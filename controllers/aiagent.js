import model from "../ai/models/anthropic.js" 
import { HumanMessage } from "langchain";
import hermesAgent from "../ai/agents/agent.js";

async function chat(request, response) {
    try {
        const { prompt } = request.body;

        // 1. Validazione con RETURN per bloccare l'esecuzione
        if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
            return response.status(400).json({
                error: "The prompt field is required and must be a valid string.",
                results: null
            });
        }

        const aiResponse = await hermesAgent.invoke({
            messages: [
                new HumanMessage(prompt)
            ]
        });

        // check sul recupero del messaggio
        const lastMessage = aiResponse?.messages?.at(-1);
        const replyContent = lastMessage ? lastMessage.content : "No response generated.";

        return response.status(200).json({
            error: null,
            results: replyContent
        });

    } catch (error) {
        console.error("Error in AI Agent Router:", error);
        return response.status(500).json({
            error: "An error occurred while processing your request.",
            results: null
        });
    }
}

export { chat };