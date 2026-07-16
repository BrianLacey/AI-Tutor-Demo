"use server";

import { supabaseUserServer } from "@/lib/server";
import { type TLogin } from "@/lib/types";

export const signUp = async (formData: TLogin) => {
  const { email, password } = formData;
  const supabase = await supabaseUserServer();

  const { error, data } = await supabase.auth.signUp({ email, password });
  if (error) {
    return {
      ok: false,
      message:
        "There was an error signing up. Please check your credentials and try again.",
    };
  }
  return { ok: true, user: data.user };
};

export const signIn = async (formData: TLogin) => {
  const { email, password } = formData;
  const supabase = await supabaseUserServer();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return {
      ok: false,
      message:
        "There was an error signing in. Please check your credentials and try again.",
    };
  }
  return { ok: true, user: data.user };
};

export const signOut = async () => {
  const supabase = await supabaseUserServer();
  await supabase.auth.signOut();
};

export const fetchUser = async () => {
  const supabase = await supabaseUserServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return {
      ok: false,
      message: "There was an error gathering your data. Please try again.",
    };
  }
  if (user) {
    return { ok: true, user: user };
  } else {
    return { ok: true, user: null };
  }
};
