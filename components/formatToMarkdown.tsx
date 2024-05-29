"use client";

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy } from "lucide-react";
import { useState } from 'react';
export const FormatToMarkdown = ({ content }: { content: string }) => {
    const [copy, setCopy] = useState<boolean>(false);
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');

                    return !inline && match ? (
                        <div className="grid place-items-center m-2">

                            <div className="max-w-2xl rounded-md overflow-hidden">
                                <div className="flex justify-between px-4 bg-gray-500 text-white text-xs items-center">
                                    <p className="text-sm">{match[1]}</p>
                                    <button className="py-1 inline-flex items-center gap-1" onClick={() => {
                                        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                        setCopy(true);
                                        setTimeout(() => {
                                            setCopy(false);
                                        }, 2000);
                                    }}>
                                        <span className="text-base mt-1">
                                            <Copy size={16} />
                                        </span>
                                        {copy ? "Copied" : "Copy"}
                                    </button>
                                </div>
                                <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} {...props} wrapLongLines>
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        </div >
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
            }}
        >
            {content}
        </Markdown>)
}