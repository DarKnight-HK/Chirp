"use client";

import { Button } from "./ui/button";
import { UserAvatar } from "./user-avatar";

interface Props {
  name: string;
  imageUrl: string;
  bio?: string;
  createdAt: string;
  label: "Message" | "Edit Profile";
  onClick: () => void;
}

export const UserCard = ({
  name,
  imageUrl,
  bio,
  createdAt,
  onClick,
  label,
}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center">
        <UserAvatar
          src={imageUrl}
          className="drop-shadow-xl size-[64px] md:h-[64px] md:w-[64px] dark:stroke-zinc-300"
        />
      </div>
      <div className="flex items-center justify-center mt-6 font-bold text-xl">
        {name}
      </div>
      <div className="text-zinc-600 dark:text-zinc-400 text-sm flex items-center justify-center mt-3">
        {bio}
      </div>
      <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-8">
        Member since: {"   " + createdAt}
      </div>
      <Button onClick={onClick} variant="primary" className="mt-8">
        {label}
      </Button>
    </div>
  );
};
