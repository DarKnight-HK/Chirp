"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

interface Props {
  onChange: (url?: string) => void;
  value: string;
  endPoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endPoint }: Props) => {
  const fileType = value.split(".").pop();
  const isPDF = fileType === "pdf";
  const isGif = fileType === "gif";
  const isVideo = fileType === "mp4";

  const isImage = !isPDF && !isVideo;
  if (value && isImage) {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Uplaod" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 p-1 rounded-full text-white absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && (isPDF || isGif || isVideo)) {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 p-1 rounded-full text-white absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadButton
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
