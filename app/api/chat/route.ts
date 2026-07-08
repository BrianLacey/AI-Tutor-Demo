import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { createProfileTool } from "@/lib/customUtils";

export const POST = async (req: Request) => {
  const readReq = await req.json();
  const { messages, id } = readReq;
  console.log(readReq);
  const result = streamText({
    model: "google/gemini-2.5-flash",
    instructions:
      "Whenever the user reveals something worth remembering about themselves — their name, communication preferences, interests, or goals — call the saveProfileInfo tool with just the new information. Don't call it for trivial or already-known details. Always continue with a normal conversational reply after any tool call.",
    messages: await convertToModelMessages(messages),
    tools: {
      saveProfileInfo: createProfileTool(id),
    },
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
};
