import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, fileId } = await req.json()

  // This is a simplified example. In a real application, you would:
  // 1. Store the uploaded PDF in a database or file storage
  // 2. Retrieve it here based on the fileId
  // 3. Process the PDF content and include relevant parts in the context

  const result = streamText({
    model: groq("llama3-70b-8192"),
    messages,
    system:
      "You are a legal assistant specialized in analyzing legal documents. The user has uploaded a legal document that you've already summarized. Answer their questions about the document based on your understanding of legal concepts and terminology. Be precise, professional, and helpful.",
  })

  return result.toDataStreamResponse()
}

