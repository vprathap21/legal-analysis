import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import { extractTextFromPDF } from "@/lib/pdf-utils"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf") as File

    if (!file || file.type !== "application/pdf") {
      return new Response("Invalid file format. Please upload a PDF.", { status: 400 })
    }

    // Extract text from PDF using our utility function
    const pdfText = await extractTextFromPDF(file)
    console.log(pdfText);
    const result = await generateObject({
      model: groq("llama3-70b-8192"),
      messages: [
        {
          role: "user",
          content: `Analyze this legal document and provide a comprehensive summary. Focus on key legal points, obligations, rights, and potential issues. Format your response with clear sections and bullet points where appropriate.
          
          Document content:
          ${pdfText}`,
        },
      ],
      schema: z.object({
        summary: z.string().describe("A comprehensive summary of the legal document with key points highlighted."),
      }),
    })

    return new Response(result.object.summary)
  } catch (error) {
    console.error("Error analyzing PDF:", error)
    return new Response("Error analyzing PDF", { status: 500 })
  }
}

