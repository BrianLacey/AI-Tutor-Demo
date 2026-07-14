import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { saveProfileTool } from "@/lib/customUtils";
import { supabaseUserServer } from "@/lib/server";
import { getProfile } from "@/lib/profile";
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
  const result = streamText({
    model: "google/gemini-2.5-flash",
    instructions:
      profileBuildInstructions(profile),
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
