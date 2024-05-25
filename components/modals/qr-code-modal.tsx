"use client";

import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";
import qrcode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

export const QRCodeModal = () => {
  const [src, setSrc] = useState<string>("");
  const origin = useOrigin();
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "qrCode";
  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  qrcode.toDataURL(`${inviteUrl}`).then(setSrc);
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#313338]  dark:text-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center mt-2 gap-x-2 p-6">
          <Image src={src} alt="Qr Code" height={256} width={256} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
