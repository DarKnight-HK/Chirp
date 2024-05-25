import { auth } from "@clerk/nextjs/server";
import { currentProfile } from "./current-profile";
import { getOrCreateConversation } from "./conversation";
import { db } from "./db";

export const CheckRead = async (memberOneId: string, memberTwoId: string) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }
  const conversation = await getOrCreateConversation(memberOneId, memberTwoId);
  if (conversation) {
    const directMessage = await db.directMessage.findFirst({
      where: {
        conversationId: conversation.id,
        memberId: {
          not: memberTwoId,
        },
      },
      select: {
        read: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (directMessage !== null) {
      return directMessage.read;
    }
  }

  return true;
};
