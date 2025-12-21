import { getToken } from "@/lib/cookie.lib";
import { redirect } from "next/navigation";
import React from "react";
import { Toaster } from "sonner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
