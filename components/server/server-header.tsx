"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface Props {
  role?: MemberRole;
  server: ServerWithMembersWithProfiles;
}

export const ServerHeader = ({ server, role }: Props) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="size-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer focus:bg-[#505CDC] focus:!text-white"
          >
            Invite People
            <UserPlus className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="px-3 py-2 text-sm cursor-pointer focus:bg-[#505CDC] focus:!text-white"
          >
            Server Settings
            <Settings className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="px-3 py-2 text-sm cursor-pointer focus:bg-[#505CDC] focus:!text-white"
          >
            Manage Members
            <Users className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer focus:bg-[#505CDC] focus:!text-white">
            Create Channel
            <PlusCircle className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer focus:bg-[#DA373C] focus:!text-white">
            Delete Server
            <Trash className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer focus:bg-[#DA373C] focus:!text-white">
            Leave Server
            <LogOut className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
