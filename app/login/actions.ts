"use server";

import { supabaseUserServer } from "@/lib/server";
import { redirect } from "next/navigation";
import { type TLogin } from "@/lib/types";

export const signUp = async (formData: TLogin) => {
  const { email, password } = formData;
  const supabase = await supabaseUserServer();

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect("");
  }

  redirect("/");
};

export const signIn = async (formData: TLogin) => {
  const { email, password } = formData;
  const supabase = await supabaseUserServer();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("");
  }

  redirect("/");
};

export const signOut = async () => {
  const supabase = await supabaseUserServer();
  await supabase.auth.signOut();
  redirect("/login");
};

export const fetchUser = async () => {
  const supabase = await supabaseUserServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return user;
  } else {
    return null;
  }
};
