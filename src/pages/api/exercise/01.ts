import type { APIRoute } from "astro";
import { getAssistantMessage } from "../../../exercise/01-our-first-query";

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    const assistantMessage = await getAssistantMessage();

    return Response.json({
      content: assistantMessage.content,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json({ error: message }, { status: 500 });
  }
};
