"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { type User } from "@supabase/auth-js";
import { Spinner } from "@/components/ui/spinner";
import CustomSidebar from "./CustomComponents/customSidebar";
import CustomAlert from "./CustomComponents/customAlert";
import { GlobalContext } from "@/app/contexts";
import { type IAlert } from "@/lib/types";
import { readProfile } from "./services/services";

const PagesWrapper = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const initialAlert = {
    type: "",
    title: "",
    description: "",
    isOpen: false,
  };
  const pathName = usePathname();
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [alertProps, setAlertProps] = useState<IAlert>(initialAlert);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const { inferences } = await readProfile();
      setProfile(inferences);
    } catch (error) {
      setAlertProps({
        type: "error",
        title: "Error",
        description:
          "Something went wrong getting your profile. Please try again later.",
        isOpen: true,
      });
    }
  };

  useEffect(() => {
    if (!currentUser && pathName !== "/login") {
      router.push("/login");
      return;
    }
    setPageLoading(false);
    if (currentUser && pathName !== "/login") fetchProfile();
  }, [currentUser, pathName]);

  return (
    <GlobalContext
      value={{
        currentUser,
        setCurrentUser,
        alertProps,
        setAlertProps,
        pageLoading,
        setPageLoading,
        profile,
        fetchProfile,
        pathName,
      }}
    >
      <div className="flex-1 flex flex-col h-full">
        <CustomAlert />
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
