"use client";

import { Spinner } from "@/components/ui/spinner";
import {
  getUrlFromServer,
  increaseUrlCount,
  UrlResponse,
} from "@/lib/actions/url";
import { UrlModel } from "@/types/UrlModel";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const params = useParams<{ short: string }>();

  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [url, setUrl] = useState<UrlResponse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [redirectItem, setRedirectItem] = useState<string>("");

  useEffect(() => {
    const increaseCount = async () => {
      if (url?.data) {
      console.log("increase count");
      await increaseUrlCount(params.short);
      setRedirectItem(url?.data?.url!)
      }

    };

    increaseCount();
  }, [url]);

  useEffect(() => {
    setLoader(true);
    console.log("start getting url");
    const fetchData = async () => {
      const response = await getUrlFromServer(params.short);
      if (response.error) {
        setNotFound(true);
      }
      setUrl(response);
      setLoader(false);
    };

    fetchData();
  }, []);

  if (notFound) {
    router.push("/notfound");
  }

  if (redirectItem) {
    redirect(redirectItem)
  }
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center p-10 bg-gray-100">
      {loader && <Spinner />}

      {url && (
        <div>
          url got:
          {url.data?.short}
        </div>
      )}
    </div>
  );
}


