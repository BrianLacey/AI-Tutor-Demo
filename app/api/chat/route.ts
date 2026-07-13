import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { saveProfileTool } from "@/lib/customUtils";
import { supabaseUserServer } from "@/lib/server";
import { getProfile } from "@/lib/profile";

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

  const readReq = await req.json();
  const { messages } = readReq;
  const result = streamText({
    model: "google/gemini-2.5-flash",
    instructions:
      "You are a tutor helping a student prepare for the AP Biology exam. Whenever the student reveals something worth remembering — their name, communication preferences, test date, strengths/weaknesses, practice preferences, or how they're feeling about the exam — call the saveProfileInfo tool with just the new information. Don't call it for trivial or already-known details. Always continue with a normal conversational reply after any tool call.",
    messages: await convertToModelMessages(messages),
    tools: {
      saveProfileInfo: saveProfileTool(user.id),
    },
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
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

  const inferences = await getProfile(user.id);
  return new Response(JSON.stringify({ inferences }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
