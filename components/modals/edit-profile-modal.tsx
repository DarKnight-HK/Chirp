"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Profile name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Profile image is required",
  }),
  bio: z.string().max(20, {
    message: "Bio cannot exceed 20 characters in length",
  }),
});

export const EditProfileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "editProfile";
  const router = useRouter();
  const { profile } = data;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.setValue("name", profile.name);
      form.setValue("imageUrl", profile.imageUrl);
      if (profile.bio) {
        form.setValue("bio", profile.bio);
      }
    }
  }, [data, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/profile/${profile?.id}`, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#313338]  dark:text-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Edit Server Profile
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endPoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold  text-zinc-600 dark:text-zinc-400">
                      Profile Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="dark:bg-[#1E1F22] bg-zinc-100 border-0 focus-visible:ring-0 text-zinc-600 dark:text-zinc-300 focus-visible:ring-offset-0"
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold  text-zinc-600 dark:text-zinc-400">
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="dark:bg-[#1E1F22] bg-zinc-100 border-0 focus-visible:ring-0 text-zinc-600 dark:text-zinc-300 focus-visible:ring-offset-0"
                        placeholder="About yourself..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="dark:bg-[#2B2D31] bg-gray-100 px-6 py-4">
              <Button
                disabled={isLoading}
                onClick={onClose}
                className="hidden md:flex mr-auto"
                variant="link"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
