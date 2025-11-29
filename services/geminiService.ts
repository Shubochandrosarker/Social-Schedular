import { GoogleGenAI, Type } from "@google/genai";
import { Post, SocialPlatform } from "../types";

// Helper to format date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const generatePosts = async (
  businessName: string,
  description: string,
  startDateStr: string,
  apiKey: string
): Promise<Partial<Post>[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set the API Key.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const startDate = new Date(startDateStr);

  const prompt = `
    You are an expert social media manager. 
    Generate a content calendar for a business named "${businessName}".
    Business Description: "${description}".
    
    Task: Create 15 distinct, engaging social media posts starting from ${startDate.toDateString()}.
    The posts should vary in type (educational, promotional, engaging, funny, quote).
    
    For each post, provide:
    1. The text content (engaging, with emojis).
    2. A suggested image description (visual prompt).
    3. A recommended day offset from the start date (0 to 29).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING, description: "The post caption/text" },
              imagePrompt: { type: Type.STRING, description: "Description of the image to go with the post" },
              dayOffset: { type: Type.INTEGER, description: "Number of days from start date (0-30)" },
            },
            required: ["content", "imagePrompt", "dayOffset"],
          },
        },
      },
    });

    const generatedData = JSON.parse(response.text || "[]");

    // Map AI response to our Post structure
    const posts: Partial<Post>[] = generatedData.map((item: any, index: number) => {
      const postDate = addDays(startDate, item.dayOffset);
      // Use a distinct placeholder image based on the prompt hash or random
      const imageId = Math.floor(Math.random() * 1000);
      
      return {
        id: `gen-${Date.now()}-${index}`,
        content: item.content,
        image: `https://picsum.photos/seed/${imageId}/800/800`, // Placeholder
        platforms: ['facebook', 'instagram', 'linkedin'] as SocialPlatform[], // Default set
        scheduledDate: postDate.toISOString(),
        status: 'draft',
        stats: { likes: 0, shares: 0, comments: 0 }
      };
    });

    return posts;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
