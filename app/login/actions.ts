"use server";

import { supabaseUserServer } from "@/lib/server";
import { type TLogin } from "@/lib/types";

export const signUp = async (formData: TLogin) => {
  const { email, password } = formData;
  const supabase = await supabaseUserServer();

  const { error, data } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw new Error(
      "There was an error signing up. Please check your credentials and try again.",
    );
  }
  return data.user;
};

export const signIn = async (formData: TLogin) => {
  const { email, password } = formData;
  const supabase = await supabaseUserServer();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(
      "There was an error signing in. Please check your credentials and try again.",
    );
  }
  return data.user;
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
    throw new Error(
      "There was an error gathering your data. Please try again.",
    );
  }
  if (user) {
    return user;
  } else {
    return null;
  }
};
