import { GoogleGenAI, Type } from '@google/genai';
import type { CustomerComment, AnalysisResult } from '../types';

// FIX: Removed API key existence check as per coding guidelines, which state to assume it's pre-configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: {
                type: Type.INTEGER,
                description: 'The unique ID of the comment being analyzed.',
            },
            sentiment: {
                type: Type.STRING,
                description: "The sentiment of the comment. Must be one of: 'Positive', 'Negative', 'Neutral'.",
            },
            summary: {
                type: Type.STRING,
                description: 'A brief, one-sentence summary of the main point of the comment.',
            },
            actionItem: {
                type: Type.STRING,
                description: "A concrete, actionable task for a team to follow up on. If no action is needed, respond with 'None'.",
            },
        },
        required: ['id', 'sentiment', 'summary', 'actionItem'],
    },
};

export const analyzeComments = async (comments: CustomerComment[]): Promise<AnalysisResult[]> => {
    const model = 'gemini-2.5-pro';

    // FIX: Refactored to use systemInstruction for better prompt structure, following Gemini API best practices.
    const systemInstruction = `You are an expert customer feedback analyst for a software company.
Analyze the following customer comments. For each comment, provide its unique ID, determine the sentiment, write a concise summary, and suggest a specific action item for our team.

Guidelines:
- Sentiment must be one of 'Positive', 'Negative', or 'Neutral'.
- Summaries should be brief and to the point.
- Action items should be clear and targeted. For example, 'File a bug report for the engineering team about the crash issue' or 'Share positive feedback with the product team'.
- If no action is required, the action item should be 'None'.
- Return the analysis in the specified JSON format.`;

    const userPrompt = `Comments to analyze:
        ${JSON.stringify(comments, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: userPrompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: analysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse: AnalysisResult[] = JSON.parse(jsonText);
        
        // Ensure the order matches the input order
        const responseMap = new Map<number, AnalysisResult>(parsedResponse.map(item => [item.id, item]));
        return comments.map(comment => responseMap.get(comment.id)).filter(Boolean) as AnalysisResult[];

    } catch (error) {
        console.error("Error analyzing comments with Gemini:", error);
        throw new Error("Failed to get analysis from Gemini. Check the console for more details.");
    }
};
