import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { type User } from "@supabase/auth-js";

export type TLogin = {
  email: string;
  password: string;
};

export interface IAlert {
  type: string;
  title: string;
  description: string;
  isOpen: boolean;
}

export interface IGlobalContext {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  alertProps: IAlert;
  setAlertProps: Dispatch<SetStateAction<IAlert>>;
  pageLoading: boolean;
  setPageLoading: Dispatch<SetStateAction<boolean>>;
  profile: any;
  fetchProfile: () => Promise<void>;
  pathName: string;
}
