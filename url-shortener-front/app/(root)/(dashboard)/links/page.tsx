"use client";
import { CreateLinkDialog } from "@/components/create-link-dialog";
import { Button } from "@/components/ui/button";
import { getUrlList, UrlResponse } from "@/lib/actions/url";
import { FormattedTime } from "@/lib/date";
import { TruncatedText } from "@/lib/string.utils";
import { cn } from "@/lib/utils";
import { UrlModel } from "@/types/UrlModel";
import {
  ClockIcon,
  Copy,
  Mouse,
  MousePointer,
  MousePointerClick,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [urls, setUrls] = useState<UrlModel[]>([]);
  const [urlResponseError, setUrlResponseError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const urlResponse = await fetch("/api/external/url/list");
      // const urlResponse = await fetch("/api/external/auth/refresh");

      if (urlResponse.ok) {
        const data = await urlResponse.json();
        setUrls(data.data);
        console.log("urls got");
      } else {
        const error = await urlResponse.json();
        setUrlResponseError(error.error! || "Failed to get url list");
        console.log("error getting urls");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col px-8 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Links</h1>

        <CreateLinkDialog
          onCreateLink={async (url: string) => {
            const urlResponse = await fetch("/api/external/url/create", {
              method: "POST",
              body: JSON.stringify({
                url: url,
              }),
            });
            if (urlResponse.ok) {
              toast("Url created");
              const url = await urlResponse.json();
              const list = [...urls];
              list.push(url);
              setUrls(list);
            }
          }}
        />
      </div>

      <hr className="mt-8" />

      <div>{urlResponseError && <div>{urlResponseError}</div>}</div>

      <div>{urls.length > 0 && <UrlList urls={urls} />}</div>
    </div>
  );
}

function UrlList({ urls }: { urls: UrlModel[] }) {
  const [isBouncing, setIsBouncing] = useState(false);

  return (
    <div className="w-full mt-8 p-2 overflow-y-auto max-h-190">
      {urls.map((item) => {
        return (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl
        ring-gray-300 ring-1 w-full px-8 py-6 mt-6 hover:shadow-xl hover:shadow-gray-100"
          >
            <div className="flex items-center justify-center">
              <div className="rounded-full w-6 h-6 ring-1 ring-gray-300 ring-offset-8 bg-linear-to-r from-sky-400 to-violet-500" />

              <div>
                <div className="flex items-center justify-start ms-5">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/u/${item.short}`}
                    target="_blank"
                  >
                    <h1 id={`h1:${item.id}`} className="text-xl font-semibold">
                      {process.env.NEXT_PUBLIC_BASE_ENDPOINT}/u/{item.short}
                    </h1>
                  </Link>
                  <Copy
                    className={cn(
                      "h-6 ms-3 hover:cursor-pointer transition-all text-sky-500",
                      `${isBouncing} ? 'animate-bounce' : ''`
                    )}
                    onClick={async () => {
                      setIsBouncing(true);
                      setTimeout(() => setIsBouncing(false), 1000);
                      const doc = document.getElementById(`h1:${item.id}`);

                      await navigator.clipboard.writeText(
                        doc?.textContent || ""
                      );
                      toast("Text copied");
                    }}
                  />
                </div>
                <div className="flex items-center justify-start ms-5 gap-2 mt-1">
                  <svg
                    height="18"
                    width="18"
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 h-3 w-3 shrink-0 text-neutral-400"
                  >
                    <g fill="currentColor">
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        x1="15.25"
                        x2="2.75"
                        y1="9"
                        y2="9"
                      ></line>
                      <polyline
                        fill="none"
                        points="11 4.75 15.25 9 11 13.25"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></polyline>
                    </g>
                  </svg>
                  <Link href={item.url} target="_blank">
                    <h1 className="font-normal hover:underline">
                      {TruncatedText({ text: item.url, maxLength: 80 })}
                    </h1>
                  </Link>
                  <h1 className="text-gray-500 text-md ps-2">
                    {FormattedTime(item.createdAt)}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-xl bg-gray-100 flex items-center justify-center gap-2 px-3 py-2 ring-1 ring-gray-300 ">
                <MousePointerClick />
                {item.clicks}

                <h1>Clicks</h1>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
