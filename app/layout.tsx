import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
const font = Open_Sans({ subsets: ["latin"] });
import { dark } from "@clerk/themes";
import "@uploadthing/react/styles.css";
import { QueryProvider } from "@/components/providers/query-provider";
export const metadata: Metadata = {
  title: "Chirp",
  description: "A real-time messaging app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider
        appearance={{
          signIn: {
            baseTheme: dark,
          },
        }}
      >
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <link rel="icon" href="/images/favicon.ico" />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
