import { supabaseAdminServer } from "@/lib/server";

export const saveMessage = async (
  userId: string,
  role: "user" | "assistant",
  parts: any,
) => {
  const { error } = await supabaseAdminServer
    .from("chat_messages")
    .insert({ user_id: userId, role, parts });

  if (error) {
    console.error("There was a problem saving to the database:", error);
    throw new Error(error.message);
  }
};

export const getChat = async (userId: string) => {
  const { data, error } = await supabaseAdminServer
    .from("chat_messages")
    .select("role, parts, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load history", error);
    throw new Error(error.message);
  }

  return { messages: data };
};
