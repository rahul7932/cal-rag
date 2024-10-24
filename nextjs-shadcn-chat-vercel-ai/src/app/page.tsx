"use client";

import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Send,
  Volume2,
} from "lucide-react";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeDisplayBlock from "@/components/code-display-block";

const ChatAiIcons = [
  {
    icon: CopyIcon,
    label: "Copy",
  },
  {
    icon: RefreshCcw,
    label: "Refresh",
  },
  {
    icon: Volume2,
    label: "Volume",
  },
];

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
  } = useChat({
    onResponse(response) {
      if (response) {
        console.log(response);
        setIsGenerating(false);
      }
    },
    onError(error) {
      if (error) {
        setIsGenerating(false);
      }
    },
  });

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    handleSubmit(e);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating || isLoading || !input) return;
      setIsGenerating(true);
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleActionClick = async (action: string, messageIndex: number) => {
    console.log("Action clicked:", action, "Message index:", messageIndex);
    if (action === "Refresh") {
      setIsGenerating(true);
      try {
        await reload();
      } catch (error) {
        console.error("Error reloading:", error);
      } finally {
        setIsGenerating(false);
      }
    }

    if (action === "Copy") {
      const message = messages[messageIndex];
      if (message && message.role === "assistant") {
        navigator.clipboard.writeText(message.content);
      }
    }
  };

  return (
    <main className="flex h-screen w-full max-w-3xl flex-col items-center mx-auto py-6">
      <ChatMessageList ref={messagesRef}>
        {/* Initial Message */}
        {(
          <div className="w-full bg-background shadow-sm border rounded-lg p-8 flex flex-col gap-2">
            <h1 className="font-bold text-2xl">🐻 Berkeley Knowledge Base</h1>
            <p className="text-muted-foreground text-md">
              This application is a simple chatbot built to help UC Berkeley students understand the university&apos;s policies and procedures.
              You can use it to ask questions about things like academic policies, graduation requirements, and more!
            </p>
            <p className="text-muted-foreground text-xs">
              Disclaimer: This is not an official UC Berkeley product and information may be inaccurate.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages &&
          messages.map((message, index) => (
            <ChatBubble
              key={index}
              variant={message.role == "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                src=""
                fallback={message.role == "user" ? "👨🏽" : "🤖"}
              />
              <ChatBubbleMessage
              >
                {message.content
                  .split("```")
                  .map((part: string, index: number) => {
                    if (index % 2 === 0) {
                      return (
                        <Markdown key={index} remarkPlugins={[remarkGfm]}>
                          {part}
                        </Markdown>
                      );
                    } else {
                      return (
                        <pre className="whitespace-pre-wrap pt-2" key={index}>
                          <CodeDisplayBlock code={part} lang="" />
                        </pre>
                      );
                    }
                  })}

                {message.role === "assistant" &&
                  messages.length - 1 === index && (
                    <div className="flex items-center mt-1.5 gap-1">
                      {!isGenerating && (
                        <>
                          {ChatAiIcons.map((icon, iconIndex) => {
                            const Icon = icon.icon;
                            return (
                              <ChatBubbleAction
                                variant="outline"
                                className="size-5"
                                key={iconIndex}
                                icon={<Icon className="size-3" />}
                                onClick={() =>
                                  handleActionClick(icon.label, index)
                                }
                              />
                            );
                          })}
                        </>
                      )}
                    </div>
                  )}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

        {/* Loading */}
        {isGenerating && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar src="" fallback="🤖" />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )}
      </ChatMessageList>
      <div className="w-full px-4">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring flex items-center"
        >
          <ChatInput
            value={input}
            onKeyDown={onKeyDown}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-grow min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <Button
            disabled={!input || isLoading}
            type="submit"
            size="sm"
            className="mr-2 gap-1.5"
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </form>
      </div>
      <div className="pt-4 flex gap-2 items-center">
        <LinkedInLogoIcon className="size-4" />
        <p className="text-xs">
          <a
            href="https://www.linkedin.com/in/rahulkumarm1/"
            className="font-bold inline-flex flex-1 justify-center gap-1 leading-4 hover:underline"
          >
            LinkedIn
            <svg
              aria-hidden="true"
              height="7"
              viewBox="0 0 6 6"
              width="7"
              className="opacity-70"
            >
              <path
                d="M1.25215 5.54731L0.622742 4.9179L3.78169 1.75597H1.3834L1.38936 0.890915H5.27615V4.78069H4.40513L4.41109 2.38538L1.25215 5.54731Z"
                fill="currentColor"
              ></path>
            </svg>
          </a>
        </p>
      </div>
    </main>
  );
}
