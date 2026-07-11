"use client";

import { type Dispatch, SetStateAction } from "react";
import ChatUI from "@/app/CustomComponents/customChatUI";

const App = ({
  chatLoading,
  setChatLoading,
}: {
  chatLoading: boolean;
  setChatLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  return <ChatUI chatLoading={chatLoading} setChatLoading={setChatLoading} />;
};

export default App;
