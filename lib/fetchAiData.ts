"use server";
import { db } from "./db";

export const fetchAiData = async (messageId: string) => {
  const ai = await db.aiResponse.findFirst({
    where: {
      MessageId: messageId,
    },
    select: {
      content: true,
    },
  });
  return ai?.content || "";
};
