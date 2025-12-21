"use client";
import { MenuSheet } from "@/components/menu-sheet";
import Link from "next/link";
import { Toaster } from "sonner";
import { Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import MenuContents from "@/components/menu-contents";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen min-w-screen bg-gray-200">
      <MenuContents pathname={pathname} classname="hidden rounded-xl bg-gray-50"/>

      <div className=" md:w-4/5 w-full rounded-xl bg-white  md:mt-2 md:mb-2 md:ms-1 md:me-2">
        <div className="md:hidden">
          <MenuSheet />
        </div>
        {children}
      </div>
      <Toaster />
    </div>
  );
}
