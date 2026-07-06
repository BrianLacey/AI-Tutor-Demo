"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import CustomSidebar from "./CustomComponents/customSidebar";
import ChatUI from "./CustomComponents/customChatUI";

const App = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setPageLoading(false);
  //   }, 4000);
  // }, []);

  return (
    <div className="bg-slate-600 min-h-screen">
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
    </div>
  );
};

export default App;
