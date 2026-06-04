import OpenAI from "openai";

// Exercise 03: Virtual try-on with GPT Image
//
// Challenge:
// 1. Keep the API key in OPENAI_API_KEY inside your .env file.
// 2. Run the try-on test page at /exercise/03.
// 3. Complete the AI-focused TODOs below.
//
// Goal:
// Use the fixed Zara product image plus a customer image to generate a new
// image where the person is wearing the garment.

export type TryOnInput = {
  personImage: File;
  notes?: string;
};

export type TryOnResult = {
  imageBase64?: string;
  imageUrl?: string;
  mimeType: string;
  revisedPrompt?: string | null;
};

export const garment = {
  name: "Linen Blend Overshirt",
  category: "Men / Shirts",
  material: "55% linen, 45% cotton",
  image:
    "https://static.zara.net/assets/public/60e9/378a/7a844d67a95a/e6a90106d2cf/00706755800-p/00706755800-p.jpg?ts=1776171673691&w=1700",
};

const getGarmentImageFile = async () => {
  const response = await fetch(garment.image);

  if (!response.ok) {
    throw new Error("Could not download the Zara garment reference image.");
  }

  const blob = await response.blob();

  return new File([blob], "zara-linen-overshirt.jpg", {
    type: blob.type || "image/jpeg",
  });
};

export const generateVirtualTryOn = async ({ personImage, notes = "" }: TryOnInput) => {
  const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY. Add it to your .env file.");
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const garmentImage = await getGarmentImageFile();

  // TODO 1:
  // Write a prompt for a virtual try-on edit.
  // Requirements:
  // - The first image is the person.
  // - The second image is the Zara garment reference.
  // - Keep the person's identity, pose, body shape and background.
  // - Replace only the relevant upper-body garment.
  // - Use customer notes only as fit/styling context.
  const prompt = "";

  // TODO 2:
  // Call the OpenAI Images edit API with:
  // - model: "gpt-image-2"
  // - image: first image is the person, second image is the Zara garment reference
  // - prompt
  // - a square preview-friendly size
  const response = await openai.images.edit({
    model: "gpt-image-1.5",
    image: [],
    prompt,
  });

  // TODO 3:
  // Extract the first generated image. GPT Image responses usually include
  // base64 image data in b64_json.
  const image = response.data?.[0];

  return {
    imageBase64: image?.b64_json,
    imageUrl: image?.url,
    mimeType: "image/png",
    revisedPrompt: image?.revised_prompt,
  };
}
