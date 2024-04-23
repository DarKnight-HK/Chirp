import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  className?: string;
}

export const UserAvatar = ({ src, className }: Props) => {
  return (
    <Avatar className={cn("size-7 md:size-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};
