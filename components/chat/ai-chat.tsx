"use client";

import { fetchAiData } from "@/lib/fetchAiData";
import { useEffect, useState } from "react";

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ScrollArea } from "../ui/scroll-area";
export const AiChat = ({ messageId }: { messageId: string }) => {
    const [response, setResponse] = useState<string>("");
    useEffect(() => {
        const res = async () => {
            const result = await fetchAiData(messageId);
            setResponse(result);
        }
        res();
    })

    return (
        <ScrollArea>
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');

                        return !inline && match ? (
                            <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} {...props}>
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {response}
            </Markdown>
        </ScrollArea>
    )
}