/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { User } from "lucide-react";
import { forwardRef } from "react";
import { LoadingAiText } from "./LoadingAiText";
import { Messages } from "@/types/types";
import { Avatar } from "@/components/ui/avatar";
import StramResponse from "./StramResponse";
import Markdown from "react-markdown";

interface ChatMessagesProps {
  messages: Messages[];
}

export const ChatMessages = forwardRef<HTMLUListElement, ChatMessagesProps>(
  ({ messages }, ref) => {
    const logo = new URL('../../../../public/logo.png', import.meta.url).href;

    return (
      <ul
        ref={ref}
        className="px-3 max-w-2xl md:max-w-4xl mx-auto relative overflow-y-auto h-[calc(100vh-18.1rem)] pt-0 "
      >
        {messages.map((m, index) => (
          <div key={index}>
            {m.role === "user" ? (
              <li
                key={index}
                className="flex flex-row-reverse relative items-center gap-2 font-sans"
              >
                <div className="flex self-start justify-center items-center border p-2 rounded-full text-foreground">
                  <User size={20} />
                </div>
                <div className="rounded-xl p-4 bg-muted [overflow-wrap:anywhere]">
                  <p>{m.content}</p>
                </div>
              </li>
            ) : (
              <li
                key={index}
                className={`grid grid-cols-[50px,1fr] py-4 flex-row ${
                  m.loading ? "items-center" : "items-start"
                } gap-2`}
              >
                <Avatar className="grid h-10 w-10 place-items-center border border-border rounded-full">
                  <img
                    src={logo}
                    alt="Mapu"
                    width={20}
                    height={20}
                    className="bg-cover"
                  />
                </Avatar>
                {m.loading ? (
                  <LoadingAiText text="ARYA is thoughtfully reasoning to craft the optimal response..." />
                ) : (
                  <div className="markdown-response">
                    <Markdown components={{
                      p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                      li: ({node, ...props}) => <li className="mb-2" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
                      code: ({node, ...props}) => <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-gray-100 rounded p-3 my-3 overflow-x-auto" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />
                    }}>
                      {m.content}
                    </Markdown>
                  </div>
                )}
              </li>
            )}
          </div>
        ))}
      </ul>
    );
  }
);

ChatMessages.displayName = "ChatMessages";