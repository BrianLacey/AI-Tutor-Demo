"use client";

import {
  type BaseSyntheticEvent,
  useState,
  useEffect,
  useContext,
} from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { GlobalContext } from "../contexts";
import { readChat } from "../services/services";

const ChatUI = () => {
  const [input, setInput] = useState("");
  const { messages, setMessages, sendMessage, status } = useChat();
  // @ts-ignore
  const { currentUser, pathName, fetchProfile } = useContext(GlobalContext);

  const fetchChat = async () => {
    const chatHistory = await readChat();
    setMessages(chatHistory.messages);
  };

  useEffect(() => {
    if (currentUser && pathName === "/") fetchChat();
  }, [currentUser, pathName]);

  const handlePromptChange = (e: BaseSyntheticEvent) => {
    const { value } = e.target;
    setInput(value);
  };

  const handleSubmit = async (
    message: PromptInputMessage,
    e: BaseSyntheticEvent,
  ) => {
    if (message.text) {
      try {
        await sendMessage({ text: message.text });
        await fetchProfile();
        setInput("");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length < 1 ? (
            <ConversationEmptyState className="absolute top-1/2 -translate-y-1/2 -mx-8" />
          ) : (
            messages.map((message, index) => {
              const { id, role, parts } = message;
              return (
                <Message key={id ?? index} from={role}>
                  <MessageContent>
                    {parts.map((part, index) =>
                      part.type === "text" ? (
                        <MessageResponse
                          key={index}
                          className={`${role === "assistant" ? "text-white" : ""}`}
                        >
                          {part.text}
                        </MessageResponse>
                      ) : null,
                    )}
                  </MessageContent>
                </Message>
              );
            })
          )}
        </ConversationContent>
        <ConversationScrollButton className="text-black" />
      </Conversation>

      <PromptInput onSubmit={handleSubmit} className="p-4">
        <PromptInputTextarea
          value={input}
          onChange={handlePromptChange}
          // disabled={chatLoading}
        />
        <PromptInputSubmit /* disabled={chatLoading} */ className="mr-4" />
      </PromptInput>
    </div>
  );
};

export default ChatUI;
