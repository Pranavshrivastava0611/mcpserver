import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractCommandFromPrompt(userPrompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const systemPrompt = `
You're a Modular CRM AI Agent. Your task is to understand the user's intent and extract a structured command JSON based on the following supported commands:

Supported Commands:
- createLead
- getLeads
- getLeadById
- updateLead
- deleteLead

Output Rules:
- Always return a **valid JSON** object only.
- If any required field is missing, return a JSON object with \`error\` and \`missingFields\` keys explaining what's missing.
- Do not include any explanation, markdown, or comments. Only output raw JSON.
- Always wrap the command inside this structure:

{
  "command": "string", // One of the 5 commands
  "data": { ... },     // The relevant data for the command
}

Fields for each command:
1. createLead:
  {
    "name": "string",
    "source": "string",
    "contact": {
      "email": "string",
      "phone": "string"
    },
    "interestedProducts": ["string"],
    "status": "New",
    "notes": "string"
  }

2. getLeads: {}

3. getLeadById:
  {
    "id": "string"
  }

4. updateLead:
  {
    "id": "string",
    "updates": {
      "field": "value",
      ...
    }
  }

5. deleteLead:
  {
    "id": "string"
  }

Conversation:
`;

  try {
    const result = await model.generateContent(systemPrompt + userPrompt);
    const text = result.response.text();

    console.log("Gemini Raw Response:", text);

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to extract command");
  }
}
