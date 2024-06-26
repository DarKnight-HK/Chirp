"use client";
import ReactPlayer from "react-player";
import { EmojiPicker } from "../emoji-picker";
import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Crown, Edit, FileIcon, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter, useParams } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { format } from "date-fns";

import { UserCard } from "../user-card";
import { AiChat } from "./ai-chat";
interface Props {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timeStamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 ml-2 text-indigo-500 " />,
  ADMIN: <Crown className="size-4 ml-2 fill-amber-500 text-amber-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const DATE_FORMAT = "d MMM yyyy";

export const ChatItem = ({
  id,
  content,
  member,
  timeStamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketQuery,
  socketUrl,
}: Props) => {
  const router = useRouter();
  const params = useParams();
  const { onOpen, onClose, data } = useModal();
  const { profile } = data;
  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      onOpen("editProfile", { profile });
      return;
    }
    router.refresh();
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fileType = fileUrl?.split(".").pop();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isVideo =
    (fileType === "mp4" && fileUrl) ||
    (content.startsWith("https://") && content.endsWith(".mp4"));
  const isYoutubeVideo = content.startsWith("https://www.youtube.com/watch?v=");
  const isAi = content.toLowerCase().startsWith("/ai ");

  const isImage =
    (!isPDF && !isVideo && fileUrl) ||
    (content.startsWith("https://") &&
      (content.endsWith(".gif") || content.endsWith(".jpg")));
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 w-full transition">
      <div className="group flex gap-x-2 items-start w-full ">
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer hover:drop-shadow-md transition">
              <UserAvatar src={member.profile.imageUrl} />
            </div>
          </PopoverTrigger>
          <PopoverContent side="right" className="h-[300px] w-[250px]">
            <UserCard
              name={member.profile.name}
              imageUrl={member.profile.imageUrl}
              bio={!!member.profile.bio ? member.profile.bio : ""}
              createdAt={format(
                new Date(member.profile.createdAt),
                DATE_FORMAT
              )}
              onClick={onMemberClick}
              label={
                member.id !== currentMember.id ? "Message" : "Edit Profile"
              }
            />
          </PopoverContent>
        </Popover>
        <div className="flex flex-col w-full ">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <p className="font-semibold text-sm hover:underline cursor-pointer">
                    {member.profile.name}
                  </p>
                </PopoverTrigger>
                <PopoverContent side="right" className="h-[300px] w-[250px]">
                  <UserCard
                    name={member.profile.name}
                    imageUrl={member.profile.imageUrl}
                    bio={!!member.profile.bio ? member.profile.bio : ""}
                    createdAt={format(
                      new Date(member.profile.createdAt),
                      DATE_FORMAT
                    )}
                    onClick={onMemberClick}
                    label={
                      member.id !== currentMember.id
                        ? "Message"
                        : "Edit Profile"
                    }
                  />
                </PopoverContent>
              </Popover>

              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timeStamp + (isAi ? " (AI Generated)" : "")}
            </span>
          </div>
          {isImage && (
            <a
              href={!!fileUrl ? fileUrl : content}
              target="_blank"
              rel="noopener noreferer"
              className="relative aspect-sqaure rounded-md mt-2 overflow-hidden border flex items-center bg-secondary size-48"
            >
              <Image
                src={!!fileUrl ? fileUrl : content}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center overflow-auto p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {isVideo && (
            <ReactPlayer
              url={!!fileUrl ? fileUrl : content}
              controls
              light
              playing
              height="280px"
              width="280px"
            />
          )}
          {isYoutubeVideo && (
            <ReactPlayer
              url={content}
              controls
              light
              playing
              height="240px"
              width="320px"
            />
          )}
          {isAi && (
            <div className="flex overflow-hidden flex-col">
              <AiChat messageId={id} />
            </div>
          )}
          {(isVideo || isImage || isYoutubeVideo) && content && (content = "")}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                          <div className="absolute top-[9px] right-[18px]">
                            <EmojiPicker
                              onChange={(emoji: any) =>
                                field.onChange(`${field.value} ${emoji}`)
                              }
                            />
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Send
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press Escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition size-4"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto  text-zinc-500 hover:text-zinc-600  dark:hover:text-zinc-300 transition size-4"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
