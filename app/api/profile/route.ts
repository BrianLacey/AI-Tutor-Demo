import { supabaseUserServer } from "@/lib/server";
import { getProfile } from "@/lib/profile";

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
