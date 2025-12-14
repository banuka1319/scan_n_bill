import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ReceiptData } from "../types";

const receiptSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    merchantName: {
      type: Type.STRING,
      description: "The name of the merchant or business issuing the receipt.",
    },
    date: {
      type: Type.STRING,
      description: "The date of the transaction in YYYY-MM-DD format.",
    },
    currency: {
      type: Type.STRING,
      description: "The currency symbol or code (e.g., USD, $, EUR).",
    },
    taxAmount: {
      type: Type.NUMBER,
      description: "The total tax amount charged.",
    },
    totalAmount: {
      type: Type.NUMBER,
      description: "The final total amount paid.",
    },
    summary: {
      type: Type.STRING,
      description: "A very brief, one-sentence summary of what this purchase seems to be for (e.g., 'Weekly groceries' or 'Dinner with friends').",
    },
    items: {
      type: Type.ARRAY,
      description: "List of line items purchased.",
      items: {
        type: Type.OBJECT,
        properties: {
          description: {
            type: Type.STRING,
            description: "Name or description of the product/service.",
          },
          quantity: {
            type: Type.NUMBER,
            description: "Quantity purchased.",
          },
          unitPrice: {
            type: Type.NUMBER,
            description: "Price per unit.",
          },
          totalPrice: {
            type: Type.NUMBER,
            description: "Total line item price.",
          },
          category: {
            type: Type.STRING,
            description: "Inferred category (e.g., Food, Electronics, Service).",
          },
        },
        required: ["description", "quantity", "unitPrice", "totalPrice"],
      },
    },
  },
  required: ["merchantName", "date", "totalAmount", "items"],
};

export const extractReceiptData = async (base64Image: string, mimeType: string): Promise<ReceiptData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: "Analyze this document (image or PDF). It is a receipt or bill. Extract the structured data according to the schema. Ensure all numbers are parsed correctly as floats.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: receiptSchema,
        temperature: 0.1, // Low temperature for factual extraction
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from Gemini.");
    }

    const data = JSON.parse(text) as ReceiptData;
    return data;
  } catch (error) {
    console.error("Error extracting receipt data:", error);
    throw error;
  }
};
