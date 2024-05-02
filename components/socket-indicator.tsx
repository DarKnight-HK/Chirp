"use client";

import { cn } from "@/lib/utils";
import { useSocket } from "./providers/socket-provider";
import { ActionTooltip } from "./action-tooltip";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  return (
    <ActionTooltip label={isConnected ? "Connected" : "Pooling"} side="left">
      <div
        className={cn(
          "size-3 rounded-lg mr-2",
          isConnected ? "bg-emerald-500" : "bg-yellow-600"
        )}
      >
        {" "}
      </div>
    </ActionTooltip>
  );
};
