"use client";

import { type BaseSyntheticEvent, useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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

const ChatUI = ({
  chatLoading = false,
  setChatLoading = () => {},
}: {
  chatLoading: boolean;
  setChatLoading: any;
}) => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  // useEffect(() => {
  //   setTimeout(() => {
  //     setChatLoading(false);
  //   }, 4000);
  // }, []);

  const handlePromptChange = (e: BaseSyntheticEvent) => {
    const { value } = e.target;
    setInput(value);
  };

  const handleSubmit = (message: PromptInputMessage, e: BaseSyntheticEvent) => {
    if (message.text) {
      sendMessage({ text: message.text });
      setInput("");
    }
  };

  return (
    <>
      <Conversation>
        <ConversationContent>
          {messages.length < 1 ? (
            <ConversationEmptyState className="absolute top-1/2 -translate-y-1/2 -mx-8" />
          ) : (
            messages.map((message) => {
              const { id, role, parts } = message;
              return (
                <Message key={id} from={role}>
                  <MessageContent>
                    {parts.map((part, index) =>
                      part.type === "text" ? (
                        <MessageResponse key={index}>
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
      </Conversation>

      <PromptInput onSubmit={handleSubmit} className="p-4">
        <PromptInputTextarea
          value={input}
          onChange={handlePromptChange}
          disabled={chatLoading}
        />
        <PromptInputSubmit disabled={chatLoading} className="mr-4" />
      </PromptInput>
    </>
  );
};

export default ChatUI;
