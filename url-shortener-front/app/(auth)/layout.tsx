import React from "react";
import { Toaster } from "sonner";

export default async function Layout(
    {children}: {children: React.ReactNode}
) {
    return (
        <div className="min-h-screen min-w-screen p-8 flex items-center justify-center">
            {children}
            <Toaster />
        </div>
    )
}


// https://medium.com/@ahsanmubariz/implementing-token-management-with-fetch-in-next-js-df66c4e5b7bc