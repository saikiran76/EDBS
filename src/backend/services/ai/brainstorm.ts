import { GoogleGenerativeAI } from '@google/generative-ai';
import type { BrainstormRequest } from '../../types/ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY as string);

export async function generateBrainstormQuestions(params: BrainstormRequest): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  try {
    const textsArray = typeof params.texts === 'string'
      ? params.texts.split('\n').filter((text: string) => text.trim().length > 0)
      : Array.isArray(params.texts)
        ? params.texts
        : [];

    const prompt = `Given these elements: ${textsArray.join('\n')}\n` +
                  `And this context: ${params.image ? 'Image provided' : 'No image'}\n` +
                  `Theme: ${params.theme || 'default'}\n` +
                  `Generate 3 thought-provoking questions about the design`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().split("\n").filter(q => q.trim().length > 0);
  } catch (error) {
    console.error("AI generation error:", error);
    return [
      "What are the key elements in this design?",
      "How could this be simplified?",
      "What alternative approaches could work here?",
    ];
  }
} 