"use client";

import { useState, useEffect, use } from "react";
import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface Props {
  chatId: string;
  video: boolean;
  audio: boolean;
}

const { user } = useUser();
const [token, setToken] = useState("");

export const MediaRoom = ({ chatId, video, audio }: Props) => {
  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;
    const name = `${user.firstName} ${user.lastName}`;
    (async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Loader2 className="animate-spin my-4 size-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};