 import { pipeline } from "@xenova/transformers";

async function runLegalPegasus() {
  // Load the summarization pipeline using Legal-Pegasus
  const summarizer = await pipeline("summarization", "nlpaueb/legal-pegasus");

  // Summarize a long legal document
  const text = `
  This agreement, made this 10th day of January, 2024, between the parties,
  establishes the terms and conditions under which services will be rendered... 
  (full legal text here)...
  `;

  const summary = await summarizer(text);

  console.log(summary);
}

runLegalPegasus().catch(console.error);


async function runInLegalBERT() {
  // Load the text classification pipeline using InLegalBERT
  const classifier = await pipeline("text-classification", "nlpaueb/legal-bert-base-uncased");

  // Legal text for classification
  const legalText = "The plaintiff has filed a lawsuit under contract law seeking damages.";

  // Perform classification
  const result = await classifier(legalText);

  console.log(result);
}

runInLegalBERT().catch(console.error);
