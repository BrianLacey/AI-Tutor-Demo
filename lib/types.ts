import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { type User } from "@supabase/auth-js";

export type TLogin = {
  email: string;
  password: string;
};

export interface IAlert {
  icon: ReactNode | null;
  title: string;
  description: string;
  styling: string;
  isOpen: boolean;
}

export interface IGlobalContext {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  alert: IAlert;
  setAlert: Dispatch<SetStateAction<IAlert>>;
  pageLoading: boolean;
  setPageLoading: Dispatch<SetStateAction<boolean>>;
  profile: any;
  fetchProfile: () => Promise<void>;
  pathName: string;
}
