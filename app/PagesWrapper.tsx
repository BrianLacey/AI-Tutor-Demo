"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { type User } from "@supabase/auth-js";
import { Spinner } from "@/components/ui/spinner";
import CustomSidebar from "./CustomComponents/customSidebar";
import { GlobalContext } from "@/app/contexts";
import { type IAlert } from "@/lib/types";
import { readProfile } from "./services/services";

const PagesWrapper = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const initialAlert = {
    icon: null,
    title: "",
    description: "",
    styling: "",
    isOpen: false,
  };
  const pathName = usePathname();
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [alert, setAlert] = useState<IAlert>(initialAlert);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null)

  const fetchProfile = async () => {
      try {
        const profile = await readProfile();
        console.log(profile);
        setProfile(profile);
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    if (!currentUser && pathName !== "/login") router.push("/login");
  }, [currentUser, pathName]);

  useEffect(() => {
    if (currentUser && pathName !== "/login") setPageLoading(false);
  }, [currentUser, pathName]);

  useEffect(() => {
    if (!currentUser && pathName === "/login") setPageLoading(false);
  }, [currentUser, pathName]);

    useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <GlobalContext
      value={{
        currentUser,
        setCurrentUser,
        alert,
        setAlert,
        pageLoading,
        setPageLoading,
        profile,
        fetchProfile
      }}
    >
      <div className="flex-1 flex flex-col h-full">
        {pageLoading ? (
          <Spinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white size-20" />
        ) : currentUser && pathName !== "/login" ? (
          <CustomSidebar
            chatLoading={chatLoading}
            setChatLoading={setChatLoading}
          >
            {children}
          </CustomSidebar>
        ) : (
          children
        )}
      </div>
    </GlobalContext>
  );
};

export default PagesWrapper;
