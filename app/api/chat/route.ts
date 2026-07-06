import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";

export const POST = async (req: Request) => {
  const { messages } = await req.json();
  const result = streamText({
    model: "google/gemini-2.5-flash",
    // instructions: "",
    messages: await convertToModelMessages(messages),
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
};
