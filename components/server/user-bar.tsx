"use client";

import { UserButton, UserProfile } from "@clerk/nextjs";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { Crown, LogOut, Settings, UserRound } from "lucide-react";
import { useState } from "react";

type Props = {
  profile: any;
  server: ServerWithMembersWithProfiles;
  owner: boolean;
};

export const UserBar = ({ profile, server, owner }: Props) => {
  const [open, setOpen] = useState(false);
  const onClick = () => {
    setOpen(true);
  };
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
        <p className="flex text-sm font-semibold ml-1 group-hover:hidden transition">
          {owner ? "Owner" : "Member"}
          {owner ? (
            <Crown className="ml-[6px] mt-[2px] size-4 fill-amber-500 text-amber-500" />
          ) : (
            <UserRound className="ml-[6px] mt-[2px] size-4 fill-gray-600 dark:fill-gray-300" />
          )}
        </p>
        <p className="hidden group-hover:flex text-xs text-zinc-800 dark:text-zinc-300 transition duration-300">
          {profile.email}
        </p>
      </div>

      {owner ? (
        <ActionTooltip label="Server Settings" side="top">
          <div
            onClick={() => onOpen("editServer", { server })}
            className="ml-auto group flex items-center justify-center mr-3 hover:bg-zinc-400 dark:hover:bg-zinc-600 size-8 rounded-md"
          >
            <Settings className="size-4 text-zinc-600 dark:text-white group-hover:animate-spin duration-100" />
          </div>
        </ActionTooltip>
      ) : (
        <ActionTooltip label="Leave Server" side="top">
          <div
            onClick={() => onOpen("leaveServer", { server })}
            className="ml-auto group flex items-center justify-center mr-3 hover:bg-zinc-400 dark:hover:bg-zinc-600 size-8 rounded-md"
          >
            <LogOut className="size-4 text-rose-600 focus:bg-[#DA373C]" />
          </div>
        </ActionTooltip>
      )}
    </div>
  );
};
