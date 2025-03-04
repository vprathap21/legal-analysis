import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs"; // Use `.mjs` instead of `.entry`

// Set the worker source manually
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => (item as any).str).join(" ") + "\n";
    }

console.log(text);
    return text || "No text extracted from PDF.";
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "Error extracting text from PDF";
  }
}
