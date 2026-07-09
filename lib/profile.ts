import { supabaseAdminServer } from "@/lib/server";

export const saveProfile = async (
  userId: string,
  newData: Record<string, unknown>,
) => {
  const { data: existing } = await supabaseAdminServer
    .from("user_profiles")
    .select("inferences")
    .eq("user_id", userId)
    .maybeSingle();

  const updated = { ...(existing?.inferences ?? {}), ...newData };

  const { error } = await supabaseAdminServer.from("user_profiles").upsert(
    {
      user_id: userId,
      inferences: updated,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("There was a problem saving to the database:", error);
    throw new Error(error.message);
  }

  return;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabaseAdminServer
    .from("user_profiles")
    .select("inferences")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("There was a problem retrieving profile", error);
    throw new Error(error.message);
  }

  return data?.inferences ?? null;
};
