import type { APIRoute } from "astro";
import {
  getZaraChatbotResponse,
  type ZaraChatMessage,
} from "../../../exercise/02-zara-chatbot-streaming";

type ChatCompletionLike = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

type ChatCompletionChunkLike = {
  choices?: Array<{
    delta?: {
      content?: string | null;
    };
  }>;
};

type ChatCompletionStreamLike = AsyncIterable<ChatCompletionChunkLike>;

export const prerender = false;

const isChatCompletionStream = (value: unknown): value is ChatCompletionStreamLike =>
  typeof value === "object" && value !== null && Symbol.asyncIterator in value;

const parseMessages = async (request: Request): Promise<ZaraChatMessage[]> => {
  const body = (await request.json()) as { messages?: unknown };

  if (!Array.isArray(body.messages)) {
    return [];
  }

  return body.messages
    .filter((message): message is ZaraChatMessage => {
      if (typeof message !== "object" || message === null) {
        return false;
      }

      const candidate = message as Partial<ZaraChatMessage>;

      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0
      );
    })
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 1200),
    }));
};

const createTextStream = (openaiStream: ChatCompletionStreamLike) => {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of openaiStream) {
          const content = chunk.choices?.[0]?.delta?.content;

          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const messages = await parseMessages(request);
    const response = await getZaraChatbotResponse(messages);

    if (isChatCompletionStream(response)) {
      return new Response(createTextStream(response), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Zara-Response-Mode": "stream",
        },
      });
    }

    const completion = response as ChatCompletionLike;
    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("The OpenAI response did not include assistant content.");
    }

    return Response.json(
      {
        content,
        mode: "complete",
      },
      {
        headers: {
          "X-Zara-Response-Mode": "complete",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json({ error: message }, { status: 500 });
  }
};
