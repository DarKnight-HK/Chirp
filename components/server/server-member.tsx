"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { Crown, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

interface Props {
  member: Member & { profile: Profile };
  read: boolean;
}
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="size-4 ml-auto text-indigo-500" />
  ),
  [MemberRole.ADMIN]: (
    <Crown className="size-4 ml-auto  fill-amber-500 text-amber-500" />
  ),
};
export const ServerMember = ({ member, read }: Props) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMap[member.role];
  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "group p-2 rounded-md flex items-center w-full gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      {!read && <div className="size-2 rounded-full fill-red-500 bg-red-500" />}
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />

      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
