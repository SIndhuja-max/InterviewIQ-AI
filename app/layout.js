import { Inter }
from "next/font/google";

import "./globals.css";

import {
  ClerkProvider,
} from "@clerk/nextjs";

import {
  Toaster,
} from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {

  title: "InterviewIQ AI",

  description:
    "AI-powered mock interview platform with analytics and voice feedback.",
  
   icons: {
     icon: "/favicon.png",
  },

};

export default function RootLayout({
  children,
}) {

  return (

    <ClerkProvider>

      <html lang="en">

        <body
          className={`
            ${inter.className}
            bg-black
            text-white
          `}
        >

          <Toaster />

          {children}

        </body>

      </html>

    </ClerkProvider>
  );
}