"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { type User } from "@supabase/auth-js";
import { Spinner } from "@/components/ui/spinner";
import CustomSidebar from "./CustomComponents/customSidebar";
import ChatUI from "./CustomComponents/customChatUI";
import { fetchUser } from "./login/actions";
import { GlobalContext } from "@/app/contexts";
import { type IAlert } from "@/lib/types";

const App = async () => {
  const initialAlert = {
    icon: null,
    title: "",
    description: "",
    styling: "",
    isOpen: false,
  };

  const [pageLoading, setPageLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [alert, setAlert] = useState<IAlert>(initialAlert);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const getUser = async () => {
    const user = await fetchUser();
    if (!user) {
      redirect("/login");
    } else {
      setCurrentUser(user);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setPageLoading(false);
  //   }, 4000);
  // }, []);

  return (
    <div className="bg-slate-600 min-h-screen">
      <GlobalContext value={{ currentUser, alert, setAlert }}>
        {pageLoading ? (
          <Spinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white size-20" />
        ) : (
          <CustomSidebar
            chatLoading={chatLoading}
            setChatLoading={setChatLoading}
          >
            <ChatUI chatLoading={chatLoading} setChatLoading={setChatLoading} />
          </CustomSidebar>
        )}
      </GlobalContext>
    </div>
  );
};

export default App;
