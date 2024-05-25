"use client";

import { UserButton } from "@clerk/nextjs";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { Crown, Settings, UserRound } from "lucide-react";

type Props = {
  profile: any;
  server: ServerWithMembersWithProfiles;
  owner: boolean;
};

export const UserBar = ({ profile, owner }: Props) => {
  const { onOpen } = useModal();
  return (
    <div className="h-14 w-full z-50 bottom-0 flex items-center bg-[#E3E5E8] dark:bg-[#1E1F22] mt-auto">
      <ActionTooltip side="right" label={profile.name}>
        <div className="flex ml-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "size-8 focus-visible:ring-0 foucs-visible:ring-offset-0 pointer-events-none",
              },
            }}
          />
        </div>
      </ActionTooltip>
      <div className="ml-2 flex flex-col group">
        <p className="text-xs ml-[4px] dark:text-zinc-300 text-zinc-800">
          {profile.name}
        </p>
        <p className="hidden text-sm font-semibold ml-1 group-hover:flex transition ease-out duration-700">
          {owner ? "Owner" : "Member"}
          {owner ? (
            <Crown className="ml-[6px] mt-[2px] size-4 fill-amber-500 text-amber-500" />
          ) : (
            <UserRound className="ml-[6px] mt-[2px] size-4 fill-gray-600 dark:fill-gray-300" />
          )}
        </p>
        <p className="flex group-hover:hidden ml-[2px] max-w-screen text-xs text-zinc-800 dark:text-zinc-300 overflow-hidden ease-in group-hover:transition truncate duration-300">
          {profile.bio}
        </p>
      </div>

      <ActionTooltip label="Profile Settings" side="top">
        <div
          onClick={() => onOpen("editProfile", { profile })}
          className="ml-auto group flex items-center justify-center mr-3 hover:bg-zinc-400 dark:hover:bg-zinc-600 size-8 rounded-md"
        >
          <Settings className="size-4 text-zinc-600 dark:text-white group-hover:animate-spin duration-100" />
        </div>
      </ActionTooltip>
    </div>
  );
};
