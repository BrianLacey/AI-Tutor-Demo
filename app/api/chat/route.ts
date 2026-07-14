import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
} from "ai";
import { type UIMessage, type UIDataTypes, type UITools } from "ai";
import { saveProfileTool } from "@/lib/customUtils";
import { supabaseUserServer } from "@/lib/server";
import { getProfile } from "@/lib/profile";
import { saveMessage, getChat } from "@/lib/chat";
import { profileBuildInstructions } from "@/app/helpers";

export const POST = async (req: Request) => {
  const supabase = await supabaseUserServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const profile = await getProfile(user.id);
  const readReq = await req.json();
  const { messages } = readReq;
  const lastUserMessage = messages.findLast(
    (message: UIMessage<unknown, UIDataTypes, UITools>) =>
      (message.role = "user"),
  );

  await saveMessage(user.id, lastUserMessage.role, lastUserMessage.parts);

  const result = streamText({
    model: "google/gemini-2.5-flash",
    instructions: profileBuildInstructions(profile),
    messages: await convertToModelMessages(messages),
    tools: {
      saveProfileInfo: saveProfileTool(user.id),
    },
    stopWhen: stepCountIs(5),
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onFinish: async ({ responseMessage }) => {
        await saveMessage(user.id, "assistant", responseMessage.parts);
      },
    }),
  });
};

export const GET = async (req: Request) => {
  const supabase = await supabaseUserServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const messages = await getChat(user.id);
  return new Response(JSON.stringify(messages), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
