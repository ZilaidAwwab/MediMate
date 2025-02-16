import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

function ChatMessage({ message }) {
    return (
        <div className="mb-6 p-4 rounded-lg bg-[#161616] text-white">
            <ReactMarkdown
                children={message}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    p: ({ children }) => <p className="mb-2">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold text-[#FFFFFF]">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc list-inside">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                }}
            />
        </div>
    );
}

export default ChatMessage;
