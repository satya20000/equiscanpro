
import { GoogleGenAI, Type } from "@google/genai";
import { Stock, MarketInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStockInsight = async (stock: Stock, timeframe: string): Promise<MarketInsight> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following stock performance for ${stock.name} (${stock.ticker}) in the context of the Indian Stock Market (NSE/BSE) over a ${timeframe} period. 
      Current Price: ₹${stock.price}. 
      Recent Change: ${stock.changePercent}%.
      Sector: ${stock.sector}.
      
      Provide a brief market insight including a summary, sentiment, key drivers of the price action (mentioning Indian macroeconomic factors if relevant), and a risk level.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            sentiment: { type: Type.STRING, enum: ['Bullish', 'Bearish', 'Neutral'] },
            keyDrivers: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
          },
          required: ["summary", "sentiment", "keyDrivers", "riskLevel"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: "Indian market indices show high volatility. This stock maintains strong support levels despite broader sector corrections.",
      sentiment: stock.changePercent > 0 ? "Bullish" : "Bearish",
      keyDrivers: ["Nifty 50 Momentum", "FII Inflows", "Quarterly Results Expectations"],
      riskLevel: "Medium"
    };
  }
};
