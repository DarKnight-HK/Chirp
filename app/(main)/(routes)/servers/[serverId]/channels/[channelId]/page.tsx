import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChannelType } from "@prisma/client";
import { MediaRoom } from "@/components/media-room";
interface Props {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIDPage = async ({ params }: Props) => {
  const profile = await currentProfile();
  if (!profile) {
    auth().redirectToSignIn();
  }
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const members = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile?.id,
    },
  });

  if (!channel || !members) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={members}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={false} />
      )}
    </div>
  );
};
export default ChannelIDPage;
