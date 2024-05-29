"use client";

import { fetchAiData } from "@/lib/fetchAiData";
import { useEffect, useState } from "react";
import { FormatToMarkdown } from "../formatToMarkdown";

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
        <FormatToMarkdown content={response} />
    )
}