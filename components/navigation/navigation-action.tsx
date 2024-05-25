"use client";

import { Bird } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { useSocket } from "../providers/socket-provider";
import { cn } from "@/lib/utils";
export const NavigationAction = () => {
  const { onOpen } = useModal();
  const { isConnected } = useSocket();
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Bird
              className={cn("group-hover:text-white -rotate-3 transition ", isConnected ? "text-emerald-500" :"text-yellow-600")}
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
