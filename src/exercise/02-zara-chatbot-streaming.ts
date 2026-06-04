import OpenAI from "openai";

// Exercise 02: Zara chatbot with streaming
//
// Challenge:
// 1. Keep the API key in OPENAI_API_KEY inside your .env file.
// 2. Run the chatbot test page at /exercise/02.
// 3. Convert the OpenAI call below to streaming.
//
// Goal:
// Make the Zara assistant start answering as soon as tokens arrive instead of
// waiting for the full response.

export type ZaraChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const suggestedQuestions = [
  "Necesito un look cómodo para viajar en avión.",
  "¿Qué puedo ponerme con una sobrecamisa de lino?",
  "Recomiéndame una prenda ligera para una cena informal.",
];

const systemPrompt = [
  "You are Zara Assist, a concise shopping assistant for a fashion ecommerce store.",
  "Answer in the same language as the customer.",
  "Ask one short follow-up question when sizing, climate, budget or occasion is unclear.",
  "Recommend versatile garments and explain the styling logic in practical terms.",
  "Do not invent stock, delivery times, discounts or store policies.",
  "Keep replies under 90 words.",
].join(" ");

export const getZaraChatbotResponse = async (messages: ZaraChatMessage[]) => {
  const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY. Add it to your .env file.");
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  // TODO 1:
  // This call works, but it waits until OpenAI has generated the full answer.
  // Turn it into a streaming response by adding:
  //
  //   stream: true,
  //
  // The endpoint and the test page are already prepared to detect both modes.
  const response = await openai.chat.completions.create({
    model: "gpt-5.4-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ],
  });

  // TODO 2:
  // Keep returning the SDK response directly. When TODO 1 is complete, this
  // return value becomes an async stream and the page will render chunks live.
  return response;
};
