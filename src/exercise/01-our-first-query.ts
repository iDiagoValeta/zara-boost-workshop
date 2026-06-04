import OpenAI from "openai";

// Exercise 01: Product copy translation with OpenAI
//
// Challenge:
// 1. Create an OpenAI account: https://platform.openai.com
// 2. Create an API key.
// 3. Paste it into OPENAI_API_KEY in your .env file.
// 4. Complete the AI-focused TODOs below.
//
// Goal:
// Ask an AI model to translate and adapt this product copy for EN, ES and FR.
// The result should be valid JSON that the storefront could render.

export type Product = {
  name: string;
  category: string;
  material: string;
  price: string;
  image: string;
  sourceDescription: string;
};

export type LocalizedProductCopy = {
  locale: "en" | "es" | "fr";
  title: string;
  shortDescription: string;
  tags: string[];
};

export const product: Product = {
  name: "Linen Blend Overshirt",
  category: "Men / Shirts",
  material: "55% linen, 45% cotton",
  price: "49.95 EUR",
  image: 'https://static.zara.net/assets/public/60e9/378a/7a844d67a95a/e6a90106d2cf/00706755800-p/00706755800-p.jpg?ts=1776171673691&w=1700',
  sourceDescription:
    "A lightweight overshirt made from a breathable linen and cotton blend. Designed for warm days and relaxed layering.",
};

export const targetLocales: LocalizedProductCopy["locale"][] = ["en", "es", "fr"];

export const getAssistantMessage = async () => {
  // TODO 1:
  // Write a system prompt that explains the role and output format.
  // Requirements:

  // - No exaggerated claims.
  // - Return only JSON with this shape:
  //   { "copies": [{ "locale": "en", "title": "...", "shortDescription": "...", "tags": ["..."] }] }
  const systemPrompt = [
    "You are a fashion ecommerce copywriter for Zara.",
    "You translate and adapt product copy for the requested locales.",
    "Keep the tone factual: no exaggerated or unverifiable claims.",
    "Respect every constraint in the user payload (max words and tag count).",
    "Return ONLY valid JSON, with no markdown or code fences, using this exact shape:",
    '{ "copies": [{ "locale": "en", "title": "...", "shortDescription": "...", "tags": ["..."] }] }',
    "Include one entry per requested locale.",
  ].join(" ");

  // TODO 2:
  // Create the user payload with the product, targetLocales and constraints.
  // Suggested constraints:
  // - titleMaxWords: 6
  // - descriptionMaxWords: 24
  // - tagCount: 4
  const userPayload = {
    product,
    targetLocales,
    constraints: {
      titleMaxWords: 6,
      descriptionMaxWords: 24,
      tagCount: 4,
    },
  };

  const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY. Add it to your .env file.");
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  // TODO 3:
  // Make the OpenAI API call.
  const response = await openai.chat.completions.create({
    model: "gpt-5.4-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(userPayload) },
    ],
  });

  // Extract the assistant message and return it.
  const assistantMessage = response.choices[0]?.message;

  if (!assistantMessage?.content) {
    throw new Error("The OpenAI response did not include assistant content.");
  }

  return assistantMessage;
}
