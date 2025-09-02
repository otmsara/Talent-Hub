"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";

export default function StramResponse({ response }: { response: string }) {
  return (
    <div className="ai_response">
      <ReactMarkdown remarkPlugins={[remarkGfm]} className="">
        {`${response}`}
      </ReactMarkdown>
    </div>
  );
}
