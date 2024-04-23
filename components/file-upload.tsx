"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css"

interface Props {
    onChange: (url?: string) => void;
    value: string;
    endPoint: "messageFile" | "serverImage"


}

export const FileUpload = ({
    onChange,
    value,
    endPoint,
}: Props) => {

    const fileType = value.split(".").pop();

    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="Uplaod"
                    className="rounded-full"
                />
                <button onClick={()=>onChange("")}
                className="bg-rose-500 p-1 rounded-full text-white absolute top-0 right-0 shadow-sm" type="button">
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <UploadDropzone
            endpoint={endPoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                console.log(error);
            }}
        />


    )
}