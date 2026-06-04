// Exercise 07: Local Zara chatbot with Chrome's built-in Prompt API
//
// Challenge:
// 1. This does the same as exercise 02 (the Zara chatbot) but it runs 100%
//    on-device, with no server and no API key, using Chrome's Prompt API
//    (the global `LanguageModel`, powered by Gemini Nano).
// 2. The test page detects whether you are on Chrome and whether the Prompt API
//    is available. If it is not, it explains why.
// 3. Your job: create an on-device session and call `session.prompt(...)` to
//    get the assistant answer. The detection and the UI are already done.
//
// Docs: https://developer.chrome.com/docs/ai/prompt-api
//

export const docsUrl = "https://developer.chrome.com/docs/ai/prompt-api";

export type ZaraChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const suggestedQuestions = [
  "Necesito un look cómodo para viajar en avión.",
  "¿Qué puedo ponerme con una sobrecamisa de lino?",
  "Recomiéndame una prenda ligera para una cena informal.",
];

export const systemPrompt = [
  "You are Zara Assist, a concise shopping assistant for a fashion ecommerce store.",
  "Answer in the same language as the customer.",
  "Ask one short follow-up question when sizing, climate, budget or occasion is unclear.",
  "Recommend versatile garments and explain the styling logic in practical terms.",
  "Do not invent stock, delivery times, discounts or store policies.",
  "Keep replies under 90 words.",
].join(" ");

// --- Prompt API types -------------------------------------------------------
// Chrome ships these as global objects. We declare a minimal subset so the
// exercise type-checks even on machines/browsers without the API.

export type LanguageModelAvailability =
  | "unavailable"
  | "downloadable"
  | "downloading"
  | "available";

type LanguageModelRole = "system" | "user" | "assistant";

interface LanguageModelInitialPrompt {
  role: LanguageModelRole;
  content: string;
}

interface LanguageModelDownloadMonitor {
  addEventListener(
    type: "downloadprogress",
    listener: (event: { loaded: number }) => void,
  ): void;
}

interface LanguageModelCreateOptions {
  initialPrompts?: LanguageModelInitialPrompt[];
  temperature?: number;
  topK?: number;
  signal?: AbortSignal;
  monitor?: (monitor: LanguageModelDownloadMonitor) => void;
}

interface LanguageModelSession {
  prompt(input: string, options?: { signal?: AbortSignal }): Promise<string>;
  promptStreaming(input: string, options?: { signal?: AbortSignal }): ReadableStream<string>;
  destroy(): void;
}

interface LanguageModelStatic {
  availability(options?: Record<string, unknown>): Promise<LanguageModelAvailability>;
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
}

declare global {
  // Present only in Chrome with the Prompt API enabled.
  // eslint-disable-next-line no-var
  var LanguageModel: LanguageModelStatic | undefined;
}

// --- Browser + Prompt API detection ----------------------------------------

export type PromptApiSupport =
  | {
      supported: true;
      availability: LanguageModelAvailability;
      needsDownload: boolean;
    }
  | {
      supported: false;
      isChrome: boolean;
      hasApi: boolean;
      reason: string;
    };

type UserAgentBrand = { brand: string; version: string };

const detectChrome = (): boolean => {
  if (typeof navigator === "undefined") return false;

  const data = (navigator as Navigator & {
    userAgentData?: { brands?: UserAgentBrand[] };
  }).userAgentData;

  if (data?.brands?.length) {
    const brands = data.brands.map((item) => item.brand);
    const isChrome = brands.some((brand) => /google chrome/i.test(brand));
    const isOtherChromium = brands.some((brand) => /edge|opera|opr|brave/i.test(brand));

    return isChrome && !isOtherChromium;
  }

  const ua = navigator.userAgent;

  return /chrome\//i.test(ua) && !/edg|opr|opera|brave/i.test(ua);
};

export const detectPromptApiSupport = async (): Promise<PromptApiSupport> => {
  const isChrome = detectChrome();
  const hasApi = typeof LanguageModel !== "undefined";

  if (!isChrome) {
    return {
      supported: false,
      isChrome,
      hasApi,
      reason:
        "This exercise needs Google Chrome. The built-in Prompt API (Gemini Nano) is not available in this browser.",
    };
  }

  if (!hasApi) {
    return {
      supported: false,
      isChrome,
      hasApi,
      reason:
        "You are on Chrome, but the Prompt API (the LanguageModel global) is not available. Update to Chrome 138+ or enable chrome://flags/#prompt-api-for-gemini-nano.",
    };
  }

  const availability = await LanguageModel!.availability({
    expectedInputs: [{ type: "text", languages: ["es", "en"] }],
    expectedOutputs: [{ type: "text", languages: ["es", "en"] }],
  });

  if (availability === "unavailable") {
    return {
      supported: false,
      isChrome,
      hasApi,
      reason:
        "Chrome has the Prompt API, but this device cannot run the on-device model (not enough disk space, memory or hardware support).",
    };
  }

  return {
    supported: true,
    availability,
    needsDownload: availability === "downloadable" || availability === "downloading",
  };
};

// --- On-device chatbot ------------------------------------------------------

type DownloadProgress = (event: { loaded: number }) => void;

// This is the only function you have to complete. The browser/Prompt API
// detection and the chat UI are already done for you.
//
// Goal: create an on-device session and return the assistant answer as a
// string. Docs: https://developer.chrome.com/docs/ai/prompt-api
export const getLocalZaraResponse = async (
  messages: ZaraChatMessage[],
  onDownloadProgress?: DownloadProgress,
): Promise<string> => {
  if (typeof LanguageModel === "undefined") {
    throw new Error("The Prompt API is not available in this browser.");
  }

  const lastUserMessage = messages.at(-1)?.content ?? "";
  const history = messages.slice(0, -1);

  // TODO 1:
  // Create an on-device session with LanguageModel.create(). Pass the system
  // prompt and the previous turns as `initialPrompts`, and forward the download
  // progress through the `monitor` callback:
  //
  const session = await LanguageModel.create({
    initialPrompts: [
      { role: "system", content: systemPrompt },
      ...history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ],
    monitor(monitor) {
      if (onDownloadProgress) {
        monitor.addEventListener("downloadprogress", onDownloadProgress);
      }
    },
  });

  // TODO 2:
  // Ask the model and return its answer:
  //
  //   const fullAnswer = await ????
  //   return fullAnswer;
  try {
    const fullAnswer = await session.prompt(lastUserMessage);
    return fullAnswer;
  } finally {
    session.destroy();
  }
};
