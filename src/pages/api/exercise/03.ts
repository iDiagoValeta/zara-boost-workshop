import type { APIRoute } from "astro";
import { generateVirtualTryOn } from "../../../exercise/03-virtual-try-on";

export const prerender = false;

const MAX_IMAGE_SIZE_BYTES = 50 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const getPersonImage = (formData: FormData) => {
  const personImage = formData.get("personImage");

  if (!(personImage instanceof File)) {
    throw new Error("Upload an image with a person to try on the garment.");
  }

  if (!SUPPORTED_IMAGE_TYPES.has(personImage.type)) {
    throw new Error("Use a JPG, PNG or WEBP image.");
  }

  if (personImage.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("The image must be smaller than 50MB.");
  }

  return personImage;
};

const getNotes = (formData: FormData) => {
  const notes = formData.get("notes");

  if (typeof notes !== "string") {
    return "";
  }

  return notes.trim().slice(0, 500);
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get("Content-Type") ?? "";

    if (!contentType.includes("multipart/form-data")) {
      throw new Error("Send the request as multipart/form-data.");
    }

    const formData = await request.formData();
    const personImage = getPersonImage(formData);
    const notes = getNotes(formData);
    const result = await generateVirtualTryOn({ personImage, notes });
    const imageSrc = result.imageBase64
      ? `data:${result.mimeType};base64,${result.imageBase64}`
      : result.imageUrl;

    if (!imageSrc) {
      throw new Error("The OpenAI response did not include an image.");
    }

    return Response.json({
      imageSrc,
      revisedPrompt: result.revisedPrompt ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json({ error: message }, { status: 500 });
  }
};
